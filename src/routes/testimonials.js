import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import { defaultVipTestimonials } from '../utils/seeds.js';

const router = express.Router();

function formatTestimonial(r) {
  if (!r) return null;
  const diseaseStr = r.disease || '';
  const parts = diseaseStr.split('|');
  const designation = parts[0] || r.designation || 'Visitor & Well-Wisher';
  const image = parts[1] || r.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

  return {
    id: r.id,
    name: r.patientName || r.name || 'Anonymous',
    designation: designation.trim(),
    image: image.trim(),
    content: r.content || r.quote || '',
    status: r.status || 'Approved',
    created_at: r.created_at || new Date().toISOString()
  };
}

// GET all VIP / Dignitary Testimonials
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;
    
    // If explicitly asked for patient reviews on this endpoint, filter non-VIP
    if (type === 'review') {
      const allRows = await fetchAllFromSupabase();
      const reviews = allRows.filter(r => !String(r.id).startsWith('VIP-'));
      return res.json(reviews);
    }

    let items = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_testimonials')
          .select('*')
          .like('id', 'VIP-%')
          .order('created_at', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          items = data.map(formatTestimonial);
        }
      } catch (err) {
        console.warn('[API Testimonials] Supabase read exception:', err.message);
      }
    }

    if (!items || items.length === 0) {
      const local = readData('testimonials') || [];
      if (Array.isArray(local) && local.length > 0) {
        items = local.map(formatTestimonial);
      } else {
        items = defaultVipTestimonials;
        writeData('testimonials', items);
      }
    }

    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Helper
async function fetchAllFromSupabase() {
  if (!supabase) return [];
  try {
    const { data } = await supabase.from('bv_testimonials').select('*');
    return data || [];
  } catch (e) {
    return [];
  }
}

// POST create VIP testimonial
router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const id = body.id || `VIP-${Date.now().toString().slice(-6)}`;
    const name = body.name || body.patientName || 'Dignitary';
    const designation = body.designation || body.title || 'Guest';
    const image = body.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
    const content = body.content || body.quote || '';
    const status = body.status || 'Approved';

    const newTestimonial = {
      id,
      name,
      designation,
      image,
      content,
      status,
      created_at: new Date().toISOString()
    };

    // Save to local JSON storage
    const list = readData('testimonials') || [];
    const updatedList = [newTestimonial, ...list.filter(t => t.id !== id)];
    writeData('testimonials', updatedList);

    // Save to Supabase bv_testimonials
    if (supabase) {
      try {
        const dbRow = {
          id,
          patientName: name,
          disease: `${designation}|${image}`,
          content,
          rating: 5,
          status,
          created_at: new Date().toISOString()
        };
        await supabase.from('bv_testimonials').upsert([dbRow], { onConflict: 'id' });
        console.log(`[DATABASE] Saved VIP Testimonial to Supabase: ${id}`);
      } catch (err) {
        console.warn('[DATABASE ERROR] Supabase testimonial insert exception:', err.message);
      }
    }

    res.status(201).json(newTestimonial);
  } catch (err) {
    next(err);
  }
});

// PUT update VIP testimonial
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const list = readData('testimonials') || [];
    const existing = list.find(t => t.id === id) || {};

    const updated = {
      ...existing,
      ...body,
      id,
      name: body.name || existing.name || body.patientName,
      designation: body.designation || existing.designation,
      image: body.image || existing.image,
      content: body.content || existing.content,
      status: body.status || existing.status || 'Approved'
    };

    const nextList = list.map(t => t.id === id ? updated : t);
    if (!list.some(t => t.id === id)) nextList.unshift(updated);
    writeData('testimonials', nextList);

    if (supabase) {
      try {
        const dbRow = {
          id,
          patientName: updated.name,
          disease: `${updated.designation || ''}|${updated.image || ''}`,
          content: updated.content,
          rating: 5,
          status: updated.status
        };
        await supabase.from('bv_testimonials').upsert([dbRow], { onConflict: 'id' });
      } catch (err) {
        console.warn('[DATABASE ERROR] Supabase testimonial update exception:', err.message);
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE VIP testimonial
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = readData('testimonials') || [];
    const filtered = list.filter(t => t.id !== id);
    writeData('testimonials', filtered);

    if (supabase) {
      try {
        await supabase.from('bv_testimonials').delete().eq('id', id);
        console.log(`[DATABASE] Deleted VIP Testimonial from Supabase: ${id}`);
      } catch (err) {
        console.warn('[DATABASE ERROR] Supabase testimonial delete exception:', err.message);
      }
    }

    res.json({ success: true, message: `Testimonial ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
