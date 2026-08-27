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

// GET specialities state
router.get('/', async (req, res, next) => {
  try {
    if (supabase) {
      // Fetch both categories and specialities from Supabase
      const [specRes, catRes] = await Promise.all([
        supabase.from('admin_specialities').select('*'),
        supabase.from('bv_categories').select('*').order('order', { ascending: true })
      ]);

      const specData = specRes.data || [];
      const catData = catRes.data || [];

      if (!specRes.error && specData.length > 0) {
        let state = rowsToState(specData);

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

        return res.json(state);
      }
    }

    // Fallback to local storage if Supabase is offline or empty
    const state = readData('specialities_state');
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// PUT update specialities state
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const now = new Date().toISOString();

    const specialities = payload.specialities || [];
    const categories = payload.categories || [];
    const categoriesMap = {};
    categories.forEach(c => { categoriesMap[c.id] = c; });

    if (supabase) {
      // 1. Sync Categories to bv_categories table
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

      // 2. Sync Specialities to admin_specialities table
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

    // Update local file storage cache
    writeData('specialities_state', payload);
    res.json(payload);
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

export default router;
