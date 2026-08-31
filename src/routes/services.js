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
      tabs: row.tabs_data || []
    });
  });

  const categories = Object.values(categoriesMap).sort((a, b) => a.order - b.order);

  return {
    categories,
    services
  };
}

// GET services state
router.get('/', async (req, res, next) => {
  try {
    if (supabase) {
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

        return res.json(state);
      }
    }

    const state = readData('services_state');
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// PUT update services state
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const now = new Date().toISOString();

    const services = payload.services || [];
    const categories = payload.categories || [];
    const categoriesMap = {};
    categories.forEach(c => { categoriesMap[c.id] = c; });

    if (supabase) {
      // Sync categories to Supabase
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
          .from('bv_service_categories')
          .upsert(catRowsToUpsert, { onConflict: 'id' });

        if (catError) {
          console.error('[API] Error syncing service categories to Supabase:', catError);
        }
      }

      // Sync services to Supabase
      if (services.length > 0) {
        const rowsToInsert = services.map(srv => {
          const cat = categoriesMap[srv.categoryId] || {};
          return {
            id: srv.id,
            service_name: srv.name,
            icon: srv.icon || 'medical_services',
            short_description: srv.shortDescription || '',
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

        const { error: upsertError } = await supabase
          .from('admin_services')
          .upsert(rowsToInsert, { onConflict: 'id' });

        if (upsertError) {
          console.error('[API] Error syncing services to Supabase:', upsertError);
        }
      }
    }

    writeData('services_state', payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

export default router;
