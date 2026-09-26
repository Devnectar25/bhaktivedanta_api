import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

// Helper to convert internal error object to Supabase schema columns (id, errorCode, errorMessage, errorStack)
function mapToSupabaseRow(errObj) {
  const id = errObj.id || `ERR-${Date.now()}`;
  const level = errObj.level || 'Error';
  const source = errObj.source || 'Client Web App';
  const endpoint = errObj.endpoint || '';
  const status = errObj.status || 'Investigating';
  const message = errObj.message || 'Unhandled error exception';
  const timestamp = errObj.timestamp || new Date().toLocaleString();
  const count = errObj.count || 1;
  const details = errObj.details || '';

  const metaHeader = `[Source: ${source}] [Endpoint: ${endpoint || 'N/A'}] [Status: ${status}] [Timestamp: ${timestamp}] [Count: ${count}]`;
  const stackContent = details ? `${metaHeader}\nDetails / Stack:\n${details}` : metaHeader;

  return {
    id: id,
    errorCode: level,
    errorMessage: message,
    errorStack: stackContent
  };
}

// Helper to convert Supabase row back to app error object for UI
function mapFromSupabaseRow(dbRow) {
  if (!dbRow) return null;

  let source = 'Client Web App';
  let endpoint = '';
  let status = 'Investigating';
  let timestamp = dbRow.created_at ? new Date(dbRow.created_at).toLocaleString() : new Date().toLocaleString();
  let count = 1;
  let details = dbRow.errorStack || '';

  if (dbRow.errorStack) {
    const srcMatch = dbRow.errorStack.match(/\[Source:\s*([^\]]+)\]/);
    if (srcMatch) source = srcMatch[1];

    const epMatch = dbRow.errorStack.match(/\[Endpoint:\s*([^\]]+)\]/);
    if (epMatch && epMatch[1] !== 'N/A') endpoint = epMatch[1];

    const stMatch = dbRow.errorStack.match(/\[Status:\s*([^\]]+)\]/);
    if (stMatch) status = stMatch[1];

    const tsMatch = dbRow.errorStack.match(/\[Timestamp:\s*([^\]]+)\]/);
    if (tsMatch) timestamp = tsMatch[1];

    const cntMatch = dbRow.errorStack.match(/\[Count:\s*(\d+)\]/);
    if (cntMatch) count = parseInt(cntMatch[1], 10);
  }

  return {
    id: dbRow.id,
    level: dbRow.errorCode || dbRow.level || 'Error',
    source: source,
    message: dbRow.errorMessage || dbRow.message || 'Unhandled error exception',
    endpoint: endpoint,
    status: status,
    timestamp: timestamp,
    details: details,
    count: count
  };
}

// Helper to fetch all error logs from Supabase or local storage
export async function fetchAppErrors() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bv_app_errors')
        .select('*');

      if (!error && data && data.length > 0) {
        return data.map(mapFromSupabaseRow);
      }

      // If empty, seed default errors into Supabase
      if (!error && data && data.length === 0 && seeds.defaultAppErrors?.length > 0) {
        try {
          const seedRows = seeds.defaultAppErrors.map(mapToSupabaseRow);
          await supabase.from('bv_app_errors').insert(seedRows);
          console.log('[API App Errors] Seeded initial errors into Supabase bv_app_errors table.');
          return seeds.defaultAppErrors.map(e => ({ ...e, count: e.count || 1 }));
        } catch (seedErr) {
          console.warn('[API App Errors] Seed warning:', seedErr.message);
        }
      }
    } catch (e) {
      console.warn('[API App Errors] Supabase read warning, fallback to local JSON:', e.message);
    }
  }

  const localErrors = readData('app_errors');
  const errors = localErrors || seeds.defaultAppErrors || [];
  return errors.map(e => ({ ...e, count: e.count || 1 }));
}

// Helper to log a new error (sync with Supabase and local JSON)
export async function logAppError(errorItem) {
  const incomingMessage = errorItem.message || 'Unhandled error exception';
  const incomingSource = errorItem.source || 'Client Web App';
  const incomingEndpoint = errorItem.endpoint || '';

  // 1. Fetch current errors to check for existing match
  const currentErrors = await fetchAppErrors();
  const existing = currentErrors.find(e => 
    e.message === incomingMessage && 
    (e.source === incomingSource || (incomingEndpoint && e.endpoint === incomingEndpoint))
  );

  let targetError;

  if (existing) {
    const currentCount = parseInt(existing.count || 1, 10);
    targetError = {
      ...existing,
      timestamp: errorItem.timestamp || new Date().toLocaleString(),
      count: currentCount + 1,
      level: errorItem.level || existing.level,
      details: errorItem.details || existing.details
    };
  } else {
    targetError = {
      id: errorItem.id || `ERR-${Date.now()}`,
      timestamp: errorItem.timestamp || new Date().toLocaleString(),
      level: errorItem.level || 'Error',
      source: incomingSource,
      message: incomingMessage,
      endpoint: incomingEndpoint,
      status: errorItem.status || 'Investigating',
      details: errorItem.details || '',
      count: errorItem.count || 1
    };
  }

  // 2. Write to local JSON disk storage
  const appErrors = readData('app_errors') || [];
  const filteredLocal = appErrors.filter(e => e.id !== targetError.id && e.message !== targetError.message);
  const updatedList = [targetError, ...filteredLocal];
  writeData('app_errors', updatedList);

  // 3. Sync to Supabase table bv_app_errors with exact column names (id, errorCode, errorMessage, errorStack)
  if (supabase) {
    try {
      const dbRow = mapToSupabaseRow(targetError);
      const { error } = await supabase
        .from('bv_app_errors')
        .upsert(dbRow, { onConflict: 'id' });

      if (error) {
        console.error('[SUPABASE ERROR] Failed to upsert error to bv_app_errors:', error.message);
      } else {
        console.log(`[DATABASE] Successfully updated error in Supabase bv_app_errors table: ${targetError.id} (count: ${targetError.count})`);
      }
    } catch (err) {
      console.error('[DATABASE ERROR] Supabase logAppError exception:', err.message);
    }
  }

  return targetError;
}

// Auto-sync local error logs to Supabase on startup
if (supabase) {
  setTimeout(async () => {
    try {
      const localErrors = readData('app_errors') || [];
      if (Array.isArray(localErrors) && localErrors.length > 0) {
        const dbRows = localErrors.map(mapToSupabaseRow);
        const { error } = await supabase
          .from('bv_app_errors')
          .upsert(dbRows, { onConflict: 'id' });

        if (!error) {
          console.log('[API App Errors] Synced all local error logs to Supabase bv_app_errors table.');
        } else {
          console.warn('[API App Errors] Startup sync notice:', error.message);
        }
      }
    } catch (e) {
      console.warn('[API App Errors] Initial sync warning:', e.message);
    }
  }, 1500);
}

// ----------------------------------------------------
// 1. GET ALL APPLICATION ERROR LOGS
// ----------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const errors = await fetchAppErrors();
    res.json(errors);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. POST RECORD NEW APPLICATION ERROR
// ----------------------------------------------------
router.post('/', async (req, res, next) => {
  try {
    const newError = await logAppError(req.body || {});
    res.status(201).json(newError);
  } catch (err) {
    console.error('[DATABASE ERROR] Failed to record application error:', err);
    next(err);
  }
});

// ----------------------------------------------------
// 3. PUT UPDATE ERROR LOG STATUS
// ----------------------------------------------------
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentErrors = await fetchAppErrors();
    const existing = currentErrors.find(e => e.id === id);

    const updated = {
      ...(existing || {}),
      ...req.body,
      id
    };

    // Update local JSON storage
    const appErrors = readData('app_errors') || [];
    const index = appErrors.findIndex(e => e.id === id);
    if (index !== -1) {
      appErrors[index] = updated;
    } else {
      appErrors.unshift(updated);
    }
    writeData('app_errors', appErrors);

    // Update Supabase with mapped row
    if (supabase) {
      try {
        const dbRow = mapToSupabaseRow(updated);
        await supabase
          .from('bv_app_errors')
          .upsert(dbRow, { onConflict: 'id' });
      } catch (err) {
        console.warn('[API App Errors] Supabase update error:', err.message);
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 4. DELETE CLEAR ALL ERROR LOGS OR SINGLE ERROR LOG
// ----------------------------------------------------
router.delete('/', async (req, res, next) => {
  try {
    const { id } = req.query;

    if (id) {
      const appErrors = readData('app_errors') || [];
      const filtered = appErrors.filter(e => e.id !== id);
      writeData('app_errors', filtered);

      if (supabase) {
        try {
          await supabase
            .from('bv_app_errors')
            .delete()
            .eq('id', id);
        } catch (e) {}
      }

      return res.json({ success: true, message: `Error log ${id} deleted` });
    }

    writeData('app_errors', []);
    if (supabase) {
      try {
        await supabase
          .from('bv_app_errors')
          .delete()
          .neq('id', '');
      } catch (e) {}
    }

    res.json({ success: true, message: 'All application error logs cleared' });
  } catch (err) {
    next(err);
  }
});

export default router;
