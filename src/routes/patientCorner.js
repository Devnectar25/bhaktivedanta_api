import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

/**
 * Helper to convert Supabase rows to the exact frontend state shape
 */
function rowsToPatientCornerState(categoryRows = [], guideRows = []) {
  const categories = categoryRows.map(c => ({
    id: c.id,
    name: c.name || 'Unassigned',
    slug: c.slug || (c.name ? c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : c.id),
    description: c.description || '',
    order: c.order || 1,
    status: c.status !== false,
    max_items: c.max_items !== undefined ? parseInt(c.max_items, 10) : 6,
    maxItems: c.max_items !== undefined ? parseInt(c.max_items, 10) : 6,
    adminId: c.adminId || 'ADM-001',
    adminName: c.adminName || 'Super Administrator',
    createdAt: c.created_at || new Date().toISOString(),
    updatedAt: c.updated_at || new Date().toISOString()
  })).sort((a, b) => (a.order || 0) - (b.order || 0));

  const guides = guideRows.map(g => ({
    id: g.id,
    categoryId: g.category_id || 'pc-cat-guide',
    category: g.category_name || 'Patient Guide',
    title: g.title || 'Untitled Guide',
    name: g.title || 'Untitled Guide',
    slug: g.slug || (g.title ? g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : g.id),
    shortDescription: g.short_description || '',
    bannerImage: g.banner_image || '',
    status: g.status || 'Published',
    displayOrder: g.display_order || 1,
    order: g.display_order || 1,
    tabs: Array.isArray(g.tabs) ? g.tabs : [],
    adminId: g.admin_id || 'ADM-001',
    adminName: g.admin_name || 'Super Administrator',
    createdAt: g.created_at || new Date().toISOString(),
    updatedAt: g.updated_at || new Date().toISOString()
  })).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return { categories, guides };
}

/**
 * Retrieve current Patient Corner state (from Supabase, with JSON file fallback)
 */
async function getCurrentState() {
  if (supabase) {
    try {
      const [catsRes, guidesRes] = await Promise.all([
        supabase.from('bv_patient_corner_categories').select('*').order('order', { ascending: true }),
        supabase.from('admin_patient_corner_guides').select('*').order('display_order', { ascending: true })
      ]);

      if (!catsRes.error && !guidesRes.error) {
        return rowsToPatientCornerState(catsRes.data || [], guidesRes.data || []);
      }
      console.warn('Supabase patient corner query warning:', catsRes.error?.message, guidesRes.error?.message);
    } catch (err) {
      console.warn('Supabase fetch error, using local fallback:', err.message);
    }
  }

  // Local JSON fallback
  const state = readData('patient_corner_state');
  if (state && typeof state === 'object' && Array.isArray(state.guides)) {
    return state;
  }
  return { categories: [], guides: [] };
}

/**
 * Save full state (sync to Supabase & backup JSON file)
 */
async function saveFullState(state) {
  // Sync to local JSON backup
  try {
    writeData('patient_corner_state', state);
  } catch (e) {
    console.warn('Local backup write warning:', e.message);
  }

  if (supabase) {
    try {
      // 1. Sync Categories
      if (Array.isArray(state.categories)) {
        for (const cat of state.categories) {
          await supabase.from('bv_patient_corner_categories').upsert({
            id: cat.id,
            name: cat.name || 'Unassigned',
            description: cat.description || '',
            order: cat.order || 1,
            status: cat.status !== false,
            adminId: cat.adminId || 'ADM-001',
            adminName: cat.adminName || 'Super Administrator',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        }
      }

      // 2. Sync Guides
      if (Array.isArray(state.guides)) {
        for (const guide of state.guides) {
          await supabase.from('admin_patient_corner_guides').upsert({
            id: guide.id,
            title: guide.title || 'Untitled Guide',
            slug: (guide.slug || guide.title || guide.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            category_id: guide.categoryId || 'pc-cat-guide',
            category_name: guide.category || 'Patient Guide',
            short_description: guide.shortDescription || guide.short_description || '',
            banner_image: guide.bannerImage || '',
            status: guide.status || 'Published',
            display_order: parseInt(guide.displayOrder || guide.order, 10) || 1,
            tabs: Array.isArray(guide.tabs) ? guide.tabs : [],
            admin_id: guide.adminId || 'ADM-001',
            admin_name: guide.adminName || 'Super Administrator',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        }
      }
    } catch (err) {
      console.error('Error syncing patient corner to Supabase:', err.message);
    }
  }

  return state;
}

// ----------------------------------------------------
// POST UPLOAD PATIENT CORNER BANNER IMAGE (Supabase Storage)
// ----------------------------------------------------
router.post('/upload', async (req, res, next) => {
  try {
    const { guideTitle, title, fileName, base64Data } = req.body || {};
    if (!base64Data) {
      return res.status(400).json({ error: 'No media data provided' });
    }

    // Convert base64 to Buffer
    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // Extract mime type & extension
    const mimeMatch = base64Data.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const ext = mimeType.split('/')[1] || 'png';

    // Create a clean slug from the guide title
    const slug = (guideTitle || title || 'patient-guide')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const timestamp = Date.now();
    const filePath = `patient-corner/${slug}/${slug}-${timestamp}.${ext}`;

    if (supabase) {
      const bucketName = 'specialities-images';
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        console.error('[API Patient Corner Upload] Supabase Storage upload error:', error.message);
        return res.json({ success: true, url: base64Data, path: filePath, fallback: true });
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl || '';
      console.log(`[API Patient Corner Upload] Uploaded image for "${guideTitle || title || 'guide'}" ->`, publicUrl);
      return res.json({ success: true, url: publicUrl, path: filePath });
    } else {
      return res.json({ success: true, url: base64Data, path: filePath });
    }
  } catch (err) {
    console.error('[API Patient Corner Upload] Error handling image upload:', err);
    next(err);
  }
});

// ----------------------------------------------------
// 1. GET FULL PATIENTS CORNER STATE
// Query params supported: ?categoryId=... &status=... &limit=...
// ----------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const state = await getCurrentState();
    const { categoryId, status, limit } = req.query;

    let filteredGuides = state.guides || [];

    if (categoryId) {
      filteredGuides = filteredGuides.filter(g => g.categoryId === categoryId || g.category === categoryId);
    }

    if (status) {
      filteredGuides = filteredGuides.filter(g => 
        String(g.status).toLowerCase() === String(status).toLowerCase()
      );
    }

    if (limit && !isNaN(parseInt(limit, 10))) {
      filteredGuides = filteredGuides.slice(0, parseInt(limit, 10));
    }

    res.json({
      categories: state.categories || [],
      guides: filteredGuides
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. PUT FULL PATIENTS CORNER STATE
// ----------------------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.categories || !payload.guides) {
      return res.status(400).json({ error: 'Payload must contain categories and guides arrays' });
    }

    const updated = await saveFullState({
      categories: Array.isArray(payload.categories) ? payload.categories : [],
      guides: Array.isArray(payload.guides) ? payload.guides : []
    });

    res.json({ success: true, state: updated });
  } catch (err) {
    next(err);
  }
});

/**
 * Helper to validate maximum guides per category
 */
async function checkCategoryLimit(categoryId, excludeGuideId = null) {
  const targetCatId = categoryId || 'pc-cat-guide';
  let maxItems = 6;
  let currentCount = 0;

  if (supabase) {
    const [catRes, guidesRes] = await Promise.all([
      supabase.from('bv_patient_corner_categories').select('max_items').eq('id', targetCatId).maybeSingle(),
      supabase.from('admin_patient_corner_guides').select('id').eq('category_id', targetCatId)
    ]);
    maxItems = catRes.data?.max_items !== undefined ? parseInt(catRes.data.max_items, 10) : 6;
    const existingGuides = guidesRes.data || [];
    currentCount = excludeGuideId
      ? existingGuides.filter(g => g.id !== excludeGuideId).length
      : existingGuides.length;
  } else {
    const state = await getCurrentState();
    const cat = (state.categories || []).find(c => c.id === targetCatId);
    maxItems = cat?.max_items !== undefined ? parseInt(cat.max_items, 10) : (cat?.maxItems !== undefined ? parseInt(cat.maxItems, 10) : 6);
    const existingGuides = (state.guides || []).filter(g => g.categoryId === targetCatId || g.category_id === targetCatId);
    currentCount = excludeGuideId
      ? existingGuides.filter(g => g.id !== excludeGuideId).length
      : existingGuides.length;
  }

  if (currentCount >= maxItems) {
    return {
      allowed: false,
      error: `Is category me already ${maxItems} guides hain (maximum limit). Pehle koi guide hatao ya dusri category chuno.`,
      currentCount,
      maxItems
    };
  }

  return { allowed: true, currentCount, maxItems };
}

// ----------------------------------------------------
// 3. POST CREATE A NEW GUIDE
// Supports POST /guides or POST /
// ----------------------------------------------------
const handleCreateGuide = async (req, res, next) => {
  try {
    const {
      title,
      name,
      categoryId,
      category,
      slug,
      status = 'Published',
      displayOrder,
      order,
      bannerImage = '',
      shortDescription = '',
      tabs = []
    } = req.body;

    const guideTitle = (title || name || '').trim();
    if (!guideTitle) {
      return res.status(400).json({ error: 'Guide title is required' });
    }

    const targetCatId = categoryId || 'pc-cat-guide';
    const limitCheck = await checkCategoryLimit(targetCatId);
    if (!limitCheck.allowed) {
      return res.status(400).json({ error: limitCheck.error });
    }

    const state = await getCurrentState();
    const cleanSlug = (slug || guideTitle)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const now = new Date().toISOString();
    const newGuide = {
      id: `pc-${Date.now()}`,
      categoryId: targetCatId,
      category: category || 'Inpatient Guide',
      title: guideTitle,
      name: guideTitle,
      slug: cleanSlug,
      shortDescription: shortDescription || '',
      bannerImage: bannerImage || '',
      status: status || 'Published',
      displayOrder: parseInt(displayOrder || order, 10) || (state.guides.length + 1),
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: now,
      updatedAt: now,
      tabs: Array.isArray(tabs) ? tabs : []
    };

    if (supabase) {
      const { error: dbErr } = await supabase.from('admin_patient_corner_guides').insert({
        id: newGuide.id,
        title: newGuide.title,
        slug: newGuide.slug,
        category_id: newGuide.categoryId,
        category_name: newGuide.category,
        short_description: newGuide.shortDescription || '',
        banner_image: newGuide.bannerImage || '',
        status: newGuide.status,
        display_order: newGuide.displayOrder,
        tabs: newGuide.tabs,
        admin_id: newGuide.adminId,
        admin_name: newGuide.adminName,
        created_at: now,
        updated_at: now
      });
      if (dbErr) console.warn('Supabase insert guide error:', dbErr.message);
    }

    state.guides.push(newGuide);
    try { writeData('patient_corner_state', state); } catch (e) {}

    res.status(201).json({ success: true, guide: newGuide });
  } catch (err) {
    next(err);
  }
};

router.post('/guides', handleCreateGuide);
router.post('/', handleCreateGuide);

// ----------------------------------------------------
// 4. GET SINGLE GUIDE BY ID OR SLUG
// Supports GET /guides/:id and GET /:id
// ----------------------------------------------------
const handleGetGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();

    const guide = state.guides.find(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (!guide) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    res.json(guide);
  } catch (err) {
    next(err);
  }
};

router.get('/guides/:id', handleGetGuide);

// ----------------------------------------------------
// 5. PUT UPDATE GUIDE
// Supports PUT /guides/:id
// ----------------------------------------------------
const handleUpdateGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const state = await getCurrentState();

    const index = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const currentGuide = state.guides[index];
    const newCatId = updates.categoryId || updates.category_id || currentGuide.categoryId || currentGuide.category_id;
    const oldCatId = currentGuide.categoryId || currentGuide.category_id;

    if (newCatId && newCatId !== oldCatId) {
      const limitCheck = await checkCategoryLimit(newCatId, currentGuide.id);
      if (!limitCheck.allowed) {
        return res.status(400).json({ error: limitCheck.error });
      }
    }

    const now = new Date().toISOString();
    const updatedGuide = {
      ...currentGuide,
      ...updates,
      id: currentGuide.id,
      updatedAt: now
    };

    if (supabase) {
      const { error: dbErr } = await supabase.from('admin_patient_corner_guides').update({
        title: updatedGuide.title,
        slug: (updatedGuide.slug || updatedGuide.title || updatedGuide.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category_id: updatedGuide.categoryId || 'pc-cat-guide',
        category_name: updatedGuide.category || 'Patient Guide',
        banner_image: updatedGuide.bannerImage || '',
        status: updatedGuide.status || 'Published',
        display_order: parseInt(updatedGuide.displayOrder || updatedGuide.order, 10) || 1,
        tabs: Array.isArray(updatedGuide.tabs) ? updatedGuide.tabs : [],
        updated_at: now
      }).eq('id', currentGuide.id);

      if (dbErr) console.warn('Supabase update guide error:', dbErr.message);
    }

    state.guides[index] = updatedGuide;
    try { writeData('patient_corner_state', state); } catch (e) {}

    res.json({ success: true, guide: updatedGuide });
  } catch (err) {
    next(err);
  }
};

router.put('/guides/:id', handleUpdateGuide);

// ----------------------------------------------------
// 6. DELETE GUIDE
// Supports DELETE /guides/:id
// ----------------------------------------------------
const handleDeleteGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();

    const index = state.guides.findIndex(
      g => g.id === id || g.slug === id || g.slug === `/${id}`
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Patient guide not found' });
    }

    const removed = state.guides.splice(index, 1)[0];

    if (supabase) {
      const { error: dbErr } = await supabase.from('admin_patient_corner_guides').delete().eq('id', removed.id);
      if (dbErr) console.warn('Supabase delete guide error:', dbErr.message);
    }

    try { writeData('patient_corner_state', state); } catch (e) {}

    res.json({ success: true, message: 'Guide deleted successfully', guide: removed });
  } catch (err) {
    next(err);
  }
};

router.delete('/guides/:id', handleDeleteGuide);

// ----------------------------------------------------
// 7. TAB & SECTION MANIPULATION HELPERS
// ----------------------------------------------------
// Tab Add
router.post('/guides/:id/tabs', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type = 'rich_text', enabled = true, content = '', steps = [], items = [], cards = [], galleryImages = [], faqs = [], testimonials = [], sections = [] } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Tab title is required' });

    const state = await getCurrentState();
    const guide = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (!guide) return res.status(404).json({ error: 'Patient guide not found' });

    const newTab = {
      id: `tab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      type,
      order: (guide.tabs || []).length + 1,
      enabled: enabled !== false,
      content: content || '',
      steps: Array.isArray(steps) ? steps : [],
      items: Array.isArray(items) ? items : [],
      cards: Array.isArray(cards) ? cards : [],
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      testimonials: Array.isArray(testimonials) ? testimonials : [],
      sections: Array.isArray(sections) ? sections : []
    };

    guide.tabs = [...(guide.tabs || []), newTab];
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.status(201).json({ success: true, tab: newTab, guide });
  } catch (err) {
    next(err);
  }
});

// Tab Reorder
router.put('/guides/:id/tabs/reorder', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tabIds } = req.body;
    if (!Array.isArray(tabIds)) return res.status(400).json({ error: 'tabIds array is required' });

    const state = await getCurrentState();
    const guide = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (!guide) return res.status(404).json({ error: 'Patient guide not found' });

    const currentTabs = guide.tabs || [];
    const tabMap = new Map(currentTabs.map(t => [t.id, t]));
    const reorderedTabs = tabIds.map((tId, idx) => {
      const t = tabMap.get(tId);
      return t ? { ...t, order: idx + 1 } : null;
    }).filter(Boolean);

    currentTabs.forEach(t => {
      if (!tabIds.includes(t.id)) reorderedTabs.push({ ...t, order: reorderedTabs.length + 1 });
    });

    guide.tabs = reorderedTabs;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tabs: reorderedTabs, guide });
  } catch (err) {
    next(err);
  }
});

// Tab Update
router.put('/guides/:id/tabs/:tabId', async (req, res, next) => {
  try {
    const { id, tabId } = req.params;
    const updates = req.body || {};

    const state = await getCurrentState();
    const guide = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (!guide) return res.status(404).json({ error: 'Patient guide not found' });

    const tabs = guide.tabs || [];
    const tabIdx = tabs.findIndex(t => t.id === tabId);
    if (tabIdx === -1) return res.status(404).json({ error: 'Tab not found' });

    tabs[tabIdx] = { ...tabs[tabIdx], ...updates, id: tabId };
    guide.tabs = tabs;
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tab: tabs[tabIdx], guide });
  } catch (err) {
    next(err);
  }
});

// Tab Delete
router.delete('/guides/:id/tabs/:tabId', async (req, res, next) => {
  try {
    const { id, tabId } = req.params;
    const state = await getCurrentState();
    const guide = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (!guide) return res.status(404).json({ error: 'Patient guide not found' });

    guide.tabs = (guide.tabs || []).filter(t => t.id !== tabId).map((t, idx) => ({ ...t, order: idx + 1 }));
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, tabs: guide.tabs, guide });
  } catch (err) {
    next(err);
  }
});

// Section Add
router.post('/guides/:id/tabs/:tabId/sections', async (req, res, next) => {
  try {
    const { id, tabId } = req.params;
    const { title, type = 'rich_text', enabled = true, content = '', items = [], steps = [], cards = [], galleryImages = [], faqs = [], settings = {}, config = {}, order } = req.body;

    const state = await getCurrentState();
    const guide = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (!guide) return res.status(404).json({ error: 'Patient guide not found' });

    const tab = (guide.tabs || []).find(t => t.id === tabId);
    if (!tab) return res.status(404).json({ error: 'Tab not found' });

    tab.sections = Array.isArray(tab.sections) ? tab.sections : [];
    const newSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: (title || '').trim(),
      type,
      order: parseInt(order, 10) || (tab.sections.length + 1),
      enabled: enabled !== false,
      content: content || '',
      items: Array.isArray(items) ? items : [],
      steps: Array.isArray(steps) ? steps : [],
      cards: Array.isArray(cards) ? cards : [],
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      settings: (typeof settings === 'object' && Object.keys(settings).length > 0) ? settings : (config || {})
    };

    tab.sections.push(newSection);
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.status(201).json({ success: true, section: newSection, guide });
  } catch (err) {
    next(err);
  }
});

// Section Update
router.put('/guides/:id/tabs/:tabId/sections/:sectionId', async (req, res, next) => {
  try {
    const { id, tabId, sectionId } = req.params;
    const updates = req.body || {};

    const state = await getCurrentState();
    const guide = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (!guide) return res.status(404).json({ error: 'Patient guide not found' });

    const tab = (guide.tabs || []).find(t => t.id === tabId);
    if (!tab) return res.status(404).json({ error: 'Tab not found' });

    tab.sections = Array.isArray(tab.sections) ? tab.sections : [];
    const secIdx = tab.sections.findIndex(s => s.id === sectionId);
    if (secIdx === -1) return res.status(404).json({ error: 'Section not found' });

    tab.sections[secIdx] = { ...tab.sections[secIdx], ...updates, id: sectionId };
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, section: tab.sections[secIdx], guide });
  } catch (err) {
    next(err);
  }
});

// Section Delete
router.delete('/guides/:id/tabs/:tabId/sections/:sectionId', async (req, res, next) => {
  try {
    const { id, tabId, sectionId } = req.params;
    const state = await getCurrentState();
    const guide = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (!guide) return res.status(404).json({ error: 'Patient guide not found' });

    const tab = (guide.tabs || []).find(t => t.id === tabId);
    if (!tab) return res.status(404).json({ error: 'Tab not found' });

    tab.sections = (tab.sections || []).filter(s => s.id !== sectionId).map((s, idx) => ({ ...s, order: idx + 1 }));
    guide.updatedAt = new Date().toISOString();

    await saveFullState(state);
    res.json({ success: true, sections: tab.sections, guide });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 8. CATEGORY MANAGEMENT ENDPOINTS
// ----------------------------------------------------
router.post('/categories', async (req, res, next) => {
  try {
    const { name, description = '', order, max_items, maxItems } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' });

    const state = await getCurrentState();
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      order: parseInt(order, 10) || (state.categories.length + 1),
      status: true,
      max_items: parseInt(max_items || maxItems, 10) || 6,
      maxItems: parseInt(max_items || maxItems, 10) || 6,
      adminId: 'ADM-001',
      adminName: 'Super Administrator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from('bv_patient_corner_categories').insert({
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        order: newCategory.order,
        status: newCategory.status,
        max_items: newCategory.max_items,
        adminId: newCategory.adminId,
        adminName: newCategory.adminName,
        created_at: newCategory.createdAt,
        updated_at: newCategory.updatedAt
      });
    }

    state.categories.push(newCategory);
    try { writeData('patient_corner_state', state); } catch (e) {}

    res.status(201).json({ success: true, category: newCategory, categories: state.categories });
  } catch (err) {
    next(err);
  }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const state = await getCurrentState();

    const catIdx = state.categories.findIndex(c => c.id === id);
    if (catIdx === -1) return res.status(404).json({ error: 'Category not found' });

    const updatedCat = {
      ...state.categories[catIdx],
      ...updates,
      id,
      max_items: updates.max_items !== undefined ? parseInt(updates.max_items, 10) : (updates.maxItems !== undefined ? parseInt(updates.maxItems, 10) : (state.categories[catIdx].max_items || 6)),
      maxItems: updates.max_items !== undefined ? parseInt(updates.max_items, 10) : (updates.maxItems !== undefined ? parseInt(updates.maxItems, 10) : (state.categories[catIdx].maxItems || 6)),
      updatedAt: new Date().toISOString()
    };
    if (supabase) {
      await supabase.from('bv_patient_corner_categories').update({
        name: updatedCat.name,
        description: updatedCat.description,
        order: updatedCat.order,
        status: updatedCat.status,
        max_items: updatedCat.max_items,
        updated_at: updatedCat.updatedAt
      }).eq('id', id);
    }

    state.categories[catIdx] = updatedCat;
    try { writeData('patient_corner_state', state); } catch (e) {}

    res.json({ success: true, category: updatedCat, categories: state.categories });
  } catch (err) {
    next(err);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await getCurrentState();

    const catIdx = state.categories.findIndex(c => c.id === id);
    if (catIdx === -1) return res.status(404).json({ error: 'Category not found' });

    const removed = state.categories.splice(catIdx, 1)[0];
    if (supabase) {
      await supabase.from('bv_patient_corner_categories').delete().eq('id', id);
    }

    try { writeData('patient_corner_state', state); } catch (e) {}
    res.json({ success: true, message: 'Category deleted', category: removed, categories: state.categories });
  } catch (err) {
    next(err);
  }
});

// Fallback root parameters (:id routes)
router.get('/:id', handleGetGuide);
router.put('/:id', handleUpdateGuide);
router.delete('/:id', handleDeleteGuide);

export default router;
