import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all news items
router.get('/', async (req, res, next) => {
  try {
    const localNews = readData('news') || [];
    if (!supabase) {
      return res.json(localNews);
    }

    const { data, error } = await supabase
      .from('bv_news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get news error, fallback to local storage:', error.message);
      return res.json(localNews);
    }

    if (!data || data.length === 0) {
      return res.json(localNews);
    }

    const merged = (data || []).map(item => {
      const match = localNews.find(l => l.id === item.id);
      return {
        ...item,
        slug: match?.slug || item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : item.id),
        category: match?.category || item.category || 'Announcements',
        status: match?.status || item.status || 'Published',
        authorRole: match?.authorRole || item.authorRole || 'Hospital Directorate',
        readTime: match?.readTime || item.readTime || '3 min read',
        tags: match?.tags || item.tags || ['Announcements'],
        views: match?.views || item.views || 0
      };
    });

    res.json(merged);
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

// GET single news item by ID or slug
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const localNews = readData('news') || [];
    const localItem = localNews.find(n => n.id === id || n.slug === id);

    if (!supabase) {
      if (!localItem) return res.status(404).json({ error: 'News item not found' });
      return res.json(localItem);
    }

    const { data, error } = await supabase
      .from('bv_news')
      .select('*')
      .or(`id.eq.${id}`)
      .maybeSingle();

    if (error || !data) {
      if (!localItem) return res.status(404).json({ error: 'News item not found' });
      return res.json(localItem);
    }

    res.json({
      ...data,
      slug: localItem?.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : data.id),
      category: localItem?.category || data.category || 'Announcements',
      status: localItem?.status || data.status || 'Published',
      authorRole: localItem?.authorRole || 'Hospital Directorate',
      readTime: localItem?.readTime || '3 min read',
      tags: localItem?.tags || ['Announcements'],
      views: localItem?.views || 0
    });
  } catch (err) {
    next(err);
  }
});

// POST create news item
router.post('/', async (req, res, next) => {
  try {
    const title = req.body.title || 'Untitled Announcement';
    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newNews = {
      id: req.body.id || `NWS-${Date.now().toString().substring(8)}`,
      title,
      slug,
      category: req.body.category || 'Announcements',
      status: req.body.status || 'Published',
      summary: req.body.summary || '',
      content: req.body.content || '',
      date: req.body.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: req.body.readTime || '3 min read',
      image: req.body.image || '',
      author: req.body.author || 'Hospital Management',
      authorRole: req.body.authorRole || 'Hospital Directorate',
      tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : ['Announcements']),
      views: req.body.views || 0
    };

    if (supabase) {
      const dbPayload = {
        id: newNews.id,
        title: newNews.title,
        summary: newNews.summary,
        content: newNews.content,
        date: newNews.date,
        image: newNews.image,
        author: newNews.author
      };

      const { error } = await supabase
        .from('bv_news')
        .insert([dbPayload]);

      if (error) {
        console.error('Supabase news insert error:', error.message);
      }
    }

    const news = readData('news') || [];
    const existingIndex = news.findIndex(n => n.id === newNews.id);
    if (existingIndex >= 0) {
      news[existingIndex] = newNews;
    } else {
      news.unshift(newNews);
    }
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

    const news = readData('news') || [];
    const index = news.findIndex(n => n.id === id);

    const mergedItem = {
      ...(news[index] || {}),
      ...req.body,
      id
    };

    if (index !== -1) {
      news[index] = mergedItem;
      writeData('news', news);
    } else {
      news.unshift(mergedItem);
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

    res.json(mergedItem);
  } catch (err) {
    next(err);
  }
});

// DELETE news item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = readData('news') || [];
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
