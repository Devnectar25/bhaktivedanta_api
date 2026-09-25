import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function parseJsonField(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

// Format database row to clean JSON
function formatCentre(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title || '',
    centreType: row.centre_type || row.centreType || 'Associate Centre',
    bannerImg: row.banner_img || row.bannerImg || '',
    address: row.address || '',
    phone: row.phone || '',
    highlights: parseJsonField(row.highlights, []),
    overview: parseJsonField(row.overview, []),
    services: parseJsonField(row.services, []),
    communityServices: parseJsonField(row.community_services || row.communityServices, []),
    mapSrc: row.map_src || row.mapSrc || '',
    status: row.status || 'Active',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET all associate centres (Newest first)
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const local = readData('associate_centres') || [];
      const sorted = [...local].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return res.json(sorted.map(formatCentre));
    }

    const { data, error } = await supabase
      .from('bv_associate_centres')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[API] Supabase get associate centres error, falling back to local:', error.message);
      const local = readData('associate_centres') || [];
      const sorted = [...local].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return res.json(sorted.map(formatCentre));
    }

    // Cache to local JSON
    const formatted = (data || []).map(formatCentre);
    writeData('associate_centres', formatted);
    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// GET single associate centre by ID or slug
router.get('/:idOrSlug', async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (!supabase) {
      const local = readData('associate_centres') || [];
      const found = local.find(c => c.id === idOrSlug || c.slug === idOrSlug);
      if (!found) return res.status(404).json({ error: 'Associate centre not found' });
      return res.json(formatCentre(found));
    }

    // Try finding by slug first, then by id
    const { data, error } = await supabase
      .from('bv_associate_centres')
      .select('*')
      .or(`slug.eq.${idOrSlug},id.eq.${idOrSlug}`)
      .single();

    if (error || !data) {
      const local = readData('associate_centres') || [];
      const found = local.find(c => c.id === idOrSlug || c.slug === idOrSlug);
      if (!found) return res.status(404).json({ error: 'Associate centre not found' });
      return res.json(formatCentre(found));
    }

    res.json(formatCentre(data));
  } catch (err) {
    next(err);
  }
});

// POST create new associate centre
router.post('/', async (req, res, next) => {
  try {
    const title = req.body.title || req.body.name || 'New Associate Centre';
    const slug = slugify(req.body.slug || title);
    const id = req.body.id || `ac-${slug}-${Date.now().toString(36)}`;

    const newRecord = {
      id,
      slug,
      title,
      centre_type: req.body.centreType || req.body.centre_type || 'Associate Centre',
      banner_img: req.body.bannerImg || req.body.banner_img || '',
      address: req.body.address || '',
      phone: req.body.phone || '',
      highlights: JSON.stringify(req.body.highlights || []),
      overview: JSON.stringify(req.body.overview || []),
      services: JSON.stringify(req.body.services || []),
      community_services: JSON.stringify(req.body.communityServices || req.body.community_services || []),
      map_src: req.body.mapSrc || req.body.map_src || '',
      status: req.body.status || 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_associate_centres')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        console.error('[API] Supabase insert associate centre error:', error);
        throw error;
      }

      const formatted = formatCentre(data);
      // Sync local storage (prepend to show first)
      const local = readData('associate_centres') || [];
      local.unshift(formatted);
      writeData('associate_centres', local);

      return res.status(201).json(formatted);
    }

    // Local fallback
    const local = readData('associate_centres') || [];
    const formatted = formatCentre(newRecord);
    local.unshift(formatted);
    writeData('associate_centres', local);
    res.status(201).json(formatted);
  } catch (err) {
    next(err);
  }
});

// PUT update associate centre
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const updates = {
      updated_at: new Date().toISOString()
    };

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.name !== undefined && !req.body.title) updates.title = req.body.name;
    if (req.body.slug !== undefined) updates.slug = slugify(req.body.slug);
    if (req.body.centreType !== undefined || req.body.centre_type !== undefined) {
      updates.centre_type = req.body.centreType || req.body.centre_type;
    }
    if (req.body.bannerImg !== undefined || req.body.banner_img !== undefined) {
      updates.banner_img = req.body.bannerImg || req.body.banner_img;
    }
    if (req.body.address !== undefined) updates.address = req.body.address;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.highlights !== undefined) updates.highlights = JSON.stringify(req.body.highlights);
    if (req.body.overview !== undefined) updates.overview = JSON.stringify(req.body.overview);
    if (req.body.services !== undefined) updates.services = JSON.stringify(req.body.services);
    if (req.body.communityServices !== undefined || req.body.community_services !== undefined) {
      updates.community_services = JSON.stringify(req.body.communityServices || req.body.community_services);
    }
    if (req.body.mapSrc !== undefined || req.body.map_src !== undefined) {
      updates.map_src = req.body.mapSrc || req.body.map_src;
    }
    if (req.body.status !== undefined) updates.status = req.body.status;

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_associate_centres')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[API] Supabase update associate centre error:', error);
        throw error;
      }

      const formatted = formatCentre(data);
      // Sync local storage
      const local = readData('associate_centres') || [];
      const idx = local.findIndex(c => c.id === id);
      if (idx !== -1) {
        local[idx] = formatted;
      } else {
        local.push(formatted);
      }
      writeData('associate_centres', local);

      return res.json(formatted);
    }

    // Local fallback
    const local = readData('associate_centres') || [];
    const idx = local.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Associate centre not found' });
    local[idx] = { ...local[idx], ...req.body, updatedAt: new Date().toISOString() };
    writeData('associate_centres', local);
    res.json(formatCentre(local[idx]));
  } catch (err) {
    next(err);
  }
});

// DELETE associate centre
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase
        .from('bv_associate_centres')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[API] Supabase delete associate centre error:', error);
        throw error;
      }
    }

    // Sync local storage
    const local = readData('associate_centres') || [];
    const filtered = local.filter(c => c.id !== id);
    writeData('associate_centres', filtered);

    res.json({ success: true, message: 'Associate centre deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

export default router;
