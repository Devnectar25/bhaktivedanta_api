import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

// ==========================================
// 1. EDUCATION & MEDICAL RESEARCH STATE
// ==========================================

// GET current education & medical research state from database
router.get('/', async (req, res, next) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_education_research_state')
          .select('state_data')
          .eq('id', 'primary')
          .single();

        if (!error && data?.state_data) {
          return res.json(data.state_data);
        }
      } catch (err) {
        console.warn('Supabase get education_research_state error, using local storage:', err.message);
      }
    }

    const state = readData('education_research_state');
    return res.json(state || seeds.defaultEducationResearchState || {});
  } catch (err) {
    next(err);
  }
});

// PUT update education & medical research state in database
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid state payload provided' });
    }

    // Save to local JSON database storage
    writeData('education_research_state', payload);

    if (supabase) {
      try {
        await supabase
          .from('bv_education_research_state')
          .upsert({
            id: 'primary',
            state_data: payload,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Supabase upsert education_research_state warning:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Education & Medical Research state saved to database successfully',
      data: payload
    });
  } catch (err) {
    next(err);
  }
});

// GET specific education & research section (e.g., nursingProgram, cmeProgram, etc.)
router.get('/section/:sectionKey', async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    const state = readData('education_research_state') || {};
    const sectionData = state[sectionKey] || null;
    if (!sectionData) {
      return res.status(404).json({ error: `Section ${sectionKey} not found` });
    }
    return res.json(sectionData);
  } catch (err) {
    next(err);
  }
});

// PUT update specific section in database
router.put('/section/:sectionKey', async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    const sectionPayload = req.body;
    const currentState = readData('education_research_state') || {};

    const updatedState = {
      ...currentState,
      [sectionKey]: sectionPayload
    };

    writeData('education_research_state', updatedState);

    return res.json({
      success: true,
      message: `Section ${sectionKey} updated in database successfully`,
      data: sectionPayload
    });
  } catch (err) {
    next(err);
  }
});

// POST restore hospital default data in database
router.post('/reset', async (req, res, next) => {
  try {
    const defaultData = seeds.defaultEducationResearchState || {};
    writeData('education_research_state', defaultData);

    if (supabase) {
      try {
        await supabase
          .from('bv_education_research_state')
          .upsert({
            id: 'primary',
            state_data: defaultData,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('Supabase reset warning:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Education & Medical Research data reset to hospital defaults',
      data: defaultData
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 2. CANDIDATE ADMISSIONS INQUIRIES
// ==========================================

// GET all candidate inquiries
router.get('/inquiries', async (req, res, next) => {
  try {
    const { status, specialty } = req.query;

    if (supabase) {
      try {
        let query = supabase.from('bv_dnb_inquiries').select('*');
        if (status) query = query.eq('status', status);
        if (specialty) query = query.ilike('specialty', `%${specialty}%`);
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (!error && data) {
          return res.json(data);
        }
      } catch (err) {
        console.warn('Supabase get dnb_inquiries error, using local storage:', err.message);
      }
    }

    let inquiries = readData('dnb_inquiries') || [];
    if (status) {
      inquiries = inquiries.filter(i => (i.status || '').toLowerCase() === status.toLowerCase());
    }
    if (specialty) {
      inquiries = inquiries.filter(i => (i.specialty || '').toLowerCase().includes(specialty.toLowerCase()));
    }
    return res.json(inquiries);
  } catch (err) {
    next(err);
  }
});

// POST submit a new candidate inquiry
router.post('/inquiries', async (req, res, next) => {
  try {
    const { candidateName, email, phone, specialty, neetScore, message } = req.body;

    if (!candidateName || !email) {
      return res.status(400).json({ error: 'Candidate Name and Email are required' });
    }

    const newInquiry = {
      id: req.body.id || `INQ-${Date.now().toString().slice(-6)}`,
      candidateName: candidateName.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      specialty: specialty || 'DNB General Medicine',
      neetScore: (neetScore || '').trim(),
      message: (message || '').trim(),
      status: 'New',
      submittedDate: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_dnb_inquiries')
          .insert([newInquiry])
          .select()
          .single();
        if (!error && data) {
          // Sync local storage
          const local = readData('dnb_inquiries') || [];
          writeData('dnb_inquiries', [data, ...local]);
          return res.status(201).json(data);
        }
      } catch (err) {
        console.warn('Supabase insert dnb_inquiry error, falling back to local file:', err.message);
      }
    }

    const inquiries = readData('dnb_inquiries') || [];
    const updated = [newInquiry, ...inquiries];
    writeData('dnb_inquiries', updated);

    return res.status(201).json(newInquiry);
  } catch (err) {
    next(err);
  }
});

// PUT update inquiry status or details
router.put('/inquiries/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_dnb_inquiries')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const local = readData('dnb_inquiries') || [];
          writeData('dnb_inquiries', local.map(item => item.id === id ? { ...item, ...data } : item));
          return res.json(data);
        }
      } catch (err) {
        console.warn('Supabase update dnb_inquiry error, using local storage:', err.message);
      }
    }

    const inquiries = readData('dnb_inquiries') || [];
    const index = inquiries.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    inquiries[index] = { ...inquiries[index], ...updates };
    writeData('dnb_inquiries', inquiries);

    return res.json(inquiries[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE inquiry
router.delete('/inquiries/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (supabase) {
      try {
        await supabase.from('bv_dnb_inquiries').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete dnb_inquiry warning:', err.message);
      }
    }

    const inquiries = readData('dnb_inquiries') || [];
    const filtered = inquiries.filter(i => i.id !== id);
    writeData('dnb_inquiries', filtered);

    return res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
