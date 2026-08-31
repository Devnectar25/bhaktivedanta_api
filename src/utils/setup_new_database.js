import pg from 'pg';
import dotenv from 'dotenv';
import { 
  defaultSpecialitiesState, ensureStandardTabs, defaultDoctors, defaultAppointments, 
  defaultServicesState, defaultTestimonials, defaultEvents, defaultNews, 
  defaultGallery, defaultQueries, defaultSubAdmins, defaultHelpDesk 
} from './seeds.js';

dotenv.config();

const { Client } = pg;

async function setup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to new database via pg client.');

    // Create table bv_service_categories
    console.log('Creating table bv_service_categories...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_service_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        "order" INTEGER DEFAULT 1,
        status BOOLEAN DEFAULT true,
        "adminId" TEXT DEFAULT 'ADM-001',
        "adminName" TEXT DEFAULT 'Super Administrator',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table bv_service_categories created successfully.');

    // Create table admin_services
    console.log('Creating table admin_services...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_services (
        id VARCHAR PRIMARY KEY,
        service_name VARCHAR NOT NULL,
        icon VARCHAR,
        short_description TEXT,
        banner_image TEXT,
        thumbnail_image TEXT,
        slug VARCHAR,
        status VARCHAR,
        category_id VARCHAR NOT NULL,
        category_name VARCHAR NOT NULL,
        category_description TEXT,
        category_order INTEGER,
        category_status BOOLEAN DEFAULT true,
        tabs_data JSONB,
        admin_id VARCHAR NOT NULL DEFAULT 'ADM-001',
        admin_name VARCHAR DEFAULT 'Super Administrator',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table admin_services created successfully.');

    // 1. Create table admin_specialities if not exists
    console.log('Creating table admin_specialities...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_specialities (
        id VARCHAR PRIMARY KEY,
        speciality_name VARCHAR NOT NULL,
        icon VARCHAR,
        short_description TEXT,
        banner_image TEXT,
        thumbnail_image TEXT,
        status VARCHAR,
        category_id VARCHAR NOT NULL,
        category_name VARCHAR NOT NULL,
        category_description TEXT,
        category_order INTEGER,
        category_status BOOLEAN DEFAULT true,
        tabs_data JSONB,
        admin_id VARCHAR NOT NULL DEFAULT 'ADM-001',
        admin_name VARCHAR DEFAULT 'Super Administrator',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table admin_specialities created successfully.');

    // 2. Create table bv_doctors if not exists
    console.log('Creating table bv_doctors...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_doctors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        qualifications TEXT NOT NULL,
        department TEXT NOT NULL,
        "subSpeciality" TEXT,
        experience TEXT NOT NULL,
        availability TEXT,
        featured TEXT,
        status TEXT,
        image TEXT
      );
    `);
    console.log('Table bv_doctors created successfully.');

    // 3. Create table bv_appointments if not exists
    console.log('Creating table bv_appointments...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_appointments (
        id TEXT PRIMARY KEY,
        "patientName" TEXT NOT NULL,
        "patientPhone" TEXT NOT NULL,
        department TEXT NOT NULL,
        "dateTime" TEXT,
        payment TEXT DEFAULT 'Unpaid',
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table bv_appointments created successfully.');

    // Ensure all columns exist and drop doctorName column
    console.log('Ensuring all columns exist in bv_appointments and dropping doctorName...');
    await client.query(`
      ALTER TABLE bv_appointments DROP COLUMN IF EXISTS "doctorName";
      ALTER TABLE bv_appointments ADD COLUMN IF NOT EXISTS payment TEXT DEFAULT 'Unpaid';
      ALTER TABLE bv_appointments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';
      ALTER TABLE bv_appointments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
    `);
    console.log('Columns in bv_appointments verified.');

    // 4. Create table bv_categories if not exists
    console.log('Creating table bv_categories...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        "order" INTEGER DEFAULT 1,
        status BOOLEAN DEFAULT true,
        "adminId" TEXT DEFAULT 'ADM-001',
        "adminName" TEXT DEFAULT 'Super Administrator',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table bv_categories created successfully.');

    // Create table bv_queries
    console.log('Creating table bv_queries...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_queries (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        date TEXT,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create table bv_testimonials
    console.log('Creating table bv_testimonials...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_testimonials (
        id TEXT PRIMARY KEY,
        "patientName" TEXT NOT NULL,
        disease TEXT,
        content TEXT,
        rating INTEGER DEFAULT 5,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create table bv_events
    console.log('Creating table bv_events...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT,
        "time" TEXT,
        location TEXT,
        description TEXT,
        image TEXT,
        status TEXT DEFAULT 'Upcoming',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create table bv_gallery
    console.log('Creating table bv_gallery...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_gallery (
        id TEXT PRIMARY KEY,
        title TEXT,
        type TEXT DEFAULT 'Image',
        url TEXT NOT NULL,
        category TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create table bv_news
    console.log('Creating table bv_news...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        date TEXT,
        image TEXT,
        author TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create table bv_helpdesk
    console.log('Creating table bv_helpdesk...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_helpdesk (
        id TEXT PRIMARY KEY,
        "ticketSubject" TEXT NOT NULL,
        "ticketDescription" TEXT,
        "submittedBy" TEXT,
        "submittedEmail" TEXT,
        status TEXT DEFAULT 'Open',
        priority TEXT DEFAULT 'Medium',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create table bv_subadmins
    console.log('Creating table bv_subadmins...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_subadmins (
        username TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        role TEXT DEFAULT 'Administration',
        status TEXT DEFAULT 'Active',
        created TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      ALTER TABLE bv_subadmins ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Administration';
      ALTER TABLE bv_subadmins ADD COLUMN IF NOT EXISTS created TEXT;
    `);
    console.log('Table bv_subadmins verified.');

    // Create table bv_app_errors
    console.log('Creating table bv_app_errors...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_app_errors (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        level TEXT DEFAULT 'Error',
        source TEXT DEFAULT 'Client Web App',
        message TEXT,
        endpoint TEXT,
        status TEXT DEFAULT 'Investigating',
        details TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      ALTER TABLE bv_app_errors ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Error';
      ALTER TABLE bv_app_errors ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Client Web App';
      ALTER TABLE bv_app_errors ADD COLUMN IF NOT EXISTS endpoint TEXT;
      ALTER TABLE bv_app_errors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Investigating';
      ALTER TABLE bv_app_errors ADD COLUMN IF NOT EXISTS details TEXT;
    `);
    console.log('Table bv_app_errors verified.');

    // 4. Prepare specialities data
    const rawState = JSON.parse(JSON.stringify(defaultSpecialitiesState));
    rawState.specialities.forEach(ensureStandardTabs);

    const categoriesMap = {};
    (rawState.categories || []).forEach(cat => {
      categoriesMap[cat.id] = cat;
    });

    console.log(`Inserting ${rawState.specialities.length} specialities into admin_specialities table...`);
    for (const spec of rawState.specialities) {
      const cat = categoriesMap[spec.categoryId] || {};
      const query = `
        INSERT INTO admin_specialities (
          id, speciality_name, icon, short_description, banner_image, thumbnail_image,
          status, category_id, category_name, category_description, category_order,
          category_status, tabs_data, admin_id, admin_name, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
        ON CONFLICT (id) DO UPDATE SET
          speciality_name = EXCLUDED.speciality_name,
          icon = EXCLUDED.icon,
          short_description = EXCLUDED.short_description,
          banner_image = EXCLUDED.banner_image,
          thumbnail_image = EXCLUDED.thumbnail_image,
          status = EXCLUDED.status,
          category_id = EXCLUDED.category_id,
          category_name = EXCLUDED.category_name,
          category_description = EXCLUDED.category_description,
          category_order = EXCLUDED.category_order,
          category_status = EXCLUDED.category_status,
          tabs_data = EXCLUDED.tabs_data,
          updated_at = NOW();
      `;

      const values = [
        spec.id,
        spec.name,
        spec.icon || 'star',
        spec.shortDescription || `Comprehensive ${spec.name} clinical care services at Bhaktivedanta Hospital.`,
        spec.bannerImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
        spec.thumbnailImage || 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop',
        spec.status ? 'Live' : 'Hidden',
        spec.categoryId,
        cat.name || 'Unassigned',
        cat.description || '',
        cat.order || 1,
        cat.status !== false,
        JSON.stringify(spec.tabs || []),
        spec.adminId || 'ADM-001',
        spec.adminName || 'Super Administrator',
        spec.createdAt || new Date().toISOString(),
        spec.updatedAt || new Date().toISOString()
      ];

      await client.query(query, values);
    }
    console.log('Successfully inserted all specialities into admin_specialities table!');

    // 5. Seed Doctors if table is empty
    const docCheck = await client.query('SELECT COUNT(*) FROM bv_doctors');
    if (parseInt(docCheck.rows[0].count, 10) === 0) {
      console.log('Seeding doctors into bv_doctors table...');
      for (const d of defaultDoctors) {
        await client.query(`
          INSERT INTO bv_doctors (id, name, qualifications, department, "subSpeciality", experience, availability, featured, status, image)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING;
        `, [
          d.id, d.name, d.qualifications, d.department, d.subSpeciality || '',
          d.experience, d.availability || 'Available', d.featured || 'No',
          d.status || 'Active', d.image || ''
        ]);
      }
      console.log('Successfully seeded doctors into bv_doctors table!');
    }

    // 7. Seed Categories
    console.log('Seeding categories into bv_categories table...');
    for (const cat of (rawState.categories || [])) {
      await client.query(`
        INSERT INTO bv_categories (id, name, description, "order", status, "adminId", "adminName", created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          "order" = EXCLUDED."order",
          status = EXCLUDED.status,
          "adminId" = EXCLUDED."adminId",
          "adminName" = EXCLUDED."adminName",
          updated_at = NOW();
      `, [
        cat.id, cat.name, cat.description || '', cat.order || 1,
        cat.status !== false, cat.adminId || 'ADM-001',
        cat.adminName || 'Super Administrator',
        cat.createdAt || new Date().toISOString(),
        cat.updatedAt || new Date().toISOString()
      ]);
    }
    console.log('Successfully seeded categories into bv_categories table!');

    // 8. Seed Service Categories
    console.log('Seeding service categories into bv_service_categories table...');
    const servicesState = JSON.parse(JSON.stringify(defaultServicesState));
    const serviceCatsMap = {};
    for (const cat of (servicesState.categories || [])) {
      serviceCatsMap[cat.id] = cat;
      await client.query(`
        INSERT INTO bv_service_categories (id, name, description, "order", status, "adminId", "adminName", created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          "order" = EXCLUDED."order",
          status = EXCLUDED.status,
          "adminId" = EXCLUDED."adminId",
          "adminName" = EXCLUDED."adminName",
          updated_at = NOW();
      `, [
        cat.id, cat.name, cat.description || '', cat.order || 1,
        cat.status !== false, cat.adminId || 'ADM-001',
        cat.adminName || 'Super Administrator',
        cat.createdAt || new Date().toISOString(),
        cat.updatedAt || new Date().toISOString()
      ]);
    }
    console.log('Successfully seeded service categories into bv_service_categories table!');

    // 9. Seed Services
    console.log('Seeding services into admin_services table...');
    for (const srv of (servicesState.services || [])) {
      const cat = serviceCatsMap[srv.categoryId] || {};
      await client.query(`
        INSERT INTO admin_services (
          id, service_name, icon, short_description, banner_image, thumbnail_image, slug,
          status, category_id, category_name, category_description, category_order,
          category_status, tabs_data, admin_id, admin_name, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        ON CONFLICT (id) DO UPDATE SET
          service_name = EXCLUDED.service_name,
          icon = EXCLUDED.icon,
          short_description = EXCLUDED.short_description,
          banner_image = EXCLUDED.banner_image,
          thumbnail_image = EXCLUDED.thumbnail_image,
          slug = EXCLUDED.slug,
          status = EXCLUDED.status,
          category_id = EXCLUDED.category_id,
          category_name = EXCLUDED.category_name,
          category_description = EXCLUDED.category_description,
          category_order = EXCLUDED.category_order,
          category_status = EXCLUDED.category_status,
          tabs_data = EXCLUDED.tabs_data,
          updated_at = NOW();
      `, [
        srv.id,
        srv.name,
        srv.icon || 'medical_services',
        srv.shortDescription || '',
        srv.bannerImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
        srv.thumbnailImage || 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop',
        srv.slug || `/${srv.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        srv.status ? 'Active' : 'Draft',
        srv.categoryId,
        cat.name || 'Unassigned',
        cat.description || '',
        cat.order || 1,
        cat.status !== false,
        JSON.stringify(srv.tabs || []),
        srv.adminId || 'ADM-001',
        srv.adminName || 'Super Administrator',
        srv.createdAt || new Date().toISOString(),
        srv.updatedAt || new Date().toISOString()
      ]);
    }
    console.log('Successfully seeded services into admin_services table!');

    // Seed Appointments if empty
    const aptCheck = await client.query('SELECT COUNT(*) FROM bv_appointments');
    if (parseInt(aptCheck.rows[0].count, 10) === 0) {
      console.log('Seeding appointments into bv_appointments table...');
      for (const a of defaultAppointments) {
        await client.query(`
          INSERT INTO bv_appointments (id, "patientName", "patientPhone", department, "dateTime", payment, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING;
        `, [
          a.id, a.patientName || a.name || '', a.patientPhone || a.phone || '', 
          a.department || 'General Medicine', 
          a.dateTime || a.preferredDate || '', a.payment || 'Unpaid', a.status || 'Pending'
        ]);
      }
      console.log('Successfully seeded appointments into bv_appointments table!');
    }

    // Seed Testimonials if empty
    const testCheck = await client.query('SELECT COUNT(*) FROM bv_testimonials');
    if (parseInt(testCheck.rows[0].count, 10) === 0) {
      console.log('Seeding testimonials into bv_testimonials table...');
      for (const t of defaultTestimonials) {
        await client.query(`
          INSERT INTO bv_testimonials (id, "patientName", disease, content, rating, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING;
        `, [t.id, t.patientName || '', t.disease || '', t.content || '', t.rating || 5, t.status || 'Approved']);
      }
      console.log('Successfully seeded testimonials into bv_testimonials table!');
    }

    // Seed Events if empty
    const evtCheck = await client.query('SELECT COUNT(*) FROM bv_events');
    if (parseInt(evtCheck.rows[0].count, 10) === 0) {
      console.log('Seeding events into bv_events table...');
      for (const e of defaultEvents) {
        await client.query(`
          INSERT INTO bv_events (id, title, date, "time", location, description, image, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [e.id, e.title, e.date || '', e.time || '', e.location || '', e.description || '', e.image || '', e.status || 'Upcoming']);
      }
      console.log('Successfully seeded events into bv_events table!');
    }

    // Seed Gallery if empty
    const galCheck = await client.query('SELECT COUNT(*) FROM bv_gallery');
    if (parseInt(galCheck.rows[0].count, 10) === 0) {
      console.log('Seeding gallery into bv_gallery table...');
      for (const g of defaultGallery) {
        await client.query(`
          INSERT INTO bv_gallery (id, title, type, url, category)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING;
        `, [g.id, g.title || '', g.type || 'Image', g.url || '', g.category || 'Hospital']);
      }
      console.log('Successfully seeded gallery into bv_gallery table!');
    }

    // Seed News if empty
    const newsCheck = await client.query('SELECT COUNT(*) FROM bv_news');
    if (parseInt(newsCheck.rows[0].count, 10) === 0) {
      console.log('Seeding news into bv_news table...');
      for (const n of defaultNews) {
        await client.query(`
          INSERT INTO bv_news (id, title, summary, content, date, image, author)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING;
        `, [n.id, n.title || '', n.summary || '', n.content || '', n.date || '', n.image || '', n.author || 'Admin']);
      }
      console.log('Successfully seeded news into bv_news table!');
    }

    // Seed Helpdesk if empty
    const hdCheck = await client.query('SELECT COUNT(*) FROM bv_helpdesk');
    if (parseInt(hdCheck.rows[0].count, 10) === 0) {
      console.log('Seeding tickets into bv_helpdesk table...');
      for (const h of defaultHelpDesk) {
        await client.query(`
          INSERT INTO bv_helpdesk (id, "ticketSubject", "ticketDescription", "submittedBy", "submittedEmail", status, priority)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING;
        `, [h.id, h.ticketSubject || '', h.ticketDescription || '', h.submittedBy || '', h.submittedEmail || '', h.status || 'Open', h.priority || 'Medium']);
      }
      console.log('Successfully seeded tickets into bv_helpdesk table!');
    }

    // Seed Subadmins if empty
    const subCheck = await client.query('SELECT COUNT(*) FROM bv_subadmins');
    if (parseInt(subCheck.rows[0].count, 10) === 0) {
      console.log('Seeding subadmins into bv_subadmins table...');
      for (const s of defaultSubAdmins) {
        await client.query(`
          INSERT INTO bv_subadmins (username, name, email, status)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (username) DO NOTHING;
        `, [s.username, s.name || '', s.email || '', s.status || 'Active']);
      }
      console.log('Successfully seeded subadmins into bv_subadmins table!');
    }

    // Seed Queries if empty
    const qCheck = await client.query('SELECT COUNT(*) FROM bv_queries');
    if (parseInt(qCheck.rows[0].count, 10) === 0) {
      console.log('Seeding queries into bv_queries table...');
      for (const q of defaultQueries) {
        await client.query(`
          INSERT INTO bv_queries (id, name, email, subject, message, date, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING;
        `, [q.id, q.name || '', q.email || '', q.subject || '', q.message || '', q.date || '', q.status || 'Pending']);
      }
      console.log('Successfully seeded queries into bv_queries table!');
    }

    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('Final public tables in new database:');
    console.table(tablesRes.rows);

    const specCount = await client.query('SELECT COUNT(*) FROM admin_specialities');
    console.log('Total specialities count in DB:', specCount.rows[0].count);

  } catch (err) {
    console.error('Error during database setup:', err);
  } finally {
    await client.end();
  }
}

setup();
