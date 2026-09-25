import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();
const BUCKET_NAME = 'statutory-pdfs';
let bucketChecked = false;

// Local PDF Buffer store for fast in-memory serving
let pdfStore = readData('statutory_pdf_buffers') || {};
if (typeof pdfStore !== 'object' || Array.isArray(pdfStore)) {
  pdfStore = {};
}

// Ensure public Supabase Storage Bucket exists
async function ensureBucketExists() {
  if (!supabase || bucketChecked) return;
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some(b => b.name === BUCKET_NAME);
      if (!exists) {
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 20971520, // 20 MB
          allowedMimeTypes: ['application/pdf']
        });
        if (!createError) {
          console.log(`[SUPABASE BUCKET] Successfully created public storage bucket: "${BUCKET_NAME}"`);
        } else {
          console.warn(`[SUPABASE BUCKET] Bucket create notice:`, createError.message);
        }
      }
      bucketChecked = true;
    }
  } catch (err) {
    console.warn('[SUPABASE BUCKET] Bucket check warning:', err.message);
  }
}

// Upload PDF file to Supabase Storage Bucket and return public URL
async function uploadToBucket(docId, base64Data, fileName = 'document.pdf') {
  if (!supabase) return null;

  try {
    await ensureBucketExists();

    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    const filePath = `${docId}.pdf`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.warn(`[SUPABASE BUCKET] Upload notice for ${docId}:`, error.message);
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (urlData?.publicUrl) {
      console.log(`[SUPABASE BUCKET] Saved "${fileName}" to bucket ->`, urlData.publicUrl);
      return urlData.publicUrl;
    }
  } catch (err) {
    console.error(`[SUPABASE BUCKET ERROR] ${docId}:`, err.message);
  }

  return null;
}

// Download PDF buffer from Supabase Storage Bucket
async function downloadFromBucket(docId) {
  if (!supabase) return null;
  try {
    await ensureBucketExists();
    const filePath = `${docId}.pdf`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (!error && data) {
      const arrayBuffer = await data.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return `data:application/pdf;base64,${buffer.toString('base64')}`;
    }
  } catch (err) {
    console.warn(`[SUPABASE BUCKET] Download notice for ${docId}:`, err.message);
  }
  return null;
}

// Helper to get PDF base64 buffer from memory, Supabase Bucket, database table, or disk
async function getPdfBuffer(docId) {
  if (!docId) return null;

  // 1. Check in-memory store
  if (pdfStore[docId]) {
    return pdfStore[docId];
  }

  // 2. Check Supabase Storage Bucket
  const bucketBuffer = await downloadFromBucket(docId);
  if (bucketBuffer) {
    pdfStore[docId] = bucketBuffer;
    return bucketBuffer;
  }

  // 3. Check Supabase Database Table (if configured)
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bv_statutory_pdf_buffers')
        .select('base64_data')
        .eq('doc_id', docId)
        .maybeSingle();

      if (!error && data?.base64_data) {
        pdfStore[docId] = data.base64_data;
        return data.base64_data;
      }
    } catch (e) {
      console.warn('[API Statutory PDF] Supabase buffer table read warning:', e.message);
    }

    try {
      const { data } = await supabase
        .from('bv_statutory_compliances_state')
        .select('state_data')
        .eq('id', `pdf_buf_${docId}`)
        .maybeSingle();

      if (data?.state_data?.base64Data) {
        pdfStore[docId] = data.state_data.base64Data;
        return data.state_data.base64Data;
      }
    } catch (e) {}
  }

  // 4. Fallback to disk JSON storage
  const storedBuffers = readData('statutory_pdf_buffers') || {};
  if (storedBuffers[docId]) {
    pdfStore[docId] = storedBuffers[docId];
    return storedBuffers[docId];
  }

  return null;
}

// Helper to save PDF base64 buffer to memory, disk, Supabase table, and Supabase Bucket
async function savePdfBuffer(docId, base64Data, fileName = 'document.pdf') {
  pdfStore[docId] = base64Data;
  writeData('statutory_pdf_buffers', pdfStore);

  // Upload to Supabase Storage Bucket
  const bucketUrl = await uploadToBucket(docId, base64Data, fileName);

  // Sync to Supabase Database Table
  if (supabase) {
    try {
      const { error } = await supabase
        .from('bv_statutory_pdf_buffers')
        .upsert({
          doc_id: docId,
          base64_data: base64Data,
          updated_at: new Date().toISOString()
        });

      if (error) {
        await supabase
          .from('bv_statutory_compliances_state')
          .upsert({
            id: `pdf_buf_${docId}`,
            state_data: { base64Data },
            updated_at: new Date().toISOString()
          });
      }
    } catch (e) {
      console.warn('[API Statutory PDF] Supabase buffer save warning:', e.message);
    }
  }

  return bucketUrl;
}

// Auto-sync local PDF buffers to Supabase Bucket & Database on backend startup
if (supabase) {
  setTimeout(async () => {
    try {
      const stored = readData('statutory_pdf_buffers') || {};
      for (const [docId, base64Data] of Object.entries(stored)) {
        if (typeof base64Data === 'string' && base64Data.length > 50) {
          await savePdfBuffer(docId, base64Data, `${docId}.pdf`);
        }
      }
      console.log('[API Statutory PDF] Synced all local PDF buffers to Supabase Bucket & Database.');
    } catch (e) {
      console.warn('[API Statutory PDF] Initial Supabase buffer sync warning:', e.message);
    }
  }, 2000);
}

// Helper to sanitize localhost:5000 URLs dynamically to match active request host
function sanitizeStateUrls(state, req) {
  if (!state) return state;
  const host = req ? (req.get('host') || 'localhost:5000') : 'localhost:5000';
  const protocol = req ? (req.protocol || 'http') : 'http';
  const currentOrigin = `${protocol}://${host}`;

  const transformUrl = (url) => {
    if (!url) return '';
    if (url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
      return url.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, currentOrigin);
    }
    return url;
  };

  const cleanCompliances = Array.isArray(state.compliances)
    ? state.compliances.map(item => item ? { ...item, pdfUrl: transformUrl(item.pdfUrl) } : item)
    : [];

  return {
    ...state,
    compliances: cleanCompliances,
    siteMapPdfUrl: transformUrl(state.siteMapPdfUrl)
  };
}

// Helper to get current state (either from Supabase or local JSON storage)
async function getCurrentState(req) {
  let rawState = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bv_statutory_compliances_state')
        .select('state_data')
        .eq('id', 'primary')
        .single();

      if (!error && data?.state_data) {
        rawState = data.state_data;
      }
    } catch (e) {
      console.warn('[API Statutory Compliances] Supabase read warning, falling back to local JSON:', e.message);
    }
  }

  if (!rawState) {
    const localState = readData('statutory_compliances_state');
    rawState = localState || seeds.defaultStatutoryCompliancesState || { compliances: [] };
  }

  return sanitizeStateUrls(rawState, req);
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
    const state = await getCurrentState(req);
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. GET /doc/:docId - STREAM PDF FILE DIRECTLY TO BROWSER VIEWER
// ----------------------------------------------------
router.get('/doc/:docId', async (req, res, next) => {
  try {
    const { docId } = req.params;
    const base64Data = await getPdfBuffer(docId);

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
    const bucketPublicUrl = await savePdfBuffer(docId, base64Data, fileName || `${docId}.pdf`);

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const serverPdfUrl = bucketPublicUrl || `${protocol}://${host}/api/statutory-compliances/doc/${docId}`;

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
