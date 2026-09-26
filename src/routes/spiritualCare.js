import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

/**
 * Retrieve current Spiritual Care state from Supabase tables
 */
async function getCurrentState() {
  if (supabase) {
    try {
      const [
        servicesRes,
        programmesRes,
        retreatsRes,
        publicationsRes,
        sectionsRes
      ] = await Promise.all([
        supabase.from('admin_spiritual_services').select('*'),
        supabase.from('admin_spiritual_programmes').select('*').order('display_order', { ascending: true }),
        supabase.from('admin_spiritual_retreats').select('*'),
        supabase.from('admin_spiritual_publications').select('*').order('display_order', { ascending: true }),
        supabase.from('admin_spiritual_dynamic_sections').select('*').order('display_order', { ascending: true })
      ]);

      const hasError = servicesRes.error || programmesRes.error || retreatsRes.error || publicationsRes.error || sectionsRes.error;
      
      if (!hasError) {
        const servicesData = servicesRes.data?.[0]?.content || {};
        const retreatsData = retreatsRes.data?.[0]?.content || {};

        const programmesData = (programmesRes.data || []).map(row => {
          if (row.content && typeof row.content === 'object' && Object.keys(row.content).length > 0) {
            return { ...row.content, id: row.id, title: row.title || row.content.title, slug: row.slug || row.content.slug };
          }
          return {
            id: row.id,
            title: row.title,
            slug: row.slug,
            description: row.short_description || '',
            enabled: row.status !== 'false'
          };
        });

        const publicationsData = (publicationsRes.data || []).map(row => {
          if (row.content && typeof row.content === 'object' && Object.keys(row.content).length > 0) {
            return { ...row.content, id: row.id, title: row.title || row.content.title };
          }
          return {
            id: row.id,
            title: row.title,
            authors: row.authors ? row.authors.split(',').map(s => s.trim()) : [],
            journal: row.citation || '',
            url: row.pdf_url || '',
            status: row.status || 'Published'
          };
        });

        const sectionsData = (sectionsRes.data || []).map(row => {
          if (row.content && typeof row.content === 'object' && Object.keys(row.content).length > 0) {
            return { ...row.content, id: row.id, title: row.title || row.content.title };
          }
          return {
            id: row.id,
            title: row.title,
            order: row.display_order || 1,
            enabled: row.status !== 'false'
          };
        });

        return {
          services: servicesData,
          programmes: programmesData,
          retreats: retreatsData,
          publications: publicationsData,
          sections: sectionsData
        };
      } else {
        console.warn('Supabase spiritual care fetch errors:', {
          services: servicesRes.error?.message,
          programmes: programmesRes.error?.message,
          retreats: retreatsRes.error?.message,
          publications: publicationsRes.error?.message,
          sections: sectionsRes.error?.message
        });
      }
    } catch (err) {
      console.warn('Supabase query error for spiritual care, using local fallback:', err.message);
    }
  }

  // Fallback to local JSON backup if Supabase unavailable
  const state = readData('spiritual_care_state');
  if (state && typeof state === 'object') {
    return state;
  }
  return {
    services: {},
    programmes: [],
    retreats: {},
    publications: [],
    sections: []
  };
}

/**
 * Save full spiritual care state into Supabase tables and local JSON backup
 */
async function saveFullState(state) {
  // 1. Write local backup
  try {
    writeData('spiritual_care_state', state);
  } catch (err) {
    console.warn('Warning writing local spiritual care backup:', err.message);
  }

  // 2. Sync to Supabase tables
  if (supabase) {
    try {
      const now = new Date().toISOString();

      // (a) Services
      if (state.services && typeof state.services === 'object') {
        const { error: sErr } = await supabase.from('admin_spiritual_services').upsert({
          id: 'spiritual-services',
          content: state.services,
          status: 'true',
          updated_at: now
        }, { onConflict: 'id' });
        if (sErr) console.warn('Supabase save services error:', sErr.message);
      }

      // (b) Retreats
      if (state.retreats && typeof state.retreats === 'object') {
        const { error: rErr } = await supabase.from('admin_spiritual_retreats').upsert({
          id: 'spiritual-retreats',
          title: state.retreats.hero?.title || 'Spiritual Retreats',
          retreat_type: 'holistic',
          content: state.retreats,
          display_order: 1,
          status: 'true',
          updated_at: now
        }, { onConflict: 'id' });
        if (rErr) console.warn('Supabase save retreats error:', rErr.message);
      }

      // (c) Programmes
      if (Array.isArray(state.programmes)) {
        const progUpserts = state.programmes.map((prog, index) => ({
          id: prog.id,
          title: prog.title || prog.id,
          slug: prog.slug || (prog.title ? prog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prog.id),
          short_description: prog.description || prog.shortDescription || '',
          content: prog,
          display_order: index + 1,
          status: prog.enabled !== false ? 'true' : 'false',
          updated_at: now
        }));

        if (progUpserts.length > 0) {
          const { error: pErr } = await supabase.from('admin_spiritual_programmes').upsert(progUpserts, { onConflict: 'id' });
          if (pErr) console.warn('Supabase save programmes error:', pErr.message);
        }

        // Clean up deleted programmes if any
        const progIds = state.programmes.map(p => p.id).filter(Boolean);
        const { data: allProgs } = await supabase.from('admin_spiritual_programmes').select('id');
        const toDelete = (allProgs || []).filter(p => !progIds.includes(p.id)).map(p => p.id);
        if (toDelete.length > 0) {
          await supabase.from('admin_spiritual_programmes').delete().in('id', toDelete);
        }
      }

      // (d) Publications
      if (Array.isArray(state.publications)) {
        const pubUpserts = state.publications.map((pub, index) => ({
          id: pub.id || `pub-${index + 1}`,
          title: pub.title || 'Untitled Publication',
          authors: Array.isArray(pub.authors) ? pub.authors.join(', ') : (pub.authors || ''),
          citation: pub.journal || pub.citation || '',
          pdf_url: pub.url || pub.pdf_url || '',
          content: pub,
          display_order: index + 1,
          status: pub.status || 'Published',
          updated_at: now
        }));

        if (pubUpserts.length > 0) {
          const { error: pubErr } = await supabase.from('admin_spiritual_publications').upsert(pubUpserts, { onConflict: 'id' });
          if (pubErr) console.warn('Supabase save publications error:', pubErr.message);
        }

        // Clean up deleted publications if any
        const pubIds = pubUpserts.map(p => p.id);
        if (pubIds.length > 0) {
          const { data: allPubs } = await supabase.from('admin_spiritual_publications').select('id');
          const toDelete = (allPubs || []).filter(p => !pubIds.includes(p.id)).map(p => p.id);
          if (toDelete.length > 0) {
            await supabase.from('admin_spiritual_publications').delete().in('id', toDelete);
          }
        }
      }

      // (e) Dynamic Sections
      if (Array.isArray(state.sections)) {
        const secUpserts = state.sections.map((sec, index) => ({
          id: sec.id,
          title: sec.title || sec.id,
          content: sec,
          display_order: sec.order || (index + 1),
          status: sec.enabled !== false ? 'true' : 'false',
          updated_at: now
        }));

        if (secUpserts.length > 0) {
          const { error: secErr } = await supabase.from('admin_spiritual_dynamic_sections').upsert(secUpserts, { onConflict: 'id' });
          if (secErr) console.warn('Supabase save dynamic sections error:', secErr.message);
        }

        // Clean up deleted sections if any
        const secIds = secUpserts.map(s => s.id);
        if (secIds.length > 0) {
          const { data: allSecs } = await supabase.from('admin_spiritual_dynamic_sections').select('id');
          const toDelete = (allSecs || []).filter(s => !secIds.includes(s.id)).map(s => s.id);
          if (toDelete.length > 0) {
            await supabase.from('admin_spiritual_dynamic_sections').delete().in('id', toDelete);
          }
        }
      }
    } catch (err) {
      console.error('Error syncing spiritual care to Supabase:', err.message);
    }
  }

  return state;
}

// ----------------------------------------------------
// 1. GET FULL SPIRITUAL CARE STATE
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
// 2. PUT / UPDATE FULL SPIRITUAL CARE STATE
// ----------------------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const updatedState = req.body;
    if (!updatedState || typeof updatedState !== 'object') {
      return res.status(400).json({ error: 'Invalid spiritual care state payload' });
    }

    const saved = await saveFullState(updatedState);
    res.json({
      success: true,
      message: 'Spiritual care state updated successfully',
      data: saved
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 3. POST NEW SECTION
// ----------------------------------------------------
router.post('/sections', async (req, res, next) => {
  try {
    const state = (await getCurrentState()) || { sections: [] };
    const newSection = req.body;

    if (!newSection || !newSection.title) {
      return res.status(400).json({ error: 'Section title is required' });
    }

    if (!newSection.id) {
      newSection.id = newSection.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    state.sections.push(newSection);
    await saveFullState(state);

    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      section: newSection,
      sections: state.sections
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 4. DELETE SECTION
// ----------------------------------------------------
router.delete('/sections/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = (await getCurrentState()) || { sections: [] };

    state.sections = state.sections.filter(s => s.id !== id);
    await saveFullState(state);

    res.json({
      success: true,
      message: `Section ${id} deleted successfully`,
      sections: state.sections
    });
  } catch (err) {
    next(err);
  }
});

export default router;
