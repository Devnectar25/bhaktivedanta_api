/**
 * Seed script — populates bv_about_us (single table) with default About Us data.
 *
 * Usage:
 *   node scripts/seed_about_us_data.js
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// -------------------------------------------------------
// Load default data from the JS module
// -------------------------------------------------------
const dataFilePath = path.join(__dirname, '../src/data/defaultAboutUsData.js');
const rawModule    = fs.readFileSync(dataFilePath, 'utf-8');

// Extract the exported object via regex (simple static parse)
const match = rawModule.match(/export const defaultAboutUsData\s*=\s*(\{[\s\S]*\});?\s*$/);
if (!match) {
  console.error('Could not parse defaultAboutUsData from', dataFilePath);
  process.exit(1);
}

let defaultAboutUsData;
try {
  // eslint-disable-next-line no-eval
  defaultAboutUsData = eval('(' + match[1] + ')');
} catch (e) {
  console.error('Failed to evaluate defaultAboutUsData:', e.message);
  process.exit(1);
}

// -------------------------------------------------------
// Build rows for single table
// -------------------------------------------------------
const TABLE = 'bv_about_us';

const rows = [
  { id: 'about_hospital',      section_name: 'About Hospital Overview',               state_data: defaultAboutUsData.aboutHospital       || {} },
  { id: 'history',             section_name: 'History Timeline',                      state_data: defaultAboutUsData.history             || [] },
  { id: 'chairman',            section_name: "Chairman's Message",                    state_data: defaultAboutUsData.chairmansMessage    || {} },
  { id: 'inspiration',         section_name: 'Our Inspiration',                       state_data: defaultAboutUsData.ourInspiration      || {} },
  { id: 'logo',                section_name: 'Logo Symbolism',                        state_data: defaultAboutUsData.logo                || {} },
  { id: 'vision_mission',      section_name: 'Vision, Mission & Values',              state_data: defaultAboutUsData.visionMissionValues || {} },
  { id: 'awards',              section_name: 'Awards & Accreditation',                state_data: defaultAboutUsData.awardsAccreditation || [] },
  { id: 'events_news',         section_name: 'Events & Hospital in News',             state_data: defaultAboutUsData.eventsAndNews       || {} },
  { id: 'sri_chaitanya_trust', section_name: 'Sri Chaitanya Health and Care Trust',   state_data: defaultAboutUsData.sriChaitanyaTrust   || {} },
  { id: 'management_team',     section_name: 'Our Management Team',                   state_data: defaultAboutUsData.managementTeam      || [] },
  { id: 'new_developments',    section_name: 'New Developments & Updates',            state_data: defaultAboutUsData.newDevelopments     || [] },
  { id: 'spiritual_advisors',  section_name: 'Our Spiritual Advisors',                state_data: defaultAboutUsData.spiritualAdvisors   || [] }
];

// -------------------------------------------------------
// Connect & seed
// -------------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

console.log(`\nSeeding ${rows.length} sections into "${TABLE}"...\n`);

const { data, error } = await supabase.from(TABLE).upsert(rows);

if (error) {
  console.error('❌  Seed failed:', error.message);
  process.exit(1);
}

console.log('✅  Seed complete! Sections inserted/updated:');
rows.forEach(r => console.log(`   • ${r.id}  →  ${r.section_name}`));
console.log('\nDone.\n');
