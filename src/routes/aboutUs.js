import express from 'express';
import { supabase } from '../utils/supabase.js';
import { query } from '../utils/pgDb.js';
import { defaultAboutUsData } from '../data/defaultAboutUsData.js';

const router = express.Router();
const BUCKET_NAME = 'hospital_about_us';
const STORAGE_BASE = 'https://ohaokdfkdafgpwccauos.supabase.co/storage/v1/object/public/hospital_about_us';

// ==========================================
// 1. COMBINED STATE ENDPOINT (GET /)
// Combines JSON static sections + live Database tables
// ==========================================
router.get('/', async (req, res, next) => {
  try {
    // 1. Fetch DB entities in parallel with safety
    const [
      historyRes,
      logoRes,
      awardsRes,
      eventsRes,
      mgmtRes,
      devsRes,
      advisorsRes,
      customSectionsRes
    ] = await Promise.all([
      query('SELECT * FROM bv_about_history ORDER BY display_order ASC, sr ASC, year ASC;').catch(() => ({ rows: [] })),
      query("SELECT * FROM bv_about_logo WHERE id = 'primary';").catch(() => ({ rows: [] })),
      query('SELECT * FROM bv_about_awards ORDER BY display_order ASC, created_at DESC;').catch(() => ({ rows: [] })),
      query('SELECT * FROM bv_about_events ORDER BY display_order ASC, created_at DESC;').catch(() => ({ rows: [] })),
      query("SELECT * FROM bv_about_management WHERE status = 'Active' ORDER BY display_order ASC, created_at ASC;").catch(() => ({ rows: [] })),
      query('SELECT * FROM bv_about_developments ORDER BY display_order ASC, created_at DESC;').catch(() => ({ rows: [] })),
      query('SELECT * FROM bv_about_spiritual_advisors ORDER BY display_order ASC, created_at ASC;').catch(() => ({ rows: [] })),
      query('SELECT * FROM bv_about_custom_sections ORDER BY display_order ASC, created_at ASC;').catch(() => ({ rows: [] }))
    ]);

    // Split events vs inTheNews
    const allEvents = eventsRes.rows || [];
    const eventsList = allEvents.filter(e => (e.category || '').toLowerCase() !== 'in the news');
    const inTheNewsList = allEvents.filter(e => (e.category || '').toLowerCase() === 'in the news');

    // Logo object
    const logoRow = logoRes.rows?.[0] || {};
    const logoData = {
      tagline: logoRow.tagline || defaultAboutUsData.logo?.tagline || '',
      hospitalLogo: logoRow.logo_url || defaultAboutUsData.logo?.hospitalLogo || '/icon.png',
      symbolismTitle: logoRow.symbolism_title || defaultAboutUsData.logo?.symbolismTitle || '',
      symbolismDescription: logoRow.symbolism_description || defaultAboutUsData.logo?.symbolismDescription || '',
      elements: logoRow.elements || defaultAboutUsData.logo?.elements || []
    };

    // Construct response
    const combinedState = {
      // JSON SECTIONS (Direct from static config / JSON)
      aboutHospital: defaultAboutUsData.aboutHospital,
      chairmansMessage: defaultAboutUsData.chairmansMessage,
      ourInspiration: defaultAboutUsData.ourInspiration,
      visionMissionValues: defaultAboutUsData.visionMissionValues,
      sriChaitanyaTrust: defaultAboutUsData.sriChaitanyaTrust,

      // DATABASE SECTIONS (Live from PostgreSQL / Supabase)
      history: historyRes.rows?.length > 0 ? historyRes.rows.map(r => ({
        id: r.id,
        sr: r.sr,
        year: r.year,
        title: r.title,
        location: r.location,
        detail: r.detail,
        imageUrl: r.image_url
      })) : (defaultAboutUsData.history || []),

      logo: logoData,

      awardsAccreditation: {
        nabhAccreditation: defaultAboutUsData.awardsAccreditation?.nabhAccreditation || {},
        awards: {
          heading: "Awards & Recognition",
          items: awardsRes.rows?.length > 0 ? awardsRes.rows.map(r => ({
            id: r.id,
            title: r.title,
            organization: r.organization,
            year: r.year,
            category: r.category,
            imageUrl: r.image_url,
            certificateUrl: r.certificate_url,
            description: r.description
          })) : (defaultAboutUsData.awardsAccreditation?.awards?.items || [])
        }
      },

      eventsAndNews: {
        events: eventsList.length > 0 ? eventsList.map(e => ({
          id: e.id,
          title: e.title,
          date: e.event_date,
          category: e.category,
          imageUrl: e.image_url,
          description: e.description,
          link: e.article_link || e.read_more_link
        })) : (defaultAboutUsData.eventsAndNews?.events || []),

        inTheNews: inTheNewsList.length > 0 ? inTheNewsList.map(n => ({
          id: n.id,
          title: n.title,
          date: n.event_date,
          imageUrl: n.image_url,
          description: n.description,
          link: n.article_link || n.read_more_link,
          pdfUrl: n.read_more_link
        })) : (defaultAboutUsData.eventsAndNews?.inTheNews || [])
      },

      managementTeam: mgmtRes.rows?.length > 0 ? mgmtRes.rows.map(m => ({
        id: m.id,
        name: m.name,
        designation: m.designation,
        qualification: m.qualification,
        photoUrl: m.photo_url,
        bio: m.bio
      })) : (defaultAboutUsData.managementTeam || []),

      newDevelopments: devsRes.rows?.length > 0 ? devsRes.rows.map(d => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        category: d.category,
        imageUrl: d.image_url,
        description: d.description,
        content: d.content,
        readMoreLink: d.read_more_link,
        date: d.published_date
      })) : (defaultAboutUsData.newDevelopments || []),

      spiritualAdvisors: advisorsRes.rows?.length > 0 ? advisorsRes.rows.map(a => ({
        id: a.id,
        name: a.name,
        title: a.title,
        designation: a.title,
        photoUrl: a.photo_url,
        message: a.message,
        bio: a.bio
      })) : (defaultAboutUsData.spiritualAdvisors || []),

      // CUSTOM DYNAMIC SECTIONS (Live from PostgreSQL bv_about_custom_sections)
      customSections: (customSectionsRes.rows || []).map(s => ({
        id: s.id,
        title: s.title,
        badge: s.badge || '',
        icon: s.icon || 'Layers',
        description: s.description || '',
        bannerImage: s.banner_image || '',
        content: s.content || '',
        items: Array.isArray(s.items) ? s.items : (typeof s.items === 'string' ? JSON.parse(s.items) : []),
        displayOrder: s.display_order || 0
      }))
    };

    return res.json(combinedState);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 2. IMAGE UPLOAD TO hospital_about_us BUCKET
// POST /api/about-us/upload
// ==========================================
router.post('/upload', async (req, res, next) => {
  try {
    const { base64, fileName, folder = 'general', contentType = 'image/png' } = req.body;
    if (!base64 || !fileName) {
      return res.status(400).json({ error: 'base64 data and fileName are required' });
    }

    const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const storagePath = `${folder}/${safeName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const publicUrl = `${STORAGE_BASE}/${encodeURIComponent(storagePath)}`;
    return res.json({ success: true, url: publicUrl, path: storagePath });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 3. HISTORY TIMELINE CRUD
// ==========================================
router.get('/history', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM bv_about_history ORDER BY display_order ASC, sr ASC, year ASC;');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/history', async (req, res, next) => {
  try {
    const { year, title, location, detail, imageUrl, displayOrder } = req.body;
    const id = `hist-${year || Date.now()}-${Date.now()}`;
    const result = await query(
      `INSERT INTO bv_about_history (id, year, title, location, detail, image_url, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [id, year, title, location || '', detail || '', imageUrl || '', displayOrder || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/history/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { year, title, location, detail, imageUrl, displayOrder } = req.body;
    const result = await query(
      `UPDATE bv_about_history
       SET year = COALESCE($1, year),
           title = COALESCE($2, title),
           location = COALESCE($3, location),
           detail = COALESCE($4, detail),
           image_url = COALESCE($5, image_url),
           display_order = COALESCE($6, display_order),
           updated_at = NOW()
       WHERE id = $7 RETURNING *;`,
      [year, title, location, detail, imageUrl, displayOrder, id]
    );
    res.json(result.rows[0] || { message: 'Updated' });
  } catch (err) { next(err); }
});

router.delete('/history/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bv_about_history WHERE id = $1;', [id]);
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

// ==========================================
// 4. HOSPITAL LOGO CRUD
// ==========================================
router.get('/logo', async (req, res, next) => {
  try {
    const result = await query("SELECT * FROM bv_about_logo WHERE id = 'primary';");
    res.json(result.rows[0] || {});
  } catch (err) { next(err); }
});

router.put('/logo', async (req, res, next) => {
  try {
    const { logoUrl, tagline, symbolismTitle, symbolismDescription, elements } = req.body;
    const result = await query(
      `INSERT INTO bv_about_logo (id, logo_url, tagline, symbolism_title, symbolism_description, elements, updated_at)
       VALUES ('primary', $1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id) DO UPDATE
       SET logo_url = COALESCE($1, bv_about_logo.logo_url),
           tagline = COALESCE($2, bv_about_logo.tagline),
           symbolism_title = COALESCE($3, bv_about_logo.symbolism_title),
           symbolism_description = COALESCE($4, bv_about_logo.symbolism_description),
           elements = COALESCE($5, bv_about_logo.elements),
           updated_at = NOW()
       RETURNING *;`,
      [logoUrl, tagline, symbolismTitle, symbolismDescription, JSON.stringify(elements || [])]
    );
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// ==========================================
// 5. AWARDS & ACCREDITATION CRUD
// ==========================================
router.get('/awards', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM bv_about_awards ORDER BY display_order ASC, created_at DESC;');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/awards', async (req, res, next) => {
  try {
    const { title, organization, year, category, imageUrl, certificateUrl, description, displayOrder } = req.body;
    const id = `award-${Date.now()}`;
    const result = await query(
      `INSERT INTO bv_about_awards (id, title, organization, year, category, image_url, certificate_url, description, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [id, title, organization || '', year || '', category || 'Award', imageUrl || '', certificateUrl || '', description || '', displayOrder || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/awards/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, organization, year, category, imageUrl, certificateUrl, description, displayOrder } = req.body;
    const result = await query(
      `UPDATE bv_about_awards
       SET title = COALESCE($1, title),
           organization = COALESCE($2, organization),
           year = COALESCE($3, year),
           category = COALESCE($4, category),
           image_url = COALESCE($5, image_url),
           certificate_url = COALESCE($6, certificate_url),
           description = COALESCE($7, description),
           display_order = COALESCE($8, display_order),
           updated_at = NOW()
       WHERE id = $9 RETURNING *;`,
      [title, organization, year, category, imageUrl, certificateUrl, description, displayOrder, id]
    );
    res.json(result.rows[0] || { message: 'Updated' });
  } catch (err) { next(err); }
});

router.delete('/awards/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bv_about_awards WHERE id = $1;', [id]);
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

// ==========================================
// 6. EVENTS & HOSPITAL IN NEWS CRUD
// ==========================================
router.get('/events', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM bv_about_events ORDER BY display_order ASC, created_at DESC;');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/events', async (req, res, next) => {
  try {
    const { title, eventDate, category, imageUrl, description, articleLink, readMoreLink, displayOrder } = req.body;
    const id = `event-${Date.now()}`;
    const result = await query(
      `INSERT INTO bv_about_events (id, title, event_date, category, image_url, description, article_link, read_more_link, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [id, title, eventDate || '', category || 'Event', imageUrl || '', description || '', articleLink || '', readMoreLink || '', displayOrder || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/events/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, eventDate, category, imageUrl, description, articleLink, readMoreLink, displayOrder } = req.body;
    const result = await query(
      `UPDATE bv_about_events
       SET title = COALESCE($1, title),
           event_date = COALESCE($2, event_date),
           category = COALESCE($3, category),
           image_url = COALESCE($4, image_url),
           description = COALESCE($5, description),
           article_link = COALESCE($6, article_link),
           read_more_link = COALESCE($7, read_more_link),
           display_order = COALESCE($8, display_order),
           updated_at = NOW()
       WHERE id = $9 RETURNING *;`,
      [title, eventDate, category, imageUrl, description, articleLink, readMoreLink, displayOrder, id]
    );
    res.json(result.rows[0] || { message: 'Updated' });
  } catch (err) { next(err); }
});

router.delete('/events/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bv_about_events WHERE id = $1;', [id]);
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

// ==========================================
// 7. OUR MANAGEMENT TEAM CRUD
// ==========================================
router.get('/management', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM bv_about_management ORDER BY display_order ASC, created_at ASC;');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/management', async (req, res, next) => {
  try {
    const { name, designation, qualification, photoUrl, bio, status, displayOrder } = req.body;
    const id = `mgmt-${Date.now()}`;
    const result = await query(
      `INSERT INTO bv_about_management (id, name, designation, qualification, photo_url, bio, status, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [id, name, designation, qualification || '', photoUrl || '', bio || '', status || 'Active', displayOrder || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/management/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, designation, qualification, photoUrl, bio, status, displayOrder } = req.body;
    const result = await query(
      `UPDATE bv_about_management
       SET name = COALESCE($1, name),
           designation = COALESCE($2, designation),
           qualification = COALESCE($3, qualification),
           photo_url = COALESCE($4, photo_url),
           bio = COALESCE($5, bio),
           status = COALESCE($6, status),
           display_order = COALESCE($7, display_order),
           updated_at = NOW()
       WHERE id = $8 RETURNING *;`,
      [name, designation, qualification, photoUrl, bio, status, displayOrder, id]
    );
    res.json(result.rows[0] || { message: 'Updated' });
  } catch (err) { next(err); }
});

router.delete('/management/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bv_about_management WHERE id = $1;', [id]);
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

// ==========================================
// 8. NEW DEVELOPMENTS CRUD
// ==========================================
router.get('/developments', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM bv_about_developments ORDER BY display_order ASC, created_at DESC;');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/developments', async (req, res, next) => {
  try {
    const { title, slug, category, imageUrl, description, content, readMoreLink, publishedDate, displayOrder } = req.body;
    const id = `dev-${Date.now()}`;
    const cleanSlug = slug || `dev-${Date.now()}`;
    const result = await query(
      `INSERT INTO bv_about_developments (id, title, slug, category, image_url, description, content, read_more_link, published_date, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [id, title, cleanSlug, category || 'Clinical Update', imageUrl || '', description || '', content || description || '', readMoreLink || '', publishedDate || '', displayOrder || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/developments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, category, imageUrl, description, content, readMoreLink, publishedDate, displayOrder } = req.body;
    const result = await query(
      `UPDATE bv_about_developments
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           category = COALESCE($3, category),
           image_url = COALESCE($4, image_url),
           description = COALESCE($5, description),
           content = COALESCE($6, content),
           read_more_link = COALESCE($7, read_more_link),
           published_date = COALESCE($8, published_date),
           display_order = COALESCE($9, display_order),
           updated_at = NOW()
       WHERE id = $10 RETURNING *;`,
      [title, slug, category, imageUrl, description, content, readMoreLink, publishedDate, displayOrder, id]
    );
    res.json(result.rows[0] || { message: 'Updated' });
  } catch (err) { next(err); }
});

router.delete('/developments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bv_about_developments WHERE id = $1;', [id]);
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

// ==========================================
// 9. OUR SPIRITUAL ADVISORS CRUD
// ==========================================
router.get('/spiritual-advisors', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM bv_about_spiritual_advisors ORDER BY display_order ASC, created_at ASC;');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/spiritual-advisors', async (req, res, next) => {
  try {
    const { name, title, photoUrl, message, bio, displayOrder } = req.body;
    const id = `advisor-${Date.now()}`;
    const result = await query(
      `INSERT INTO bv_about_spiritual_advisors (id, name, title, photo_url, message, bio, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [id, name, title || '', photoUrl || '', message || '', bio || message || '', displayOrder || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/spiritual-advisors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, title, photoUrl, message, bio, displayOrder } = req.body;
    const result = await query(
      `UPDATE bv_about_spiritual_advisors
       SET name = COALESCE($1, name),
           title = COALESCE($2, title),
           photo_url = COALESCE($3, photo_url),
           message = COALESCE($4, message),
           bio = COALESCE($5, bio),
           display_order = COALESCE($6, display_order),
           updated_at = NOW()
       WHERE id = $7 RETURNING *;`,
      [name, title, photoUrl, message, bio, displayOrder, id]
    );
    res.json(result.rows[0] || { message: 'Updated' });
  } catch (err) { next(err); }
});

router.delete('/spiritual-advisors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bv_about_spiritual_advisors WHERE id = $1;', [id]);
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

// ==========================================
// 10. CUSTOM DYNAMIC SECTIONS CRUD
// ==========================================
router.get('/custom-sections', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM bv_about_custom_sections ORDER BY display_order ASC, created_at ASC;');
    const sections = (result.rows || []).map(s => ({
      id: s.id,
      title: s.title,
      badge: s.badge || '',
      icon: s.icon || 'Layers',
      description: s.description || '',
      bannerImage: s.banner_image || '',
      content: s.content || '',
      items: Array.isArray(s.items) ? s.items : (typeof s.items === 'string' ? JSON.parse(s.items) : []),
      displayOrder: s.display_order || 0
    }));
    res.json(sections);
  } catch (err) { next(err); }
});

router.post('/custom-sections', async (req, res, next) => {
  try {
    const MAX_CUSTOM_SECTIONS = 2; // 8 Core sections + 2 Custom sections = 10 Total Sections
    const { id, title, badge, icon, description, bannerImage, content, items, displayOrder } = req.body;
    const secId = id || `custom_${Date.now()}`;
    const cleanItems = Array.isArray(items) ? items : [];

    // Check if section already exists (if updating via POST, allow it)
    const existing = await query(`SELECT id FROM bv_about_custom_sections WHERE id = $1;`, [secId]).catch(() => ({ rows: [] }));
    if (!existing.rows || existing.rows.length === 0) {
      // It's a new section - verify slot limit of 10 total sections (8 core + 2 custom)
      const countRes = await query(`SELECT COUNT(*) as total FROM bv_about_custom_sections;`).catch(() => ({ rows: [{ total: 0 }] }));
      const total = parseInt(countRes.rows[0]?.total || 0, 10);
      if (total >= MAX_CUSTOM_SECTIONS) {
        return res.status(400).json({
          error: `The About Us section allows up to 10 sections in total (8 core sections + 2 custom sections). All 10 slots are completed. No additional sections can be added.`
        });
      }
    }

    const result = await query(
      `INSERT INTO bv_about_custom_sections (id, title, badge, icon, description, banner_image, content, items, display_order, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE
       SET title = EXCLUDED.title,
           badge = EXCLUDED.badge,
           icon = EXCLUDED.icon,
           description = EXCLUDED.description,
           banner_image = EXCLUDED.banner_image,
           content = EXCLUDED.content,
           items = EXCLUDED.items,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
       RETURNING *;`,
      [secId, title, badge || '', icon || 'Layers', description || '', bannerImage || '', content || '', JSON.stringify(cleanItems), displayOrder || 0]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      title: row.title,
      badge: row.badge,
      icon: row.icon,
      description: row.description,
      bannerImage: row.banner_image,
      content: row.content,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
      displayOrder: row.display_order
    });
  } catch (err) { next(err); }
});

router.put('/custom-sections/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, badge, icon, description, bannerImage, content, items, displayOrder } = req.body;
    const cleanItems = items !== undefined ? (Array.isArray(items) ? items : []) : undefined;
    const result = await query(
      `UPDATE bv_about_custom_sections
       SET title = COALESCE($1, title),
           badge = COALESCE($2, badge),
           icon = COALESCE($3, icon),
           description = COALESCE($4, description),
           banner_image = COALESCE($5, banner_image),
           content = COALESCE($6, content),
           items = CASE WHEN $7::jsonb IS NOT NULL THEN $7::jsonb ELSE items END,
           display_order = COALESCE($8, display_order),
           updated_at = NOW()
       WHERE id = $9 RETURNING *;`,
      [title, badge, icon, description, bannerImage, content, cleanItems !== undefined ? JSON.stringify(cleanItems) : null, displayOrder, id]
    );
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({
      id: row.id,
      title: row.title,
      badge: row.badge,
      icon: row.icon,
      description: row.description,
      bannerImage: row.banner_image,
      content: row.content,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
      displayOrder: row.display_order
    });
  } catch (err) { next(err); }
});

router.delete('/custom-sections/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bv_about_custom_sections WHERE id = $1;', [id]);
    res.json({ success: true, id });
  } catch (err) { next(err); }
});

// Bulk sync / save custom sections
router.put('/', async (req, res, next) => {
  try {
    const { customSections } = req.body;
    if (Array.isArray(customSections)) {
      const MAX_CUSTOM_SECTIONS = 2; // 8 Core + 2 Custom = 10 Total
      const validSections = customSections.slice(0, MAX_CUSTOM_SECTIONS);
      for (let i = 0; i < validSections.length; i++) {
        const sec = validSections[i];
        if (!sec.id || !sec.title) continue;
        await query(
          `INSERT INTO bv_about_custom_sections (id, title, badge, icon, description, banner_image, content, items, display_order, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
           ON CONFLICT (id) DO UPDATE
           SET title = EXCLUDED.title,
               badge = EXCLUDED.badge,
               icon = EXCLUDED.icon,
               description = EXCLUDED.description,
               banner_image = EXCLUDED.banner_image,
               content = EXCLUDED.content,
               items = EXCLUDED.items,
               display_order = EXCLUDED.display_order,
               updated_at = NOW();`,
          [sec.id, sec.title, sec.badge || '', sec.icon || 'Layers', sec.description || '', sec.bannerImage || '', sec.content || '', JSON.stringify(sec.items || []), i]
        );
      }
    }
    res.json({ success: true, message: 'About Us state synced successfully' });
  } catch (err) { next(err); }
});

export default router;
