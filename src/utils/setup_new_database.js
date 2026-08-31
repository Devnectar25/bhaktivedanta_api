import pg from 'pg';
import dotenv from 'dotenv';
import { defaultSpecialitiesState, ensureStandardTabs, defaultDoctors, defaultAppointments, defaultServicesState } from './seeds.js';

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
        "doctorName" TEXT,
        department TEXT NOT NULL,
        "dateTime" TEXT,
        payment TEXT DEFAULT 'Unpaid',
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table bv_appointments created successfully.');

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
