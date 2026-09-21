import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL Database (Supabase)...');

    // 1. Unified state table for Education & Medical Research
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_education_research_state (
        id VARCHAR(50) PRIMARY KEY,
        state_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created table: bv_education_research_state');

    // 2. Dynamic Education Programs table (allows admin to create ANY new education course/program)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_education_programs (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) DEFAULT 'Academic Program',
        badge VARCHAR(100) DEFAULT 'Accredited',
        duration VARCHAR(100),
        seats INTEGER DEFAULT 0,
        eligibility TEXT,
        overview TEXT,
        curriculum JSONB DEFAULT '[]'::jsonb,
        faculties JSONB DEFAULT '[]'::jsonb,
        highlights JSONB DEFAULT '[]'::jsonb,
        contact_info JSONB DEFAULT '{}'::jsonb,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created table: admin_education_programs');

    // 3. Education Candidate Inquiries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bv_education_inquiries (
        id VARCHAR(100) PRIMARY KEY,
        candidate_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        program_name VARCHAR(255),
        neet_score VARCHAR(50),
        message TEXT,
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created table: bv_education_inquiries');

    console.log('ALL TABLES CREATED SUCCESSFULLY IN POSTGRESQL DATABASE!');
  } finally {
    client.release();
    await pool.end();
  }
}

initDb().catch(console.error);
