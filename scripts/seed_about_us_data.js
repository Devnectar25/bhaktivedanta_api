import { supabase } from '../src/utils/supabase.js';
import { defaultAboutUsData } from '../src/data/defaultAboutUsData.js';
import { writeData } from '../src/utils/storage.js';

async function seedAboutUs() {
  console.log('Seeding About Us data into Supabase & Storage...');

  // 1. Write to local JSON storage
  writeData('about_us_state', defaultAboutUsData);
  console.log('✓ Written to local JSON storage: about_us_state.json');

  // 2. Write to Supabase database
  if (supabase) {
    try {
      const now = new Date().toISOString();
      const rows = [
        { id: 'about_hospital', section_name: 'About Hospital Overview', state_data: defaultAboutUsData.aboutHospital, updated_at: now },
        { id: 'history', section_name: 'History Timeline', state_data: defaultAboutUsData.history, updated_at: now },
        { id: 'chairman', section_name: "Chairman's Message", state_data: defaultAboutUsData.chairmansMessage, updated_at: now },
        { id: 'inspiration', section_name: 'Our Inspiration', state_data: defaultAboutUsData.ourInspiration, updated_at: now },
        { id: 'logo', section_name: 'Logo Symbolism', state_data: defaultAboutUsData.logo, updated_at: now },
        { id: 'vision_mission', section_name: 'Vision, Mission & Values', state_data: defaultAboutUsData.visionMissionValues, updated_at: now },
        { id: 'awards', section_name: 'Awards & Accreditation', state_data: defaultAboutUsData.awardsAccreditation, updated_at: now },
        { id: 'events_news', section_name: 'Events & Hospital in News', state_data: defaultAboutUsData.eventsAndNews, updated_at: now },
        { id: 'sri_chaitanya_trust', section_name: 'Sri Chaitanya Health and Care Trust', state_data: defaultAboutUsData.sriChaitanyaTrust || {}, updated_at: now },
        { id: 'management_team', section_name: 'Our Management Team', state_data: defaultAboutUsData.managementTeam || [], updated_at: now },
        { id: 'new_developments', section_name: 'New Developments & Updates', state_data: defaultAboutUsData.newDevelopments || [], updated_at: now },
        { id: 'spiritual_advisors', section_name: 'Our Spiritual Advisors', state_data: defaultAboutUsData.spiritualAdvisors || [], updated_at: now },
        { id: 'about_us_state', section_name: 'Full Combined State', state_data: defaultAboutUsData, updated_at: now }
      ];

      // Seed into admin_about_us
      const { data: d1, error: err1 } = await supabase
        .from('admin_about_us')
        .upsert(rows);

      if (err1) {
        console.warn('admin_about_us seed notice:', err1.message);
      } else {
        console.log(`✓ Successfully seeded ${rows.length} rows into admin_about_us table!`);
      }

      // Seed into bv_about_us_state
      const { data: d2, error: err2 } = await supabase
        .from('bv_about_us_state')
        .upsert(rows);

      if (err2) {
        console.warn('bv_about_us_state seed notice:', err2.message);
      } else {
        console.log(`✓ Successfully seeded ${rows.length} rows into bv_about_us_state table!`);
      }

    } catch (err) {
      console.error('Unexpected Supabase error:', err.message);
    }
  } else {
    console.warn('Supabase client not initialized, local storage seeded.');
  }

  console.log('About Us Seeding Completed Successfully!');
}

seedAboutUs().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
