import express from 'express';
import { query } from '../utils/pgDb.js';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

// ==========================================
// 1. EDUCATION & MEDICAL RESEARCH STATE
// ==========================================

// GET current education & medical research state from PostgreSQL database
router.get('/', async (req, res, next) => {
  try {
    // 1. Try querying PostgreSQL database directly
    try {
      const pgRes = await query(`SELECT state_data FROM bv_education_research_state WHERE id = 'primary';`);
      if (pgRes.rows && pgRes.rows.length > 0 && pgRes.rows[0].state_data) {
        return res.json(pgRes.rows[0].state_data);
      }
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not read bv_education_research_state, falling back:', pgErr.message);
    }

    // 2. Fallback to Supabase client
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
      } catch (err) { }
    }

    // 3. Fallback to local JSON storage
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

    // 1. Save to local JSON database storage
    writeData('education_research_state', payload);

    // 2. Persist to PostgreSQL database table
    try {
      await query(
        `INSERT INTO bv_education_research_state (id, state_data, updated_at) 
         VALUES ('primary', $1, NOW()) 
         ON CONFLICT (id) DO UPDATE SET state_data = $1, updated_at = NOW();`,
        [JSON.stringify(payload)]
      );
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not update bv_education_research_state:', pgErr.message);
    }

    // 3. Optional Supabase client fallback
    if (supabase) {
      try {
        await supabase
          .from('bv_education_research_state')
          .upsert({
            id: 'primary',
            state_data: payload,
            updated_at: new Date().toISOString()
          });
      } catch (err) { }
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
    let state = null;

    try {
      const pgRes = await query(`SELECT state_data FROM bv_education_research_state WHERE id = 'primary';`);
      if (pgRes.rows && pgRes.rows.length > 0 && pgRes.rows[0].state_data) {
        state = pgRes.rows[0].state_data;
      }
    } catch (e) { }

    if (!state) {
      state = readData('education_research_state') || {};
    }

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
    let currentState = null;

    try {
      const pgRes = await query(`SELECT state_data FROM bv_education_research_state WHERE id = 'primary';`);
      if (pgRes.rows && pgRes.rows.length > 0 && pgRes.rows[0].state_data) {
        currentState = pgRes.rows[0].state_data;
      }
    } catch (e) { }

    if (!currentState) {
      currentState = readData('education_research_state') || {};
    }

    const updatedState = {
      ...currentState,
      [sectionKey]: sectionPayload
    };

    writeData('education_research_state', updatedState);

    try {
      await query(
        `INSERT INTO bv_education_research_state (id, state_data, updated_at) 
         VALUES ('primary', $1, NOW()) 
         ON CONFLICT (id) DO UPDATE SET state_data = $1, updated_at = NOW();`,
        [JSON.stringify(updatedState)]
      );
    } catch (e) { }

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

    try {
      await query(
        `INSERT INTO bv_education_research_state (id, state_data, updated_at) 
         VALUES ('primary', $1, NOW()) 
         ON CONFLICT (id) DO UPDATE SET state_data = $1, updated_at = NOW();`,
        [JSON.stringify(defaultData)]
      );
    } catch (e) { }

    if (supabase) {
      try {
        await supabase
          .from('bv_education_research_state')
          .upsert({
            id: 'primary',
            state_data: defaultData,
            updated_at: new Date().toISOString()
          });
      } catch (err) { }
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
// 2. DYNAMIC EDUCATION PROGRAMS (CREATE / EDIT / DELETE)
// ==========================================

// GET all dynamic education programs
router.get('/programs', async (req, res, next) => {
  try {
    try {
      const pgRes = await query(`SELECT * FROM admin_education_programs ORDER BY created_at DESC;`);
      if (pgRes.rows && pgRes.rows.length > 0) {
        return res.json(pgRes.rows);
      }
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not read admin_education_programs:', pgErr.message);
    }

    const state = readData('education_research_state') || {};
    return res.json(state.customPrograms || []);
  } catch (err) {
    next(err);
  }
});

// POST create a brand new education program in database
router.post('/programs', async (req, res, next) => {
  try {
    const {
      title,
      category,
      badge,
      duration,
      seats,
      eligibility,
      overview,
      curriculum,
      faculties,
      highlights,
      contactInfo
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Program title is required' });
    }

    const id = req.body.id || `edu-prog-${Date.now()}`;
    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProgram = {
      id,
      title: title.trim(),
      slug,
      category: category || 'Academic Program',
      badge: badge || 'Accredited',
      duration: duration || '1 Year',
      seats: Number(seats) || 0,
      eligibility: eligibility || '',
      overview: overview || '',
      curriculum: Array.isArray(curriculum) ? curriculum : [],
      faculties: Array.isArray(faculties) ? faculties : [],
      highlights: Array.isArray(highlights) ? highlights : [],
      contactInfo: contactInfo || {
        phone: '022 2845 8000',
        email: 'education@bhaktivedantahospital.com'
      },
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    // 1. Insert into PostgreSQL database table
    try {
      await query(
        `INSERT INTO admin_education_programs 
         (id, title, slug, category, badge, duration, seats, eligibility, overview, curriculum, faculties, highlights, contact_info, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET 
           title = $2, slug = $3, category = $4, badge = $5, duration = $6, seats = $7,
           eligibility = $8, overview = $9, curriculum = $10, faculties = $11, highlights = $12,
           contact_info = $13, status = $14, updated_at = NOW();`,
        [
          id,
          newProgram.title,
          newProgram.slug,
          newProgram.category,
          newProgram.badge,
          newProgram.duration,
          newProgram.seats,
          newProgram.eligibility,
          newProgram.overview,
          JSON.stringify(newProgram.curriculum),
          JSON.stringify(newProgram.faculties),
          JSON.stringify(newProgram.highlights),
          JSON.stringify(newProgram.contactInfo),
          newProgram.status
        ]
      );
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not insert into admin_education_programs:', pgErr.message);
    }

    // 2. Append to full state JSON & update bv_education_research_state
    const state = readData('education_research_state') || {};
    const existingList = state.customPrograms || [];
    const updatedPrograms = [newProgram, ...existingList.filter(p => p.id !== id)];
    const updatedState = {
      ...state,
      customPrograms: updatedPrograms
    };

    writeData('education_research_state', updatedState);

    // Sync state in PostgreSQL
    try {
      await query(
        `UPDATE bv_education_research_state SET state_data = $1, updated_at = NOW() WHERE id = 'primary';`,
        [JSON.stringify(updatedState)]
      );
    } catch (e) { }

    return res.status(201).json({
      success: true,
      message: 'New education program created and saved to database successfully',
      program: newProgram
    });
  } catch (err) {
    next(err);
  }
});

// DELETE a dynamic education program from database
router.delete('/programs/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Delete from PostgreSQL
    try {
      await query(`DELETE FROM admin_education_programs WHERE id = $1 OR slug = $1;`, [id]);
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not delete from admin_education_programs:', pgErr.message);
    }

    // 2. Remove from state JSON
    const state = readData('education_research_state') || {};
    const filtered = (state.customPrograms || []).filter(p => p.id !== id && p.slug !== id);
    const updatedState = {
      ...state,
      customPrograms: filtered
    };
    writeData('education_research_state', updatedState);

    try {
      await query(
        `UPDATE bv_education_research_state SET state_data = $1, updated_at = NOW() WHERE id = 'primary';`,
        [JSON.stringify(updatedState)]
      );
    } catch (e) { }

    return res.json({
      success: true,
      message: 'Education program deleted from database successfully'
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 3. CANDIDATE ADMISSIONS INQUIRIES
// ==========================================

// GET all candidate inquiries
router.get('/inquiries', async (req, res, next) => {
  try {
    const { status, specialty } = req.query;

    // 1. Try PostgreSQL database
    try {
      let sql = `SELECT * FROM bv_education_inquiries`;
      const params = [];
      const where = [];

      if (status) {
        params.push(status);
        where.push(`LOWER(status) = LOWER($${params.length})`);
      }
      if (specialty) {
        params.push(`%${specialty}%`);
        where.push(`program_name ILIKE $${params.length}`);
      }
      if (where.length > 0) {
        sql += ` WHERE ${where.join(' AND ')}`;
      }
      sql += ` ORDER BY created_at DESC;`;

      const pgRes = await query(sql, params);
      if (pgRes.rows && pgRes.rows.length > 0) {
        const formatted = pgRes.rows.map(r => ({
          id: r.id,
          candidateName: r.candidate_name,
          email: r.email,
          phone: r.phone,
          specialty: r.program_name,
          neetScore: r.neet_score,
          message: r.message,
          status: r.status,
          submittedDate: r.created_at
        }));
        return res.json(formatted);
      }
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not read bv_education_inquiries:', pgErr.message);
    }

    // 2. Fallback to local storage
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

    // 1. Save to PostgreSQL database
    try {
      await query(
        `INSERT INTO bv_education_inquiries 
         (id, candidate_name, email, phone, program_name, neet_score, message, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         ON CONFLICT (id) DO UPDATE SET 
           candidate_name = $2, email = $3, phone = $4, program_name = $5, neet_score = $6, message = $7, status = $8;`,
        [
          newInquiry.id,
          newInquiry.candidateName,
          newInquiry.email,
          newInquiry.phone,
          newInquiry.specialty,
          newInquiry.neetScore,
          newInquiry.message,
          newInquiry.status
        ]
      );
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not insert inquiry:', pgErr.message);
    }

    // 2. Sync to local storage
    const inquiries = readData('dnb_inquiries') || [];
    const updated = [newInquiry, ...inquiries];
    writeData('dnb_inquiries', updated);

    return res.status(201).json(newInquiry);
  } catch (err) {
    next(err);
  }
});

// PUT update inquiry status
router.put('/inquiries/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    try {
      if (updates.status) {
        await query(`UPDATE bv_education_inquiries SET status = $1 WHERE id = $2;`, [updates.status, id]);
      }
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not update inquiry status:', pgErr.message);
    }

    const inquiries = readData('dnb_inquiries') || [];
    const index = inquiries.findIndex(i => i.id === id);
    if (index !== -1) {
      inquiries[index] = { ...inquiries[index], ...updates };
      writeData('dnb_inquiries', inquiries);
      return res.json(inquiries[index]);
    }

    return res.json({ id, ...updates });
  } catch (err) {
    next(err);
  }
});

// DELETE inquiry
router.delete('/inquiries/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await query(`DELETE FROM bv_education_inquiries WHERE id = $1;`, [id]);
    } catch (pgErr) {
      console.warn('[PostgreSQL] Could not delete inquiry:', pgErr.message);
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
