import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

export const defaultFeedbackItems = [
  {
    id: 'FBK-1001',
    name: 'Suresh Patil',
    phone: '+91 98201 44552',
    bhid: 'BH-8849',
    doctorName: 'Dr. Anand Sharma',
    serviceRatings: {
      doctorCare: 'Excellent',
      nursing: 'Good',
      cleanliness: 'Excellent',
      food: 'Good',
      overall: 'Excellent'
    },
    recommendation: 'Yes',
    comments: 'Very pleased with the doctors and nursing staff care.',
    status: 'New',
    timestamp: '2026-09-20 11:30:00'
  },
  {
    id: 'FBK-1002',
    name: 'Meena Rao',
    phone: '+91 98700 12345',
    bhid: 'BH-7402',
    doctorName: 'Dr. Rajesh Patel',
    serviceRatings: {
      doctorCare: 'Excellent',
      nursing: 'Excellent',
      cleanliness: 'Good',
      food: 'Average',
      overall: 'Good'
    },
    recommendation: 'Yes',
    comments: 'Prompt service and clean facilities.',
    status: 'Reviewed',
    timestamp: '2026-09-18 16:45:00'
  }
];

// Helper to convert internal feedback object to Supabase schema row
function mapToSupabaseRow(item) {
  return {
    id: item.id || `FBK-${Date.now()}`,
    name: item.name || '',
    phone: item.phone || '',
    bhid: item.bhid || '',
    doctor_name: item.doctorName || item.doctor_name || '',
    service_ratings: typeof item.serviceRatings === 'object' ? JSON.stringify(item.serviceRatings) : (item.serviceRatings || '{}'),
    recommendation: item.recommendation || 'Yes',
    comments: item.comments || '',
    status: item.status || 'New',
    created_at: item.timestamp ? new Date(item.timestamp).toISOString() : new Date().toISOString()
  };
}

// Helper to convert Supabase row back to app feedback object
function mapFromSupabaseRow(row) {
  if (!row) return null;
  let parsedRatings = {};
  if (row.service_ratings) {
    try {
      parsedRatings = typeof row.service_ratings === 'string' ? JSON.parse(row.service_ratings) : row.service_ratings;
    } catch (e) {
      parsedRatings = {};
    }
  }

  return {
    id: row.id,
    name: row.name || 'Anonymous',
    phone: row.phone || '',
    bhid: row.bhid || '',
    doctorName: row.doctor_name || row.doctorName || '',
    serviceRatings: parsedRatings,
    recommendation: row.recommendation || 'Yes',
    comments: row.comments || '',
    status: row.status || 'New',
    timestamp: row.created_at ? new Date(row.created_at).toLocaleString() : new Date().toLocaleString()
  };
}

// Fetch all feedback records from Supabase or local storage
export async function fetchFeedback() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bv_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapFromSupabaseRow);
      }

      // If table is empty, seed defaults
      if (!error && data && data.length === 0) {
        try {
          const seedRows = defaultFeedbackItems.map(mapToSupabaseRow);
          await supabase.from('bv_feedback').insert(seedRows);
          console.log('[API Feedback] Seeded initial feedback items into Supabase bv_feedback table.');
          return defaultFeedbackItems;
        } catch (seedErr) {
          console.warn('[API Feedback] Seed warning:', seedErr.message);
        }
      }
    } catch (e) {
      console.warn('[API Feedback] Supabase read warning, fallback to local JSON:', e.message);
    }
  }

  const localItems = readData('feedback');
  if (localItems && Array.isArray(localItems) && localItems.length > 0) {
    return localItems;
  }

  writeData('feedback', defaultFeedbackItems);
  return defaultFeedbackItems;
}

// ----------------------------------------------------
// 1. GET ALL FEEDBACK SUBMISSIONS
// ----------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const list = await fetchFeedback();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. POST SUBMIT NEW FEEDBACK
// ----------------------------------------------------
router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const newItem = {
      id: body.id || `FBK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name || 'Anonymous',
      phone: body.phone || '',
      bhid: body.bhid || '',
      doctorName: body.doctorName || body.doctor_name || '',
      serviceRatings: body.serviceRatings || {
        doctorCare: body.doctorCare || 'Good',
        nursing: body.nursing || 'Good',
        cleanliness: body.cleanliness || 'Good',
        food: body.food || 'Good',
        overall: body.overall || 'Good'
      },
      recommendation: body.recommendation || 'Yes',
      comments: body.comments || '',
      status: 'New',
      timestamp: new Date().toLocaleString()
    };

    // Save to local JSON disk
    const list = readData('feedback') || [];
    const updatedList = [newItem, ...list];
    writeData('feedback', updatedList);

    // Save to Supabase
    if (supabase) {
      try {
        const dbRow = mapToSupabaseRow(newItem);
        const { error } = await supabase
          .from('bv_feedback')
          .upsert(dbRow, { onConflict: 'id' });

        if (error) {
          console.warn('[API Feedback] Supabase insert warning:', error.message);
        } else {
          console.log(`[DATABASE] Successfully saved feedback to Supabase bv_feedback table: ${newItem.id}`);
        }
      } catch (err) {
        console.warn('[DATABASE ERROR] Supabase feedback exception:', err.message);
      }
    }

    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 3. PUT UPDATE FEEDBACK STATUS
// ----------------------------------------------------
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentList = await fetchFeedback();
    const existing = currentList.find(item => item.id === id);

    const updated = {
      ...(existing || {}),
      ...req.body,
      id
    };

    const list = readData('feedback') || [];
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }
    writeData('feedback', list);

    if (supabase) {
      try {
        const dbRow = mapToSupabaseRow(updated);
        await supabase
          .from('bv_feedback')
          .upsert(dbRow, { onConflict: 'id' });
      } catch (e) {}
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 4. DELETE FEEDBACK
// ----------------------------------------------------
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = readData('feedback') || [];
    const filtered = list.filter(item => item.id !== id);
    writeData('feedback', filtered);

    if (supabase) {
      try {
        await supabase
          .from('bv_feedback')
          .delete()
          .eq('id', id);
      } catch (e) {}
    }

    res.json({ success: true, message: `Feedback ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
