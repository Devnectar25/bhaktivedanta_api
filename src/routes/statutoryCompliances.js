import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

// Local PDF Buffer store for serving direct PDF streams to browser
let pdfStore = readData('statutory_pdf_buffers') || {};
if (typeof pdfStore !== 'object' || Array.isArray(pdfStore)) {
  pdfStore = {};
}

// Helper to get current state (either from Supabase or local JSON storage)
async function getCurrentState() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bv_statutory_compliances_state')
        .select('state_data')
        .eq('id', 'primary')
        .single();

      if (!error && data?.state_data) {
        return data.state_data;
      }
    } catch (e) {
      console.warn('[API Statutory Compliances] Supabase read warning, falling back to local JSON:', e.message);
    }
  }

  const localState = readData('statutory_compliances_state');
  return localState || seeds.defaultStatutoryCompliancesState || { compliances: [] };
}

// Helper to save state (sync with Supabase and local JSON storage)
async function saveState(state) {
  writeData('statutory_compliances_state', state);

  if (supabase) {
    try {
      await supabase
        .from('bv_statutory_compliances_state')
        .upsert({
          id: 'primary',
          state_data: state,
          updated_at: new Date().toISOString()
        });
    } catch (e) {
      console.warn('[API Statutory Compliances] Supabase sync warning:', e.message);
    }
  }

  return state;
}

// ----------------------------------------------------
// 1. GET ALL STATUTORY COMPLIANCES
// ----------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const state = await getCurrentState();
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. GET /doc/:docId - STREAM PDF FILE DIRECTLY TO BROWSER VIEWER
// ----------------------------------------------------
router.get('/doc/:docId', (req, res, next) => {
  try {
    const { docId } = req.params;
    const base64Data = pdfStore[docId];

    if (!base64Data) {
      return res.status(404).send('PDF document not found');
    }

    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="statutory-compliance.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 3. PUT UPDATE ENTIRE STATUTORY COMPLIANCES STATE
// ----------------------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.compliances || !Array.isArray(payload.compliances)) {
      return res.status(400).json({ error: 'Invalid state payload. "compliances" array is required.' });
    }

    if (payload.compliances.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 statutory compliance items allowed.' });
    }

    const updated = await saveState(payload);
    res.json({ success: true, message: 'Statutory compliances updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 4. POST UPLOAD COMPLIANCE PDF FILE
// ----------------------------------------------------
router.post('/upload', async (req, res, next) => {
  try {
    const { title, fileName, base64Data } = req.body || {};
    if (!base64Data) {
      return res.status(400).json({ error: 'No PDF file data provided' });
    }

    const docId = `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    pdfStore[docId] = base64Data;
    writeData('statutory_pdf_buffers', pdfStore);

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const serverPdfUrl = `${protocol}://${host}/api/statutory-compliances/doc/${docId}`;

    console.log(`[API Statutory Upload] Saved PDF "${title || fileName}" ->`, serverPdfUrl);
    return res.json({ success: true, url: serverPdfUrl, docId });
  } catch (err) {
    console.error('[API Statutory Upload Error]:', err);
    next(err);
  }
});

// ----------------------------------------------------
// 5. POST RESET TO DEFAULTS
// ----------------------------------------------------
router.post('/reset', async (req, res, next) => {
  try {
    const defaultState = seeds.defaultStatutoryCompliancesState || { compliances: [] };
    const saved = await saveState(defaultState);
    res.json({ success: true, message: 'Statutory compliances reset to defaults', data: saved });
  } catch (err) {
    next(err);
  }
});

export default router;
