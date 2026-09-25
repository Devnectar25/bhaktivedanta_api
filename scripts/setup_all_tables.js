/**
 * setup_all_tables.js
 * ─────────────────────────────────────────────────────────────
 * Creates ALL missing tables required by the Bhaktivedanta API.
 * Safe to run multiple times (idempotent).
 *
 * Usage:  node scripts/setup_all_tables.js
 * ─────────────────────────────────────────────────────────────
 */

import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

// ── helper ───────────────────────────────────────────────────
async function run(label, sql) {
  try {
    await client.query(sql);
    console.log(`  ✅  ${label}`);
  } catch (e) {
    console.error(`  ❌  ${label} — ${e.message}`);
  }
}

async function enableRLS(table) {
  await run(`RLS on ${table}`, `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`);
  await client.query(`DROP POLICY IF EXISTS "public_read_${table}" ON public.${table}`).catch(() => {});
  await run(`read policy ${table}`,
    `CREATE POLICY "public_read_${table}" ON public.${table} FOR SELECT USING (true)`);
  await client.query(`DROP POLICY IF EXISTS "full_access_${table}" ON public.${table}`).catch(() => {});
  await run(`write policy ${table}`,
    `CREATE POLICY "full_access_${table}" ON public.${table} FOR ALL USING (true)`);
}

// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔌  Connecting to database...');
  await client.connect();
  console.log('✅  Connected!\n');

  // ── 1. bv_blogs ───────────────────────────────────────────
  console.log('📦  [1/2] bv_blogs');
  await run('create bv_blogs', `
    CREATE TABLE IF NOT EXISTS public.bv_blogs (
      id           TEXT          PRIMARY KEY,
      title        TEXT          NOT NULL DEFAULT '',
      slug         TEXT          UNIQUE,
      category     TEXT          DEFAULT 'General Health',
      author       TEXT          DEFAULT 'Admin Team',
      "authorRole" TEXT          DEFAULT 'Contributor',
      date         TEXT,
      "readTime"   TEXT          DEFAULT '5 min read',
      image        TEXT          DEFAULT '',
      summary      TEXT          DEFAULT '',
      content      TEXT          DEFAULT '',
      tags         JSONB         DEFAULT '[]',
      status       TEXT          DEFAULT 'Published',
      views        INT           DEFAULT 0,
      created_at   TIMESTAMPTZ   DEFAULT NOW(),
      updated_at   TIMESTAMPTZ   DEFAULT NOW()
    )
  `);
  await enableRLS('bv_blogs');

  // ── 2. bv_statutory_compliances_state ────────────────────
  console.log('\n📦  [2/2] bv_statutory_compliances_state');
  await run('create bv_statutory_compliances_state', `
    CREATE TABLE IF NOT EXISTS public.bv_statutory_compliances_state (
      id           TEXT          PRIMARY KEY DEFAULT 'primary',
      state_data   JSONB         NOT NULL DEFAULT '{"compliances":[]}',
      updated_at   TIMESTAMPTZ   DEFAULT NOW()
    )
  `);
  await enableRLS('bv_statutory_compliances_state');

  // Seed default row for statutory compliances
  await run('seed statutory_compliances_state', `
    INSERT INTO public.bv_statutory_compliances_state (id, state_data)
    VALUES (
      'primary',
      '{"compliances":[
        {"id":1,"title":"Clinical Establishment Act","fileUrl":"","description":"Registration under Clinical Establishment Act"},
        {"id":2,"title":"NABH Certificate","fileUrl":"","description":"National Accreditation Board for Hospitals certification"},
        {"id":3,"title":"Fire NOC","fileUrl":"","description":"Fire No Objection Certificate"},
        {"id":4,"title":"Biomedical Waste","fileUrl":"","description":"Biomedical Waste Management authorization"},
        {"id":5,"title":"PCPNDT Act","fileUrl":"","description":"Pre-Conception & Pre-Natal Diagnostic Techniques registration"}
      ]}'
    )
    ON CONFLICT (id) DO NOTHING
  `);

  // ── Verify ────────────────────────────────────────────────
  console.log('\n📊  All tables now in database:');
  const { rows } = await client.query(`
    SELECT table_name
    FROM   information_schema.tables
    WHERE  table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER  BY table_name
  `);

  // Compare with required tables
  const REQUIRED = [
    'bv_app_errors',
    'bv_appointments',
    'bv_blogs',
    'bv_career_applications',
    'bv_career_jobs',
    'bv_categories',
    'bv_doctors',
    'bv_education_inquiries',
    'bv_education_research_state',
    'bv_events',
    'bv_gallery',
    'bv_helpdesk',
    'bv_news',
    'bv_patient_corner_categories',
    'bv_queries',
    'bv_service_categories',
    'bv_statutory_compliances_state',
    'bv_subadmins',
    'bv_testimonials',
    'admin_about_us',
    'admin_education_programs',
    'admin_patient_corner_guides',
    'admin_services',
    'admin_specialities',
    'admin_spiritual_dynamic_sections',
    'admin_spiritual_programmes',
    'admin_spiritual_publications',
    'admin_spiritual_retreats',
    'admin_spiritual_services'
  ];

  const existing = new Set(rows.map(r => r.table_name));

  console.log('\n  STATUS:');
  REQUIRED.forEach(t => {
    const ok = existing.has(t);
    console.log(`  ${ok ? '✅' : '❌ MISSING'} ${t}`);
  });

  const missing = REQUIRED.filter(t => !existing.has(t));
  if (missing.length === 0) {
    console.log('\n🎉  All required tables exist!\n');
  } else {
    console.log(`\n⚠️  Still missing ${missing.length} table(s). Check errors above.\n`);
  }

  await client.end();
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
