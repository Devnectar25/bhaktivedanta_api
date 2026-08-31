import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all queries
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const queries = readData('queries');
      return res.json(queries);
    }

    const { data, error } = await supabase
      .from('bv_queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get queries error, fallback to local storage:', error.message);
      const queries = readData('queries');
      return res.json(queries);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update queries
router.put('/', async (req, res, next) => {
  try {
    writeData('queries', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create query
router.post('/', async (req, res, next) => {
  try {
    const newQuery = {
      id: req.body.id || `QRY-${Math.floor(500 + Math.random() * 500)}`,
      name: req.body.name || '',
      email: req.body.email || '',
      subject: req.body.subject || '',
      message: req.body.message || '',
      date: req.body.date || new Date().toLocaleDateString(),
      status: req.body.status || 'Pending'
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_queries')
        .insert([newQuery])
        .select();

      if (error) {
        console.error('Supabase queries insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const queries = readData('queries');
    queries.push(newQuery);
    writeData('queries', queries);
    res.status(201).json(newQuery);
  } catch (err) {
    next(err);
  }
});

// PUT update query
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      date: req.body.date,
      status: req.body.status
    };

    const queries = readData('queries');
    const index = queries.findIndex(q => q.id === id);

    if (index !== -1) {
      queries[index] = {
        ...queries[index],
        ...req.body,
        id
      };
      writeData('queries', queries);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_queries')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase query update error:', error.message);
      }
    }

    res.json(queries[index] || req.body);
  } catch (err) {
    next(err);
  }
});

// DELETE query
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const queries = readData('queries');
    const filtered = queries.filter(q => q.id !== id);

    writeData('queries', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_queries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase query delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Query ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
