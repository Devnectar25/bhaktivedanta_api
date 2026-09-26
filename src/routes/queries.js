import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

// Auto-sync local queries to Supabase on startup
if (supabase) {
  setTimeout(async () => {
    try {
      const localQueries = readData('queries') || [];
      if (Array.isArray(localQueries) && localQueries.length > 0) {
        const rowsToUpsert = localQueries.map(q => ({
          id: q.id,
          name: q.name || '',
          email: q.email || '',
          subject: q.subject || 'General Inquiry',
          message: q.message || '',
          date: q.date || 'Recent',
          status: q.status || 'Pending'
        }));
        await supabase
          .from('bv_queries')
          .upsert(rowsToUpsert, { onConflict: 'id' });
        console.log('[API Queries] Synced local queries to Supabase.');
      }
    } catch (e) {
      console.warn('[API Queries] Supabase initial sync warning:', e.message);
    }
  }, 2000);
}

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

    // Map local phone cache by ID
    const localMap = new Map();
    localQueries.forEach(item => {
      if (item && item.id) {
        localMap.set(item.id.toString(), item);
      }
    });

    const result = (dbData || []).map(dbItem => {
      const key = (dbItem.id || '').toString();
      const localItem = localMap.get(key) || {};

      return {
        id: dbItem.id,
        name: dbItem.name || localItem.name || 'Anonymous',
        email: dbItem.email || localItem.email || '',
        phone: localItem.phone || '',
        subject: dbItem.subject || localItem.subject || 'General Inquiry',
        message: dbItem.message || localItem.message || '',
        date: dbItem.date || localItem.date || (dbItem.created_at ? new Date(dbItem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'),
        status: dbItem.status || localItem.status || 'Pending'
      };
    });

    // Write back to local file so local disk cache stays in sync
    writeData('queries', result);

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
    const updatedLocal = [newQuery, ...queries.filter(q => q.id.toString() !== newQuery.id.toString())];
    writeData('queries', updatedLocal);

    // Save to Supabase
    if (supabase) {
      const dbPayload = {
        id: newQuery.id,
        name: newQuery.name,
        email: newQuery.email,
        subject: newQuery.subject,
        message: newQuery.message,
        date: newQuery.date,
        status: newQuery.status
      };

      const { data, error } = await supabase
        .from('bv_queries')
        .upsert([dbPayload], { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase queries upsert error:', error.message);
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
      if (updateData.date !== undefined) dbPayload.date = updateData.date;
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
