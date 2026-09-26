import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

function getNormalizedSettings() {
  const current = readData('hospital_settings');
  const defaults = seeds.defaultHospitalSettings || {
    id: 'hospital-settings-main',
    hospitalName: 'Bhaktivedanta Hospital & Research Institute',
    adminEmail: 'admin@bhaktivedantahospital.com',
    contactTitle: 'Contact Us',
    contactPhone: '079-69002222',
    contactWhatsapp: '8400146262',
    contactEmail: 'info@bhaktivedantahospital.com',
    contactAddress: 'Mira Road East, Thane, Maharashtra 401107',
    mapUrl: 'https://maps.app.goo.gl/yX3uLp8jXz2U4u1D6',
    emergencyPhone: '079 6900 2222',
    emergencyLabel: 'For Emergency & Appointments',
    appointmentSlot: '20 minutes',
    updatedAt: new Date().toISOString()
  };

  if (!current || typeof current !== 'object' || Array.isArray(current)) {
    return { ...defaults };
  }

  return {
    ...defaults,
    ...current
  };
}

// GET /api/settings - Fetch current hospital settings
router.get('/', async (req, res, next) => {
  try {
    let settings = getNormalizedSettings();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data && data.settings_data) {
          settings = {
            ...settings,
            ...data.settings_data,
            updatedAt: data.updated_at || settings.updatedAt
          };
        }
      } catch (sbErr) {
        // Table may not exist yet in Supabase; fallback gracefully to local storage
      }
    }

    return res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings - Update hospital settings
router.put('/', async (req, res, next) => {
  try {
    const current = getNormalizedSettings();
    const payload = req.body || {};

    const updated = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString()
    };

    // Save to disk JSON store
    writeData('hospital_settings', updated);

    // Sync to Supabase if configured
    if (supabase) {
      try {
        await supabase
          .from('bv_settings')
          .upsert({
            id: 'hospital-settings-main',
            settings_data: updated,
            updated_at: updated.updatedAt
          }, { onConflict: 'id' });
      } catch (sbErr) {
        // Continue even if Supabase table is not provisioned
      }
    }

    console.log('[API Settings] Successfully updated hospital settings:', {
      contactPhone: updated.contactPhone,
      contactWhatsapp: updated.contactWhatsapp,
      contactEmail: updated.contactEmail
    });

    return res.json({
      success: true,
      message: 'Hospital settings updated successfully',
      settings: updated
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/settings - Alias for PUT
router.post('/', async (req, res, next) => {
  return router.handle({ ...req, method: 'PUT' }, res, next);
});

// POST /api/settings/reset - Reset to factory defaults
router.post('/reset', async (req, res, next) => {
  try {
    const defaults = {
      ...seeds.defaultHospitalSettings,
      updatedAt: new Date().toISOString()
    };
    writeData('hospital_settings', defaults);
    return res.json({
      success: true,
      message: 'Settings reset to factory defaults',
      settings: defaults
    });
  } catch (err) {
    next(err);
  }
});

export default router;
