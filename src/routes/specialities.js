import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// Helper to convert database rows to frontend state format
function rowsToState(rows) {
  const categoriesMap = {};
  const specialities = [];

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

    specialities.push({
      id: row.id,
      categoryId: row.category_id,
      name: row.speciality_name,
      icon: row.icon || 'star',
      shortDescription: row.short_description || '',
      bannerImage: row.banner_image || '',
      thumbnailImage: row.thumbnail_image || '',
      status: row.status === 'Live' || row.status === true || row.status === 'Active',
      adminId: row.admin_id || 'ADM-001',
      adminName: row.admin_name || 'Super Administrator',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
      tabs: row.tabs_data || []
    });
  });

  const categories = Object.values(categoriesMap).sort((a, b) => a.order - b.order);

  return {
    view: 'listing',
    activeCategoryId: null,
    activeSpecialityId: null,
    activeTabId: 't1',
    categories,
    specialities
  };
}

// POST upload speciality image to Supabase Storage
router.post('/upload', async (req, res, next) => {
  try {
    const { specialityName, fileName, base64Data } = req.body || {};
    if (!base64Data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Convert base64 to Buffer
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // Extract mime type & extension
    const mimeMatch = base64Data.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const ext = mimeType.split('/')[1] || 'png';

    // Create a clean slug from the specific speciality name
    const slug = (specialityName || 'speciality')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const timestamp = Date.now();
    const filePath = `${slug}/${slug}-${timestamp}.${ext}`;

    if (supabase) {
      const { data, error } = await supabase.storage
        .from('specialities-images')
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        console.error('[API Upload] Supabase Storage upload error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      const { data: publicUrlData } = supabase.storage
        .from('specialities-images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl || '';
      console.log(`[API Upload] Uploaded image for "${specialityName}" ->`, publicUrl);
      return res.json({ success: true, url: publicUrl, path: filePath });
    } else {
      // Fallback response
      return res.json({ success: true, url: base64Data, path: filePath });
    }
  } catch (err) {
    console.error('[API Upload] Error handling image upload:', err);
    next(err);
  }
});

// Helper to trigger Next.js / ISR revalidation webhook if configured
async function triggerISRRevalidation(paths = ['/specialities', '/']) {
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

// GET specialities state (Supports dynamic query params: ?categoryId=...&limit=... without hardcoded cutting)
router.get('/', async (req, res, next) => {
  try {
    const { categoryId, limit } = req.query;
    let state = null;

    if (supabase) {
      // Fetch both categories and specialities from Supabase
      const [specRes, catRes] = await Promise.all([
        supabase.from('admin_specialities').select('*'),
        supabase.from('bv_categories').select('*').order('order', { ascending: true })
      ]);

      const specData = specRes.data || [];
      const catData = catRes.data || [];

      if (!specRes.error && specData.length > 0) {
        state = rowsToState(specData);

        // If bv_categories has records, use the authoritative categories from bv_categories
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
      }
    }

    if (!state) {
      // Fallback to local storage if Supabase is offline or empty
      state = readData('specialities_state') || { categories: [], specialities: [] };
    }

    let filteredSpecialities = state.specialities || [];
    if (categoryId) {
      filteredSpecialities = filteredSpecialities.filter(s => s.categoryId === categoryId);
    }
    if (limit && !isNaN(parseInt(limit))) {
      filteredSpecialities = filteredSpecialities.slice(0, parseInt(limit));
    }

    res.json({
      view: state.view || 'listing',
      activeCategoryId: state.activeCategoryId || null,
      activeSpecialityId: state.activeSpecialityId || null,
      activeTabId: state.activeTabId || 't1',
      categories: state.categories || [],
      specialities: filteredSpecialities
    });
  } catch (err) {
    next(err);
  }
});

// PUT update specialities state
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const now = new Date().toISOString();

    const specialities = Array.isArray(payload.specialities) ? payload.specialities : [];
    const categories = Array.isArray(payload.categories) ? payload.categories : [];
    const categoriesMap = {};
    categories.forEach(c => { categoriesMap[c.id] = c; });

    if (supabase) {
      try {
        // 1. Sync Categories to bv_categories table (delete removed + upsert remaining)
        if (Array.isArray(payload.categories)) {
          const keptCatIds = categories.map(c => c.id);
          const { data: existingCats } = await supabase.from('bv_categories').select('id');
          if (existingCats && existingCats.length > 0) {
            const catIdsToDelete = existingCats.map(r => r.id).filter(id => !keptCatIds.includes(id));
            if (catIdsToDelete.length > 0) {
              console.log('[API Specialities] Deleting removed categories from Supabase bv_categories:', catIdsToDelete);
              await supabase.from('bv_categories').delete().in('id', catIdsToDelete);
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

            const { error: catError } = await supabase
              .from('bv_categories')
              .upsert(catRowsToUpsert, { onConflict: 'id' });

            if (catError) {
              console.error('[API] Error syncing categories to Supabase bv_categories:', catError);
            } else {
              console.log(`[API] Successfully synced ${catRowsToUpsert.length} categories to Supabase bv_categories.`);
            }
          }
        }

        // 2. Sync Specialities to admin_specialities table (delete removed + upsert remaining)
        if (Array.isArray(payload.specialities)) {
          const keptSpecIds = specialities.map(s => s.id);
          const { data: existingSpecs } = await supabase.from('admin_specialities').select('id');
          if (existingSpecs && existingSpecs.length > 0) {
            const specIdsToDelete = existingSpecs.map(r => r.id).filter(id => !keptSpecIds.includes(id));
            if (specIdsToDelete.length > 0) {
              console.log('[API Specialities] Deleting removed specialities from Supabase admin_specialities:', specIdsToDelete);
              await supabase.from('admin_specialities').delete().in('id', specIdsToDelete);
            }
          }

          if (specialities.length > 0) {
            const rowsToInsert = specialities.map(spec => {
              const cat = categoriesMap[spec.categoryId] || {};
              return {
                id: spec.id,
                speciality_name: spec.name,
                icon: spec.icon || 'star',
                short_description: spec.shortDescription || '',
                banner_image: spec.bannerImage || '',
                thumbnail_image: spec.thumbnailImage || '',
                status: spec.status ? 'Live' : 'Hidden',
                category_id: spec.categoryId || 'c1',
                category_name: cat.name || 'Unassigned',
                category_description: cat.description || '',
                category_order: cat.order || 1,
                category_status: cat.status !== false,
                tabs_data: spec.tabs || [],
                admin_id: spec.adminId || 'ADM-001',
                admin_name: spec.adminName || 'Super Administrator',
                created_at: spec.createdAt || now,
                updated_at: now
              };
            });

            const { error: upsertError } = await supabase
              .from('admin_specialities')
              .upsert(rowsToInsert, { onConflict: 'id' });

            if (upsertError) {
              console.error('Error syncing specialities state to Supabase:', upsertError);
            }
          }
        }
      } catch (dbErr) {
        console.error('[API Specialities] Supabase sync error in PUT /:', dbErr);
      }
    }

    // Update local file storage cache
    writeData('specialities_state', payload);
    triggerISRRevalidation(['/specialities', '/']);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// DELETE /categories/:id - Delete a single category
router.delete('/categories/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let state = readData('specialities_state') || { categories: [], specialities: [] };

    state.categories = (state.categories || []).filter(c => c.id !== id);
    state.specialities = (state.specialities || []).map(s => s.categoryId === id ? { ...s, categoryId: null } : s);
    writeData('specialities_state', state);

    if (supabase) {
      try {
        await supabase.from('bv_categories').delete().eq('id', id);
      } catch (e) {
        console.error('[API Specialities] Error deleting category from Supabase:', e);
      }
    }

    triggerISRRevalidation(['/specialities', '/']);
    res.json({ success: true, message: `Category ${id} deleted successfully`, state });
  } catch (err) {
    next(err);
  }
});

// DELETE /:id - Delete a single speciality
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let state = readData('specialities_state') || { categories: [], specialities: [] };

    state.specialities = (state.specialities || []).filter(s => s.id !== id);
    writeData('specialities_state', state);

    if (supabase) {
      try {
        const { error } = await supabase.from('admin_specialities').delete().eq('id', id);
        if (error) {
          console.error('[API Specialities] Supabase delete error for id ' + id + ':', error.message);
        } else {
          console.log(`[API Specialities] Successfully deleted speciality ${id} from Supabase.`);
        }
      } catch (e) {
        console.error('[API Specialities] Error deleting speciality from Supabase:', e);
      }
    }

    triggerISRRevalidation(['/specialities', '/']);
    res.json({ success: true, message: `Speciality ${id} deleted successfully`, state });
  } catch (err) {
    next(err);
  }
});

// GET single unified table format endpoint directly from Supabase or local storage
router.get('/flat-table', async (req, res, next) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_specialities')
        .select('*');

      if (!error && data) {
        return res.json(data);
      }
    }

    // Fallback to memory
    const state = readData('specialities_state');
    const categoriesMap = {};
    (state.categories || []).forEach(c => { categoriesMap[c.id] = c; });

    const flatTableData = (state.specialities || []).map(spec => {
      const cat = categoriesMap[spec.categoryId] || {};
      return {
        id: spec.id,
        speciality_name: spec.name,
        icon: spec.icon || 'star',
        short_description: spec.shortDescription || '',
        banner_image: spec.bannerImage || '',
        thumbnail_image: spec.thumbnailImage || '',
        status: spec.status ? 'Live' : 'Hidden',
        category_id: spec.categoryId,
        category_name: cat.name || 'Unassigned',
        category_description: cat.description || '',
        category_order: cat.order || 1,
        category_status: cat.status !== false,
        tabs_data: spec.tabs || [],
        admin_id: spec.adminId || 'ADM-001',
        admin_name: spec.adminName || 'Super Administrator',
        created_at: spec.createdAt || new Date().toISOString(),
        updated_at: spec.updatedAt || new Date().toISOString()
      };
    });

    res.json(flatTableData);
  } catch (err) {
    next(err);
  }
});

// POST /upload - Upload image to Supabase Storage Bucket 'specialities-images'
router.post('/upload', async (req, res, next) => {
  try {
    const { specialityName, fileName, base64Data } = req.body;

    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'base64Data is required' });
    }

    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client is not initialized' });
    }

    // Convert base64 string to Buffer
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    let contentType = 'image/jpeg';
    let buffer;

    if (matches && matches.length === 3) {
      contentType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Generate clean file path: slug/slug-timestamp.ext
    const slug = (specialityName || 'speciality')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const fileExt = (fileName || 'image.jpg').split('.').pop() || 'jpg';
    const filePath = `${slug}/${slug}-${Date.now()}.${fileExt}`;

    // Upload to Supabase bucket 'specialities-images'
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('specialities-images')
      .upload(filePath, buffer, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.error('[API Upload Error]:', uploadError);
      return res.status(500).json({ success: false, error: uploadError.message });
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('specialities-images')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl || '';

    console.log(`[API Upload Success] Uploaded ${filePath} -> ${publicUrl}`);

    res.json({
      success: true,
      url: publicUrl,
      path: filePath
    });
  } catch (err) {
    console.error('[API Upload Crash]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
