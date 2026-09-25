import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import { defaultReviews } from '../utils/seeds.js';

const router = express.Router();

function formatReview(r) {
  if (!r) return null;
  return {
    id: r.id,
    patientName: r.patientName || r.name || 'Anonymous Patient',
    disease: r.disease || r.treatment || 'General Patient',
    content: r.content || r.message || '',
    rating: Number(r.rating) || 5,
    status: r.status || 'Approved',
    created_at: r.created_at || new Date().toISOString()
  };
}

// GET all Patient Reviews (Stories of Hope & Healing)
router.get('/', async (req, res, next) => {
  try {
    let items = [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_testimonials')
          .select('*')
          .not('id', 'like', 'VIP-%')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          items = data.map(formatReview);
        }
      } catch (err) {
        console.warn('[API Reviews] Supabase read exception:', err.message);
      }
    }

    if (!items || items.length === 0) {
      const local = readData('reviews') || [];
      if (Array.isArray(local) && local.length > 0) {
        items = local.map(formatReview);
      } else {
        items = defaultReviews;
        writeData('reviews', items);
      }
    }

    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST create patient review
router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const id = body.id || `REV-${Date.now().toString().slice(-6)}`;
    const patientName = body.patientName || body.name || 'Anonymous';
    const disease = body.disease || body.treatment || 'General Treatment';
    const content = body.content || body.message || '';
    const rating = Number(body.rating) || 5;
    const status = body.status || 'Approved';

    const newReview = {
      id,
      patientName,
      disease,
      content,
      rating,
      status,
      created_at: new Date().toISOString()
    };

    // Save to local JSON storage
    const list = readData('reviews') || [];
    const updatedList = [newReview, ...list.filter(r => r.id !== id)];
    writeData('reviews', updatedList);

    // Save to Supabase bv_testimonials
    if (supabase) {
      try {
        await supabase.from('bv_testimonials').upsert([newReview], { onConflict: 'id' });
        console.log(`[DATABASE] Saved Patient Review to Supabase: ${id}`);
      } catch (err) {
        console.warn('[DATABASE ERROR] Supabase review insert exception:', err.message);
      }
    }

    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

// PUT update patient review
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const list = readData('reviews') || [];
    const existing = list.find(r => r.id === id) || {};

    const updated = {
      ...existing,
      ...body,
      id,
      patientName: body.patientName || existing.patientName || 'Anonymous',
      disease: body.disease || existing.disease || '',
      content: body.content || existing.content || '',
      rating: Number(body.rating) || existing.rating || 5,
      status: body.status || existing.status || 'Approved'
    };

    const nextList = list.map(r => r.id === id ? updated : r);
    if (!list.some(r => r.id === id)) nextList.unshift(updated);
    writeData('reviews', nextList);

    if (supabase) {
      try {
        await supabase.from('bv_testimonials').upsert([updated], { onConflict: 'id' });
      } catch (err) {
        console.warn('[DATABASE ERROR] Supabase review update exception:', err.message);
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE patient review
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = readData('reviews') || [];
    const filtered = list.filter(r => r.id !== id);
    writeData('reviews', filtered);

    if (supabase) {
      try {
        await supabase.from('bv_testimonials').delete().eq('id', id);
        console.log(`[DATABASE] Deleted Patient Review from Supabase: ${id}`);
      } catch (err) {
        console.warn('[DATABASE ERROR] Supabase review delete exception:', err.message);
      }
    }

    res.json({ success: true, message: `Review ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
