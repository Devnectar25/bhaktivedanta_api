import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all gallery items
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const gallery = readData('gallery');
      return res.json(gallery);
    }

    const { data, error } = await supabase
      .from('bv_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get gallery error, fallback to local storage:', error.message);
      const gallery = readData('gallery');
      return res.json(gallery);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update gallery items
router.put('/', async (req, res, next) => {
  try {
    writeData('gallery', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create gallery item
router.post('/', async (req, res, next) => {
  try {
    const newMedia = {
      id: req.body.id || `gal-${Date.now()}`,
      title: req.body.title || '',
      type: req.body.type || 'Image',
      url: req.body.url || '',
      category: req.body.category || 'Hospital'
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_gallery')
        .insert([newMedia])
        .select();

      if (error) {
        console.error('Supabase gallery insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const gallery = readData('gallery');
    gallery.push(newMedia);
    writeData('gallery', gallery);
    res.status(201).json(newMedia);
  } catch (err) {
    next(err);
  }
});

// PUT update gallery item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      title: req.body.title,
      type: req.body.type,
      url: req.body.url,
      category: req.body.category
    };

    const gallery = readData('gallery');
    const index = gallery.findIndex(g => g.id === id);

    if (index !== -1) {
      gallery[index] = {
        ...gallery[index],
        ...req.body,
        id
      };
      writeData('gallery', gallery);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_gallery')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase gallery update error:', error.message);
      }
    }

    res.json(gallery[index] || req.body);
  } catch (err) {
    next(err);
  }
});

// DELETE gallery item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const gallery = readData('gallery');
    const filtered = gallery.filter(g => g.id !== id);

    writeData('gallery', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_gallery')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase gallery delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Gallery item ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
