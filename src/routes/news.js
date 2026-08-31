import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all news items
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const news = readData('news');
      return res.json(news);
    }

    const { data, error } = await supabase
      .from('bv_news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get news error, fallback to local storage:', error.message);
      const news = readData('news');
      return res.json(news);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update news items
router.put('/', async (req, res, next) => {
  try {
    writeData('news', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create news item
router.post('/', async (req, res, next) => {
  try {
    const newNews = {
      id: req.body.id || `news-${Date.now()}`,
      title: req.body.title || '',
      summary: req.body.summary || '',
      content: req.body.content || '',
      date: req.body.date || new Date().toLocaleDateString(),
      image: req.body.image || '',
      author: req.body.author || 'Admin'
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_news')
        .insert([newNews])
        .select();

      if (error) {
        console.error('Supabase news insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const news = readData('news');
    news.push(newNews);
    writeData('news', news);
    res.status(201).json(newNews);
  } catch (err) {
    next(err);
  }
});

// PUT update news item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      date: req.body.date,
      image: req.body.image,
      author: req.body.author
    };

    const news = readData('news');
    const index = news.findIndex(n => n.id === id);

    if (index !== -1) {
      news[index] = {
        ...news[index],
        ...req.body,
        id
      };
      writeData('news', news);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_news')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase news update error:', error.message);
      }
    }

    res.json(news[index] || req.body);
  } catch (err) {
    next(err);
  }
});

// DELETE news item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = readData('news');
    const filtered = news.filter(n => n.id !== id);

    writeData('news', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase news delete error:', error.message);
      }
    }

    res.json({ success: true, message: `News item ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
