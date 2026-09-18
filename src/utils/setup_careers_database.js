import pg from 'pg';
import dotenv from 'dotenv';
import { defaultCareerJobs, defaultCareerApplications } from './seeds.js';

dotenv.config();

const { Client } = pg;

async function setupCareersDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in environment variables.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to PostgreSQL database via DATABASE_URL...');
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    // 1. Create bv_career_jobs table
    console.log('Creating table bv_career_jobs...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_career_jobs (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL DEFAULT 'Consultant Vacancy',
        title TEXT NOT NULL,
        department TEXT,
        positions TEXT DEFAULT '01',
        qualification TEXT,
        experience TEXT,
        location TEXT DEFAULT 'Mira Road, Mumbai',
        status TEXT DEFAULT 'Active',
        description TEXT,
        "postedDate" TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table bv_career_jobs created or already exists.');

    // 2. Create bv_career_applications table
    console.log('Creating table bv_career_applications...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_career_applications (
        id TEXT PRIMARY KEY,
        "jobId" TEXT DEFAULT 'GENERAL',
        position TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        qualification TEXT,
        experience TEXT,
        "currentCtc" TEXT,
        "expectedCtc" TEXT,
        "noticePeriod" TEXT,
        city TEXT,
        "resumeUrl" TEXT,
        "resumeName" TEXT,
        "coverNote" TEXT,
        status TEXT DEFAULT 'New',
        "appliedDate" TEXT,
        "hrNotes" TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table bv_career_applications created or already exists.');

    // 3. Seed initial jobs if table is empty
    const checkJobs = await client.query('SELECT COUNT(*) FROM bv_career_jobs');
    const jobsCount = parseInt(checkJobs.rows[0].count, 10);
    console.log(`Current bv_career_jobs count: ${jobsCount}`);

    if (jobsCount === 0 && defaultCareerJobs && defaultCareerJobs.length > 0) {
      console.log(`Seeding ${defaultCareerJobs.length} default job vacancies into bv_career_jobs...`);
      for (const job of defaultCareerJobs) {
        await client.query(`
          INSERT INTO bv_career_jobs (
            id, category, title, department, positions, qualification, experience, location, status, description, "postedDate"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING;
        `, [
          job.id,
          job.category,
          job.title,
          job.department,
          job.positions,
          job.qualification,
          job.experience,
          job.location,
          job.status,
          job.description,
          job.postedDate
        ]);
      }
      console.log('Seeded bv_career_jobs successfully.');
    }

    // 4. Seed initial applications if table is empty
    const checkApps = await client.query('SELECT COUNT(*) FROM bv_career_applications');
    const appsCount = parseInt(checkApps.rows[0].count, 10);
    console.log(`Current bv_career_applications count: ${appsCount}`);

    if (appsCount === 0 && defaultCareerApplications && defaultCareerApplications.length > 0) {
      console.log(`Seeding ${defaultCareerApplications.length} default applications into bv_career_applications...`);
      for (const app of defaultCareerApplications) {
        await client.query(`
          INSERT INTO bv_career_applications (
            id, "jobId", position, "fullName", email, phone, qualification, experience,
            "currentCtc", "expectedCtc", "noticePeriod", city, "resumeUrl", "resumeName",
            "coverNote", status, "appliedDate", "hrNotes"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) DO NOTHING;
        `, [
          app.id,
          app.jobId,
          app.position,
          app.fullName,
          app.email,
          app.phone,
          app.qualification,
          app.experience,
          app.currentCtc,
          app.expectedCtc,
          app.noticePeriod,
          app.city,
          app.resumeUrl,
          app.resumeName,
          app.coverNote,
          app.status,
          app.appliedDate,
          app.hrNotes
        ]);
      }
      console.log('Seeded bv_career_applications successfully.');
    }

    console.log('Career database setup and verification complete!');
  } catch (err) {
    console.error('Error during database setup:', err);
  } finally {
    await client.end();
  }
}

setupCareersDatabase();
