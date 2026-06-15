import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all gallery media
router.get('/', (req, res, next) => {
  try {
    const gallery = readData('gallery');
    res.json(gallery);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update gallery
router.put('/', (req, res, next) => {
  try {
    writeData('gallery', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create gallery media
router.post('/', (req, res, next) => {
  try {
    const gallery = readData('gallery');
    const newMedia = {
      id: req.body.id || `GAL-${Math.floor(400 + Math.random() * 600)}`,
      title: req.body.title || '',
      category: req.body.category || 'General',
      imageUrl: req.body.imageUrl || '',
      status: req.body.status || 'Active'
    };
    
    gallery.push(newMedia);
    writeData('gallery', gallery);
    res.status(201).json(newMedia);
  } catch (err) {
    next(err);
  }
});

// PUT update gallery media
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const gallery = readData('gallery');
    const index = gallery.findIndex(g => g.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Gallery media not found' });
    }
    
    gallery[index] = {
      ...gallery[index],
      ...req.body,
      id // Prevent ID change
    };
    
    writeData('gallery', gallery);
    res.json(gallery[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE gallery media
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const gallery = readData('gallery');
    const filtered = gallery.filter(g => g.id !== id);
    
    if (gallery.length === filtered.length) {
      return res.status(404).json({ error: 'Gallery media not found' });
    }
    
    writeData('gallery', filtered);
    res.json({ success: true, message: `Gallery media ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
