import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import { defaultAboutUsData } from '../data/defaultAboutUsData.js';

const router = express.Router();

/**
 * Helper to retrieve current About Us state.
 * Queries all section rows from admin_about_us / bv_about_us_state,
 * allowing edits made directly in Supabase or via Admin UI to be fetched.
 */
async function getCurrentState() {
  if (supabase) {
    // 1. Try 'admin_about_us' (matching the admin_* naming convention)
    try {
      const { data: rows, error } = await supabase
        .from('admin_about_us')
        .select('id, state_data');

      if (!error && Array.isArray(rows) && rows.length > 0) {
        const rowMap = {};
        rows.forEach(r => { rowMap[r.id] = r.state_data; });

        const fullState = rowMap['about_us_state'] || {};
        return {
          aboutHospital: rowMap['about_hospital'] || fullState.aboutHospital || defaultAboutUsData.aboutHospital,
          history: rowMap['history'] || fullState.history || defaultAboutUsData.history,
          chairmansMessage: rowMap['chairman'] || fullState.chairmansMessage || defaultAboutUsData.chairmansMessage,
          ourInspiration: rowMap['inspiration'] || fullState.ourInspiration || defaultAboutUsData.ourInspiration,
          logo: rowMap['logo'] || fullState.logo || defaultAboutUsData.logo,
          visionMissionValues: rowMap['vision_mission'] || fullState.visionMissionValues || defaultAboutUsData.visionMissionValues,
          awardsAccreditation: rowMap['awards'] || fullState.awardsAccreditation || defaultAboutUsData.awardsAccreditation,
          eventsAndNews: rowMap['events_news'] || fullState.eventsAndNews || defaultAboutUsData.eventsAndNews,
          sriChaitanyaTrust: rowMap['sri_chaitanya_trust'] || fullState.sriChaitanyaTrust || defaultAboutUsData.sriChaitanyaTrust,
          managementTeam: rowMap['management_team'] || fullState.managementTeam || defaultAboutUsData.managementTeam,
          newDevelopments: rowMap['new_developments'] || fullState.newDevelopments || defaultAboutUsData.newDevelopments,
          spiritualAdvisors: rowMap['spiritual_advisors'] || fullState.spiritualAdvisors || defaultAboutUsData.spiritualAdvisors
        };
      }
    } catch (err) {
      console.warn('[Supabase admin_about_us read error]:', err.message);
    }

    // 2. Try 'bv_about_us_state'
    try {
      const { data: rows, error } = await supabase
        .from('bv_about_us_state')
        .select('id, state_data');

      if (!error && Array.isArray(rows) && rows.length > 0) {
        const rowMap = {};
        rows.forEach(r => { rowMap[r.id] = r.state_data; });

        const fullState = rowMap['about_us_state'] || {};
        return {
          aboutHospital: rowMap['about_hospital'] || fullState.aboutHospital || defaultAboutUsData.aboutHospital,
          history: rowMap['history'] || fullState.history || defaultAboutUsData.history,
          chairmansMessage: rowMap['chairman'] || fullState.chairmansMessage || defaultAboutUsData.chairmansMessage,
          ourInspiration: rowMap['inspiration'] || fullState.ourInspiration || defaultAboutUsData.ourInspiration,
          logo: rowMap['logo'] || fullState.logo || defaultAboutUsData.logo,
          visionMissionValues: rowMap['vision_mission'] || fullState.visionMissionValues || defaultAboutUsData.visionMissionValues,
          awardsAccreditation: rowMap['awards'] || fullState.awardsAccreditation || defaultAboutUsData.awardsAccreditation,
          eventsAndNews: rowMap['events_news'] || fullState.eventsAndNews || defaultAboutUsData.eventsAndNews,
          sriChaitanyaTrust: rowMap['sri_chaitanya_trust'] || fullState.sriChaitanyaTrust || defaultAboutUsData.sriChaitanyaTrust,
          managementTeam: rowMap['management_team'] || fullState.managementTeam || defaultAboutUsData.managementTeam,
          newDevelopments: rowMap['new_developments'] || fullState.newDevelopments || defaultAboutUsData.newDevelopments,
          spiritualAdvisors: rowMap['spiritual_advisors'] || fullState.spiritualAdvisors || defaultAboutUsData.spiritualAdvisors
        };
      }
    } catch (err) {
      console.warn('[Supabase bv_about_us_state read error]:', err.message);
    }
  }

  // 3. Try reading from local JSON disk storage
  try {
    const diskData = readData('about_us_state');
    if (diskData && typeof diskData === 'object' && diskData.aboutHospital) {
      return {
        ...defaultAboutUsData,
        ...diskData
      };
    }
  } catch (err) {
    console.warn('[Storage] Could not read about_us_state.json:', err.message);
  }

  // 4. Fallback to default verified data
  return defaultAboutUsData;
}

/**
 * Helper to persist full About Us state to both Supabase and disk.
 * Uses clean standardized IDs without duplicate prefixes.
 */
async function saveFullState(state) {
  // Ensure sriChaitanyaTrust, managementTeam, newDevelopments are preserved
  const fullState = {
    ...defaultAboutUsData,
    ...state,
    sriChaitanyaTrust: state.sriChaitanyaTrust || defaultAboutUsData.sriChaitanyaTrust,
    managementTeam: state.managementTeam || defaultAboutUsData.managementTeam,
    newDevelopments: state.newDevelopments || defaultAboutUsData.newDevelopments,
    spiritualAdvisors: state.spiritualAdvisors || defaultAboutUsData.spiritualAdvisors
  };

  // 1. Always save to local JSON storage for instant persistence
  writeData('about_us_state', fullState);

  // 2. Upsert to Supabase database (admin_about_us, bv_about_us_state)
  if (supabase) {
    try {
      const now = new Date().toISOString();
      const rows = [
        { id: 'about_hospital', section_name: 'About Hospital Overview', state_data: fullState.aboutHospital || {}, updated_at: now },
        { id: 'history', section_name: 'History Timeline', state_data: fullState.history || [], updated_at: now },
        { id: 'chairman', section_name: "Chairman's Message", state_data: fullState.chairmansMessage || {}, updated_at: now },
        { id: 'inspiration', section_name: 'Our Inspiration', state_data: fullState.ourInspiration || {}, updated_at: now },
        { id: 'logo', section_name: 'Logo Symbolism', state_data: fullState.logo || {}, updated_at: now },
        { id: 'vision_mission', section_name: 'Vision, Mission & Values', state_data: fullState.visionMissionValues || {}, updated_at: now },
        { id: 'awards', section_name: 'Awards & Accreditation', state_data: fullState.awardsAccreditation || {}, updated_at: now },
        { id: 'events_news', section_name: 'Events & Hospital in News', state_data: fullState.eventsAndNews || {}, updated_at: now },
        { id: 'sri_chaitanya_trust', section_name: 'Sri Chaitanya Health and Care Trust', state_data: fullState.sriChaitanyaTrust || {}, updated_at: now },
        { id: 'management_team', section_name: 'Our Management Team', state_data: fullState.managementTeam || [], updated_at: now },
        { id: 'new_developments', section_name: 'New Developments & Updates', state_data: fullState.newDevelopments || [], updated_at: now },
        { id: 'spiritual_advisors', section_name: 'Our Spiritual Advisors', state_data: fullState.spiritualAdvisors || [], updated_at: now },
        { id: 'about_us_state', section_name: 'Full Combined State', state_data: fullState, updated_at: now }
      ];

      // Upsert into both tables
      await supabase.from('admin_about_us').upsert(rows).catch((e) => console.warn('admin_about_us upsert:', e.message));
      await supabase.from('bv_about_us_state').upsert(rows).catch((e) => console.warn('bv_about_us_state upsert:', e.message));
    } catch (err) {
      console.warn('[Supabase] Error saving state:', err.message);
    }
  }

  return fullState;
}

// ----------------------------------------------------
// 1. GET FULL ABOUT US STATE
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
// 2. PUT / UPDATE FULL ABOUT US STATE (ADMIN)
// ----------------------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid about us state payload' });
    }

    const saved = await saveFullState(payload);
    res.json(saved);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 3. POST / RESET TO OFFICIAL WEBPAGE DEFAULTS
// ----------------------------------------------------
router.post('/reset', async (req, res, next) => {
  try {
    const resetState = await saveFullState(defaultAboutUsData);
    res.json(resetState);
  } catch (err) {
    next(err);
  }
});

export default router;
