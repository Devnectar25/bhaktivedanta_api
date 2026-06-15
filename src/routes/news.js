import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all news
router.get('/', (req, res, next) => {
  try {
    const news = readData('news');
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update news
router.put('/', (req, res, next) => {
  try {
    writeData('news', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create news
router.post('/', (req, res, next) => {
  try {
    const news = readData('news');
    const newNews = {
      id: req.body.id || `NWS-${Math.floor(300 + Math.random() * 700)}`,
      title: req.body.title || '',
      date: req.body.date || new Date().toLocaleDateString(),
      category: req.body.category || 'General',
      status: req.body.status || 'Draft',
      content: req.body.content || ''
    };
    
    news.push(newNews);
    writeData('news', news);
    res.status(201).json(newNews);
  } catch (err) {
    next(err);
  }
});

// PUT update news
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const news = readData('news');
    const index = news.findIndex(n => n.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    news[index] = {
      ...news[index],
      ...req.body,
      id // Prevent ID change
    };
    
    writeData('news', news);
    res.json(news[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE news
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const news = readData('news');
    const filtered = news.filter(n => n.id !== id);
    
    if (news.length === filtered.length) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    writeData('news', filtered);
    res.json({ success: true, message: `News item ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
