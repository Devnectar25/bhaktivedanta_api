import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

function rowsToState(rows) {
  const categoriesMap = {};
  const services = [];

  rows.forEach(row => {
    if (row.category_id && !categoriesMap[row.category_id]) {
      categoriesMap[row.category_id] = {
        id: row.category_id,
        name: row.category_name || 'Unassigned',
        description: row.category_description || '',
        order: row.category_order || 1,
        status: row.category_status !== false,
        adminId: row.admin_id || 'ADM-001',
        adminName: row.admin_name || 'Super Administrator',
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString()
      };
    }

    services.push({
      id: row.id,
      categoryId: row.category_id,
      name: row.service_name,
      icon: row.icon || 'medical_services',
      shortDescription: row.short_description || '',
      bannerImage: row.banner_image || '',
      thumbnailImage: row.thumbnail_image || '',
      slug: row.slug || '',
      status: row.status === 'Active' || row.status === 'Live' || row.status === true,
      adminId: row.admin_id || 'ADM-001',
      adminName: row.admin_name || 'Super Administrator',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
      tabs: Array.isArray(row.tabs_data) ? row.tabs_data : []
    });
  });

  const categories = Object.values(categoriesMap).sort((a, b) => a.order - b.order);

  return {
    categories,
    services
  };
}

// POST upload service media (image/video) to Supabase Storage or Base64
router.post('/upload', async (req, res, next) => {
  try {
    const { serviceName, fileName, base64Data } = req.body || {};
    if (!base64Data) {
      return res.status(400).json({ error: 'No media data provided' });
    }

    // Convert base64 to Buffer
    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // Extract mime type & extension
    const mimeMatch = base64Data.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const ext = mimeType.split('/')[1] || (mimeType.startsWith('video') ? 'mp4' : 'png');

    // Create a clean slug from the service name
    const slug = (serviceName || 'service')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const timestamp = Date.now();
    const filePath = `${slug}/${slug}-${timestamp}.${ext}`;

    if (supabase) {
      const bucketName = mimeType.startsWith('video') ? 'specialities-images' : 'specialities-images';
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        console.error('[API Services Upload] Supabase Storage upload error:', error.message);
        return res.json({ success: true, url: base64Data, path: filePath, fallback: true });
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl || '';
      console.log(`[API Services Upload] Uploaded media for "${serviceName}" ->`, publicUrl);
      return res.json({ success: true, url: publicUrl, path: filePath });
    } else {
      return res.json({ success: true, url: base64Data, path: filePath });
    }
  } catch (err) {
    console.error('[API Services Upload] Error handling media upload:', err);
    next(err);
  }
});

// Helper to get current state (either from Supabase or JSON storage)
async function getCurrentState() {
  if (supabase) {
    try {
      const [srvRes, catRes] = await Promise.all([
        supabase.from('admin_services').select('*'),
        supabase.from('bv_service_categories').select('*').order('order', { ascending: true })
      ]);

      const srvData = srvRes.data || [];
      const catData = catRes.data || [];

      if (!srvRes.error && srvData.length > 0) {
        let state = rowsToState(srvData);
        if (!catRes.error && catData && catData.length > 0) {
          state.categories = catData.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description || '',
            order: c.order || 1,
            status: c.status !== false,
            adminId: c.adminId || 'ADM-001',
            adminName: c.adminName || 'Super Administrator',
            createdAt: c.created_at || new Date().toISOString(),
            updatedAt: c.updated_at || new Date().toISOString()
          })).sort((a, b) => a.order - b.order);
        }
        return state;
      }
    } catch (e) {
      console.error('[API] Supabase read error, falling back to JSON:', e);
    }
  }

  return readData('services_state') || { categories: [], services: [] };
}

// Helper to trigger Next.js / ISR revalidation webhook if configured
async function triggerISRRevalidation(paths = ['/services', '/']) {
  const webhookUrl = process.env.ISR_REVALIDATE_URL || process.env.REVALIDATE_WEBHOOK_URL;
  const secret = process.env.REVALIDATE_SECRET || '';
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-revalidate-secret': secret } : {})
        },
        body: JSON.stringify({ paths, timestamp: Date.now() })
      });
      console.log(`[API] ISR revalidation triggered for paths:`, paths);
    } catch (e) {
      console.warn(`[API] ISR revalidation trigger failed:`, e.message);
    }
  }
}

// Helper to save state (sync with Supabase and JSON storage)
async function saveFullState(state) {
  const now = new Date().toISOString();
  const services = Array.isArray(state.services) ? state.services : [];
  const categories = Array.isArray(state.categories) ? state.categories : [];
  const categoriesMap = {};
  categories.forEach(c => { categoriesMap[c.id] = c; });

  if (supabase) {
    try {
      // 1. Sync Categories to bv_service_categories (delete removed + upsert remaining)
      const keptCatIds = categories.map(c => c.id);
      const { data: existingCats } = await supabase.from('bv_service_categories').select('id');
      if (existingCats && existingCats.length > 0) {
        const catIdsToDelete = existingCats.map(r => r.id).filter(id => !keptCatIds.includes(id));
        if (catIdsToDelete.length > 0) {
          console.log('[API Services] Deleting removed categories from Supabase bv_service_categories:', catIdsToDelete);
          await supabase.from('bv_service_categories').delete().in('id', catIdsToDelete);
        }
      }

      if (categories.length > 0) {
        const catRowsToUpsert = categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || '',
          order: parseInt(cat.order) || 1,
          status: cat.status !== false,
          adminId: cat.adminId || 'ADM-001',
          adminName: cat.adminName || 'Super Administrator',
          created_at: cat.createdAt || now,
          updated_at: now
        }));

        await supabase.from('bv_service_categories').upsert(catRowsToUpsert, { onConflict: 'id' });
      }

      // 2. Sync Services to admin_services (delete removed + upsert remaining)
      const keptServiceIds = services.map(s => s.id);
      const { data: existingServices } = await supabase.from('admin_services').select('id');
      if (existingServices && existingServices.length > 0) {
        const srvIdsToDelete = existingServices.map(r => r.id).filter(id => !keptServiceIds.includes(id));
        if (srvIdsToDelete.length > 0) {
          console.log('[API Services] Deleting removed services from Supabase admin_services:', srvIdsToDelete);
          await supabase.from('admin_services').delete().in('id', srvIdsToDelete);
        }
      }

      if (services.length > 0) {
        const rowsToInsert = services.map(srv => {
          const cat = categoriesMap[srv.categoryId] || {};
          return {
            id: srv.id,
            service_name: srv.name,
            icon: srv.icon || 'medical_services',
            short_description: srv.shortDescription || srv.description || '',
            banner_image: srv.bannerImage || '',
            thumbnail_image: srv.thumbnailImage || '',
            slug: srv.slug || '',
            status: srv.status ? 'Active' : 'Draft',
            category_id: srv.categoryId || 'c1',
            category_name: cat.name || 'Unassigned',
            category_description: cat.description || '',
            category_order: cat.order || 1,
            category_status: cat.status !== false,
            tabs_data: srv.tabs || [],
            admin_id: srv.adminId || 'ADM-001',
            admin_name: srv.adminName || 'Super Administrator',
            created_at: srv.createdAt || now,
            updated_at: now
          };
        });

        await supabase.from('admin_services').upsert(rowsToInsert, { onConflict: 'id' });
      }
    } catch (e) {
      console.error('[API Services] Supabase sync error in saveFullState:', e);
    }
  }

  writeData('services_state', state);
  triggerISRRevalidation(['/services', '/']);
  return state;
}

// ----------------------------------------------------
// DELETE SINGLE SERVICE
// ----------------------------------------------------
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();
    const serviceIndex = (state.services || []).findIndex(s => s.id === id);

    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    state.services.splice(serviceIndex, 1);
    await saveFullState(state);

    if (supabase) {
      try {
        await supabase.from('admin_services').delete().eq('id', id);
      } catch (e) {
        console.error('[API Services] Supabase delete error:', e);
      }
    }

    res.json({ success: true, message: `Service ${id} deleted successfully`, state });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// DELETE SERVICE CATEGORY
// ----------------------------------------------------
router.delete('/categories/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();
    state.categories = (state.categories || []).filter(c => c.id !== id);
    state.services = (state.services || []).map(s => s.categoryId === id ? { ...s, categoryId: null } : s);

    await saveFullState(state);

    if (supabase) {
      try {
        await supabase.from('bv_service_categories').delete().eq('id', id);
      } catch (e) {
        console.error('[API Services] Supabase category delete error:', e);
      }
    }

    res.json({ success: true, message: `Service category ${id} deleted successfully`, state });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 1. GET ALL SERVICES STATE (Supports dynamic query params: ?categoryId=...&limit=... without hardcoded cutting)
// ----------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const state = await getCurrentState();
    const { categoryId, limit } = req.query;

    let filteredServices = state.services || [];
    if (categoryId) {
      filteredServices = filteredServices.filter(s => s.categoryId === categoryId);
    }

    if (limit && !isNaN(parseInt(limit))) {
      filteredServices = filteredServices.slice(0, parseInt(limit));
    }

    res.json({
      categories: state.categories || [],
      services: filteredServices
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. GET SINGLE SERVICE BY ID OR SLUG
// ----------------------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();
    const service = state.services.find(s => s.id === id || s.slug === `/${id}` || s.slug === id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 3. PUT UPDATE ENTIRE SERVICES STATE
// ----------------------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const updated = await saveFullState(payload);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 4. POST ADD A NEW TAB TO A SERVICE
// ----------------------------------------------------
router.post('/:id/tabs', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type, content, items, steps, cards, galleryImages, enabled = true } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Tab title and type are required' });
    }

    const state = await getCurrentState();
    const srvIndex = state.services.findIndex(s => s.id === id || s.slug === `/${id}` || s.slug === id);

    if (srvIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const currentTabs = state.services[srvIndex].tabs || [];
    const newTab = {
      id: `tab_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      type, // 'rich_text', 'list', 'cards', 'gallery', 'steps', 'testimonials'
      order: currentTabs.length + 1,
      enabled: enabled !== false,
      content: content || null,
      items: items || [],
      steps: steps || [],
      cards: cards || [],
      galleryImages: galleryImages || []
    };

    state.services[srvIndex].tabs = [...currentTabs, newTab];
    state.services[srvIndex].updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.status(201).json({ success: true, tab: newTab, service: state.services[srvIndex] });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 5. PUT REORDER TABS ON A SERVICE
// ----------------------------------------------------
router.put('/:id/tabs/reorder', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tabIds } = req.body; // Array of tab IDs in desired order

    if (!Array.isArray(tabIds)) {
      return res.status(400).json({ error: 'tabIds array is required' });
    }

    const state = await getCurrentState();
    const srvIndex = state.services.findIndex(s => s.id === id || s.slug === `/${id}` || s.slug === id);

    if (srvIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const currentTabs = state.services[srvIndex].tabs || [];
    const tabMap = new Map(currentTabs.map(t => [t.id, t]));

    const reorderedTabs = tabIds
      .map((tabId, index) => {
        const tab = tabMap.get(tabId);
        if (tab) {
          return { ...tab, order: index + 1 };
        }
        return null;
      })
      .filter(Boolean);

    // Append any tabs not included in tabIds at the end
    currentTabs.forEach(tab => {
      if (!tabIds.includes(tab.id)) {
        reorderedTabs.push({ ...tab, order: reorderedTabs.length + 1 });
      }
    });

    state.services[srvIndex].tabs = reorderedTabs;
    state.services[srvIndex].updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tabs: reorderedTabs, service: state.services[srvIndex] });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 6. PUT UPDATE A SPECIFIC TAB
// ----------------------------------------------------
router.put('/:id/tabs/:tabId', async (req, res, next) => {
  try {
    const { id, tabId } = req.params;
    const updates = req.body;

    const state = await getCurrentState();
    const srvIndex = state.services.findIndex(s => s.id === id || s.slug === `/${id}` || s.slug === id);

    if (srvIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const currentTabs = state.services[srvIndex].tabs || [];
    const tabIndex = currentTabs.findIndex(t => t.id === tabId);

    if (tabIndex === -1) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    currentTabs[tabIndex] = {
      ...currentTabs[tabIndex],
      ...updates,
      id: tabId // Preserve ID
    };

    state.services[srvIndex].tabs = currentTabs;
    state.services[srvIndex].updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tab: currentTabs[tabIndex], service: state.services[srvIndex] });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 7. DELETE A TAB FROM A SERVICE
// ----------------------------------------------------
router.delete('/:id/tabs/:tabId', async (req, res, next) => {
  try {
    const { id, tabId } = req.params;

    const state = await getCurrentState();
    const srvIndex = state.services.findIndex(s => s.id === id || s.slug === `/${id}` || s.slug === id);

    if (srvIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const currentTabs = state.services[srvIndex].tabs || [];
    const filteredTabs = currentTabs
      .filter(t => t.id !== tabId)
      .map((t, idx) => ({ ...t, order: idx + 1 }));

    state.services[srvIndex].tabs = filteredTabs;
    state.services[srvIndex].updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tabs: filteredTabs, service: state.services[srvIndex] });
  } catch (err) {
    next(err);
  }
});

export default router;
