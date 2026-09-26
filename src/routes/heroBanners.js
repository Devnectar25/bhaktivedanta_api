import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

const MAX_HERO_BANNERS = 10;

function getLocalBanners() {
  const data = readData('hero_banners');
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  return seeds.defaultHeroBanners || [];
}

// GET /api/hero-banners - Fetch all hero background banners
router.get('/', async (req, res, next) => {
  try {
    let banners = getLocalBanners();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_hero_banners')
          .select('*')
          .order('order', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          banners = data.map(item => ({
            id: item.id,
            imageUrl: item.image_url || item.imageUrl,
            title: item.title || '',
            subtitle: item.subtitle || '',
            order: item.order || 1,
            isActive: item.is_active !== undefined ? item.is_active : (item.isActive !== undefined ? item.isActive : true),
            createdAt: item.created_at || item.createdAt || new Date().toISOString()
          }));
        }
      } catch (sbErr) {
        // Fallback to local storage if Supabase table not created yet
      }
    }

    // Sort by order ascending
    banners.sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.json(banners);
  } catch (err) {
    next(err);
  }
});

// POST /api/hero-banners/bulk - Upload/create multiple banners at once (Max 10 total)
router.post('/bulk', async (req, res, next) => {
  try {
    const rawList = Array.isArray(req.body) ? req.body : (req.body.banners || []);
    if (!Array.isArray(rawList) || rawList.length === 0) {
      return res.status(400).json({ error: 'Payload must contain an array of banners' });
    }

    const currentBanners = getLocalBanners();

    // Validation: Maximum 10 images limit
    if (currentBanners.length >= MAX_HERO_BANNERS) {
      return res.status(400).json({
        error: `Maximum limit of ${MAX_HERO_BANNERS} hero background images reached. Please delete existing images before uploading new ones.`
      });
    }

    if (currentBanners.length + rawList.length > MAX_HERO_BANNERS) {
      const remainingSlots = MAX_HERO_BANNERS - currentBanners.length;
      return res.status(400).json({
        error: `Cannot upload ${rawList.length} images. Only ${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} remaining (maximum ${MAX_HERO_BANNERS} total).`
      });
    }

    const newBanners = rawList.map((item, idx) => ({
      id: item.id || `hero-banner-${Date.now()}-${idx}`,
      imageUrl: item.imageUrl || item.image_url || '',
      title: item.title || 'Bhaktivedanta Hospital & Research Institute',
      subtitle: item.subtitle || '',
      order: item.order !== undefined ? item.order : (currentBanners.length + idx + 1),
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: item.createdAt || new Date().toISOString()
    })).filter(b => !!b.imageUrl);

    const merged = [...currentBanners, ...newBanners];
    writeData('hero_banners', merged);

    if (supabase) {
      try {
        const sbRows = newBanners.map(b => ({
          id: b.id,
          image_url: b.imageUrl,
          title: b.title,
          subtitle: b.subtitle,
          order: b.order,
          is_active: b.isActive,
          created_at: b.createdAt
        }));
        await supabase.from('bv_hero_banners').upsert(sbRows, { onConflict: 'id' });
      } catch (sbErr) { }
    }

    return res.status(201).json({
      status: 'success',
      added: newBanners.length,
      banners: merged
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/hero-banners - Create a single banner (Max 10 total)
router.post('/', async (req, res, next) => {
  try {
    const currentBanners = getLocalBanners();

    // Validation: Maximum 10 images limit
    if (currentBanners.length >= MAX_HERO_BANNERS) {
      return res.status(400).json({
        error: `Maximum limit of ${MAX_HERO_BANNERS} hero background images reached. Please remove an existing image before adding a new one.`
      });
    }

    const newBanner = {
      id: req.body.id || `hero-banner-${Date.now()}`,
      imageUrl: req.body.imageUrl || req.body.image_url || '',
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      order: req.body.order !== undefined ? req.body.order : (currentBanners.length + 1),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdAt: new Date().toISOString()
    };

    if (!newBanner.imageUrl) {
      return res.status(400).json({ error: 'Image URL or data is required' });
    }

    const updated = [...currentBanners, newBanner];
    writeData('hero_banners', updated);

    if (supabase) {
      try {
        await supabase.from('bv_hero_banners').upsert({
          id: newBanner.id,
          image_url: newBanner.imageUrl,
          title: newBanner.title,
          subtitle: newBanner.subtitle,
          order: newBanner.order,
          is_active: newBanner.isActive,
          created_at: newBanner.createdAt
        }, { onConflict: 'id' });
      } catch (sbErr) { }
    }

    return res.status(201).json(newBanner);
  } catch (err) {
    next(err);
  }
});

// PUT /api/hero-banners - Bulk update all banners (for ordering, mass status update, etc.)
router.put('/', async (req, res, next) => {
  try {
    const rawList = Array.isArray(req.body) ? req.body : (req.body.banners || []);
    if (!Array.isArray(rawList)) {
      return res.status(400).json({ error: 'Expected an array of banners' });
    }

    const normalized = rawList.map((item, idx) => ({
      id: item.id || `hero-banner-${Date.now()}-${idx}`,
      imageUrl: item.imageUrl || item.image_url || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      order: item.order !== undefined ? item.order : (idx + 1),
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: item.createdAt || new Date().toISOString()
    })).filter(b => !!b.imageUrl);

    writeData('hero_banners', normalized);

    if (supabase) {
      try {
        const sbRows = normalized.map(b => ({
          id: b.id,
          image_url: b.imageUrl,
          title: b.title,
          subtitle: b.subtitle,
          order: b.order,
          is_active: b.isActive,
          created_at: b.createdAt
        }));
        await supabase.from('bv_hero_banners').upsert(sbRows, { onConflict: 'id' });
      } catch (sbErr) { }
    }

    return res.json(normalized);
  } catch (err) {
    next(err);
  }
});

// PUT /api/hero-banners/:id - Update single banner
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = getLocalBanners();
    const index = current.findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Hero banner not found' });
    }

    const updatedBanner = {
      ...current[index],
      ...req.body,
      id
    };

    current[index] = updatedBanner;
    writeData('hero_banners', current);

    if (supabase) {
      try {
        await supabase.from('bv_hero_banners').upsert({
          id: updatedBanner.id,
          image_url: updatedBanner.imageUrl || updatedBanner.image_url,
          title: updatedBanner.title,
          subtitle: updatedBanner.subtitle,
          order: updatedBanner.order,
          is_active: updatedBanner.isActive,
          created_at: updatedBanner.createdAt
        }, { onConflict: 'id' });
      } catch (sbErr) { }
    }

    return res.json(updatedBanner);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/hero-banners/:id - Delete banner
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = getLocalBanners();
    const filtered = current.filter(b => b.id !== id);

    writeData('hero_banners', filtered);

    if (supabase) {
      try {
        await supabase.from('bv_hero_banners').delete().eq('id', id);
      } catch (sbErr) { }
    }

    return res.json({ status: 'success', message: 'Hero banner deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

export default router;
