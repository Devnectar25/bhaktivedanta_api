import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all queries
router.get('/', async (req, res, next) => {
  try {
    const localQueries = readData('queries') || [];

    if (!supabase) {
      return res.json(localQueries);
    }

    const { data: dbData, error } = await supabase
      .from('bv_queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get queries error, fallback to local storage:', error.message);
      return res.json(localQueries);
    }

    // Merge Supabase records with local storage records to preserve extra metadata
    const mergedMap = new Map();

    // 1. Populate from local
    localQueries.forEach(item => {
      if (item && item.id) {
        mergedMap.set(item.id.toString(), item);
      }
    });

    // 2. Merge with Supabase DB records
    (dbData || []).forEach(dbItem => {
      if (!dbItem || !dbItem.id) return;
      const key = dbItem.id.toString();
      const localItem = mergedMap.get(key) || {};

      mergedMap.set(key, {
        id: dbItem.id,
        name: dbItem.name || localItem.name || 'Anonymous',
        email: dbItem.email || localItem.email || '',
        phone: localItem.phone || '',
        subject: dbItem.subject || localItem.subject || 'General Inquiry',
        message: dbItem.message || localItem.message || '',
        date: localItem.date || (dbItem.created_at ? new Date(dbItem.created_at).toLocaleDateString() : 'Recent'),
        status: dbItem.status || localItem.status || 'Pending'
      });
    });

    const result = Array.from(mergedMap.values());
    res.json(result);
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
      id: req.body.id || `QRY-${Math.floor(5000 + Math.random() * 5000)}`,
      name: (req.body.name || '').trim(),
      email: (req.body.email || '').trim(),
      phone: (req.body.phone || '').trim(),
      subject: (req.body.subject || 'General Inquiry').trim(),
      message: (req.body.message || '').trim(),
      date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: req.body.status || 'Pending'
    };

    // Save locally
    const queries = readData('queries') || [];
    queries.unshift(newQuery);
    writeData('queries', queries);

    // Save to Supabase (only send valid columns: id, name, email, subject, message, status)
    if (supabase) {
      const dbPayload = {
        id: newQuery.id,
        name: newQuery.name,
        email: newQuery.email,
        subject: newQuery.subject,
        message: newQuery.message,
        status: newQuery.status
      };

      const { data, error } = await supabase
        .from('bv_queries')
        .insert([dbPayload])
        .select();

      if (error) {
        console.error('Supabase queries insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json({ ...data[0], phone: newQuery.phone, date: newQuery.date });
      }
    }

    res.status(201).json(newQuery);
  } catch (err) {
    next(err);
  }
});

// PUT update query
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const queries = readData('queries') || [];
    const index = queries.findIndex(q => q.id.toString() === id.toString());

    const updateData = { ...req.body };
    if (index !== -1) {
      queries[index] = {
        ...queries[index],
        ...updateData,
        id
      };
      writeData('queries', queries);
    }

    if (supabase) {
      const dbPayload = {};
      if (updateData.name !== undefined) dbPayload.name = updateData.name;
      if (updateData.email !== undefined) dbPayload.email = updateData.email;
      if (updateData.subject !== undefined) dbPayload.subject = updateData.subject;
      if (updateData.message !== undefined) dbPayload.message = updateData.message;
      if (updateData.status !== undefined) dbPayload.status = updateData.status;

      if (Object.keys(dbPayload).length > 0) {
        const { error } = await supabase
          .from('bv_queries')
          .update(dbPayload)
          .eq('id', id);

        if (error) {
          console.error('Supabase query update error:', error.message);
        }
      }
    }

    res.json(queries[index] || { id, ...updateData });
  } catch (err) {
    next(err);
  }
});

// DELETE query
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const queries = readData('queries') || [];
    const filtered = queries.filter(q => q.id.toString() !== id.toString());

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
