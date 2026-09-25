/**
 * setup_about_us.js
 * ─────────────────────────────────────────────────────────
 * ONE-TIME setup script for the About Us single table.
 *
 * What it does:
 *   1. Connects to Supabase Postgres via DATABASE_URL
 *   2. Creates table bv_about_us (with all required columns)
 *   3. Enables RLS + policies
 *   4. Migrates existing data from admin_about_us (if present)
 *   5. Seeds any missing sections with default data
 *
 * Usage:
 *   node scripts/setup_about_us.js
 * ─────────────────────────────────────────────────────────
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const { Client } = pg;

// ── Default data for seeding missing sections ──────────────
const DEFAULT_SECTIONS = [
  {
    id: 'about_hospital',
    section_name: 'About Hospital',
    section_type: 'object',
    display_order: 1,
    state_data: {
      title: 'Bhaktivedanta Hospital & Research Institute',
      tagline: 'Healing Through Devotion & Science',
      badge: 'NABH Accredited Tertiary Care Hospital',
      heroIntro: 'Bhaktivedanta Hospital & Research Institute is a multi-speciality tertiary care hospital located in Mira Road.',
      descriptionParagraphs: ['The Hospital is committed to establishing necessary facilities of international standards.'],
      features: [],
      stats: [
        { label: 'Beds Capacity', value: '300+' },
        { label: 'Consultant Specialists', value: '150+' },
        { label: 'Years of Service', value: '25+' }
      ]
    }
  },
  {
    id: 'vision_mission',
    section_name: 'Vision, Mission & Values',
    section_type: 'object',
    display_order: 2,
    state_data: {
      title: 'Vision, Mission & Values',
      vision: { title: 'Our Vision', description: 'To be a leading healthcare institution.' },
      mission: { title: 'Our Mission', description: 'To provide compassionate, affordable healthcare.' },
      values: [],
      qualityPolicy: { title: 'Quality Policy', description: '' }
    }
  },
  {
    id: 'history',
    section_name: 'History of Hospital',
    section_type: 'array',
    display_order: 3,
    state_data: [
      { sr: 1, year: '1986', title: 'Initiated Outreach Camps', location: 'Thane District, Maharashtra', detail: 'First medical camps for underprivileged populations.' },
      { sr: 2, year: '1992', title: 'Outreach Camps Expansion', location: 'Barsana, Uttar Pradesh', detail: 'Extended free medical camps to rural Braj region.' }
    ]
  },
  {
    id: 'chairman',
    section_name: "Chairman's Message",
    section_type: 'object',
    display_order: 4,
    state_data: {
      name: 'Mr. Hrishikesh A. Mafatlal',
      designation: 'Chairman',
      photoUrl: '',
      message: 'Our vision is to provide holistic healthcare with compassion.'
    }
  },
  {
    id: 'inspiration',
    section_name: 'Our Inspiration',
    section_type: 'object',
    display_order: 5,
    state_data: {
      title: 'Our Inspiration',
      quote: 'For millennia, India has known that true healing encompasses body, mind and soul.',
      author: 'Srila Prabhupada',
      description: 'Inspired by Srila Prabhupada\'s vision of holistic Vedic healthcare.',
      imageUrl: ''
    }
  },
  {
    id: 'logo',
    section_name: 'Logo Symbolism',
    section_type: 'object',
    display_order: 6,
    state_data: {
      intro: 'It gives us immense pleasure to present the Bhaktivedanta Hospital logo.',
      elements: []
    }
  },
  {
    id: 'awards',
    section_name: 'Awards & Accreditation',
    section_type: 'array',
    display_order: 7,
    state_data: [
      { id: 1, title: 'NABH Accreditation', imageUrl: '' },
      { id: 2, title: 'Best Hospital Award', imageUrl: '' }
    ]
  },
  {
    id: 'events_news',
    section_name: 'Events & Hospital in News',
    section_type: 'object',
    display_order: 8,
    state_data: {
      events: [],
      news: []
    }
  },
  {
    id: 'sri_chaitanya_trust',
    section_name: 'Sri Chaitanya Trust',
    section_type: 'object',
    display_order: 9,
    state_data: {
      about: {
        title: 'Sri Chaitanya Health Care & Trust',
        description: 'A charitable trust committed to serving the underprivileged.'
      },
      contact: { link: 'https://www.bhaktivedantahospital.com/about-us/sri-chaitanya-health-care-and-trust-cst' }
    }
  },
  {
    id: 'management_team',
    section_name: 'Our Management Team',
    section_type: 'array',
    display_order: 10,
    state_data: [
      { id: 1, bio: 'Mr. Hrishikesh A. Mafatlal', name: 'Mr. Hrishikesh A. Mafatlal', designation: 'Chairman', photoUrl: '' }
    ]
  },
  {
    id: 'new_developments',
    section_name: 'New Developments & Updates',
    section_type: 'array',
    display_order: 11,
    state_data: [
      { id: 1, title: '5th Annual Critical Care & Emergency Medicine Conference', description: '', imageUrl: '', readMoreLink: '' }
    ]
  },
  {
    id: 'spiritual_advisors',
    section_name: 'Our Spiritual Advisors',
    section_type: 'array',
    display_order: 12,
    state_data: [
      { id: 1, bio: 'H.G Shyamananda Das is a Vaishnava spiritual guide.', name: 'H.G Shyamananda Das', designation: 'Spiritual Advisor', photoUrl: '' }
    ]
  }
];

// ── Main setup ───────────────────────────────────────────────
async function setup() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('\n🔌  Connecting to database...');
    await client.connect();
    console.log('✅  Connected!\n');

    // ── 1. Create table ─────────────────────────────────────
    console.log('📦  Creating table bv_about_us...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.bv_about_us (
        id             VARCHAR(100)  PRIMARY KEY,
        section_name   VARCHAR(200)  NOT NULL,
        section_type   VARCHAR(50)   NOT NULL DEFAULT 'object',
        state_data     JSONB         NOT NULL DEFAULT '{}',
        display_order  INT           NOT NULL DEFAULT 0,
        is_active      BOOLEAN       NOT NULL DEFAULT true,
        created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);
    console.log('   ✅  Table bv_about_us ready');

    // ── 2. Add missing columns (safe if already exist) ──────
    const alterCols = [
      `ALTER TABLE public.bv_about_us ADD COLUMN IF NOT EXISTS section_type   VARCHAR(50)  NOT NULL DEFAULT 'object'`,
      `ALTER TABLE public.bv_about_us ADD COLUMN IF NOT EXISTS display_order  INT          NOT NULL DEFAULT 0`,
      `ALTER TABLE public.bv_about_us ADD COLUMN IF NOT EXISTS is_active      BOOLEAN      NOT NULL DEFAULT true`,
      `ALTER TABLE public.bv_about_us ADD COLUMN IF NOT EXISTS created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()`,
      `ALTER TABLE public.bv_about_us ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()`
    ];
    for (const sql of alterCols) {
      await client.query(sql).catch(() => {}); // ignore "already exists" errors
    }
    console.log('   ✅  All columns present');

    // ── 3. RLS + Policies ────────────────────────────────────
    console.log('\n🔒  Setting up RLS policies...');
    await client.query(`ALTER TABLE public.bv_about_us ENABLE ROW LEVEL SECURITY;`);
    await client.query(`DROP POLICY IF EXISTS "public_read_bv_about_us" ON public.bv_about_us;`);
    await client.query(`
      CREATE POLICY "public_read_bv_about_us" ON public.bv_about_us
        FOR SELECT USING (true);
    `);
    await client.query(`DROP POLICY IF EXISTS "full_access_bv_about_us" ON public.bv_about_us;`);
    await client.query(`
      CREATE POLICY "full_access_bv_about_us" ON public.bv_about_us
        FOR ALL USING (true);
    `);
    console.log('   ✅  RLS policies set');

    // ── 4. Auto-update trigger ───────────────────────────────
    await client.query(`
      CREATE OR REPLACE FUNCTION update_bv_about_us_ts()
      RETURNS TRIGGER LANGUAGE plpgsql AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$;
    `);
    await client.query(`DROP TRIGGER IF EXISTS trg_bv_about_us_ts ON public.bv_about_us;`);
    await client.query(`
      CREATE TRIGGER trg_bv_about_us_ts
        BEFORE INSERT OR UPDATE ON public.bv_about_us
        FOR EACH ROW EXECUTE FUNCTION update_bv_about_us_ts();
    `);

    // ── 5. Migrate from admin_about_us ───────────────────────
    console.log('\n📥  Migrating data from admin_about_us...');
    const { rowCount: migrated } = await client.query(`
      INSERT INTO public.bv_about_us
        (id, section_name, section_type, state_data, display_order, is_active)
      SELECT
        a.id,
        COALESCE(a.section_name, a.id),
        CASE
          WHEN a.id IN ('history','awards','management_team','new_developments','spiritual_advisors')
            THEN 'array'
          ELSE 'object'
        END,
        a.state_data,
        CASE a.id
          WHEN 'about_hospital'      THEN 1
          WHEN 'vision_mission'      THEN 2
          WHEN 'history'             THEN 3
          WHEN 'chairman'            THEN 4
          WHEN 'inspiration'         THEN 5
          WHEN 'logo'                THEN 6
          WHEN 'awards'              THEN 7
          WHEN 'events_news'         THEN 8
          WHEN 'sri_chaitanya_trust' THEN 9
          WHEN 'management_team'     THEN 10
          WHEN 'new_developments'    THEN 11
          WHEN 'spiritual_advisors'  THEN 12
          ELSE 99
        END,
        true
      FROM public.admin_about_us a
      WHERE a.id NOT IN ('about_us_state')
      ON CONFLICT (id) DO UPDATE SET
        state_data    = EXCLUDED.state_data,
        section_type  = EXCLUDED.section_type,
        display_order = EXCLUDED.display_order,
        updated_at    = NOW()
    `).catch(() => ({ rowCount: 0 }));
    console.log(`   ✅  Migrated ${migrated} rows from admin_about_us`);

    // ── 6. Seed any still-missing sections ───────────────────
    console.log('\n🌱  Seeding missing sections...');
    let seeded = 0;
    for (const sec of DEFAULT_SECTIONS) {
      const { rowCount } = await client.query(`
        INSERT INTO public.bv_about_us
          (id, section_name, section_type, state_data, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (id) DO NOTHING
      `, [sec.id, sec.section_name, sec.section_type, JSON.stringify(sec.state_data), sec.display_order]);
      if (rowCount > 0) { seeded++; console.log(`   + seeded: ${sec.id}`); }
    }
    console.log(`   ✅  ${seeded} new section(s) seeded`);

    // ── 7. Verify final state ────────────────────────────────
    console.log('\n📊  Final table contents:');
    const { rows } = await client.query(`
      SELECT id, section_name, section_type, display_order, is_active
      FROM   public.bv_about_us
      ORDER  BY display_order, id
    `);
    console.log('');
    console.table(rows);
    console.log(`\n🎉  Setup complete! ${rows.length} sections in bv_about_us.\n`);

  } catch (err) {
    console.error('\n❌  Setup failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();
