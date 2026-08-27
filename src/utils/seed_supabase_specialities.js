import { supabase } from './supabase.js';
import { defaultSpecialitiesState, ensureStandardTabs } from './seeds.js';

// Deep copy seeds data
const rawState = JSON.parse(JSON.stringify(defaultSpecialitiesState));
rawState.specialities.forEach(ensureStandardTabs);

const categoriesMap = {};
(rawState.categories || []).forEach(cat => {
  categoriesMap[cat.id] = cat;
});

const rowsToInsert = rawState.specialities.map(spec => {
  const cat = categoriesMap[spec.categoryId] || {};
  return {
    id: spec.id,
    speciality_name: spec.name,
    icon: spec.icon || 'star',
    short_description: spec.shortDescription || `Comprehensive ${spec.name} clinical care services at Bhaktivedanta Hospital.`,
    banner_image: spec.bannerImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    thumbnail_image: spec.thumbnailImage || 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop',
    status: spec.status ? 'Live' : 'Hidden',
    category_id: spec.categoryId,
    category_name: cat.name || 'Unassigned',
    category_description: cat.description || '',
    category_order: cat.order || 1,
    category_status: cat.status !== false,
    tabs_data: spec.tabs || [],
    admin_id: spec.adminId || 'ADM-001',
    admin_name: spec.adminName || 'Super Administrator',
    created_at: spec.createdAt || new Date().toISOString(),
    updated_at: spec.updatedAt || new Date().toISOString()
  };
});

async function seed() {
  console.log(`Seeding ${rowsToInsert.length} specialities into Supabase table "admin_specialities"...`);
  try {
    // Upsert all rows into admin_specialities
    const { data, error } = await supabase
      .from('admin_specialities')
      .upsert(rowsToInsert, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error seeding admin_specialities:', error);
    } else {
      console.log(`Successfully seeded ${data ? data.length : rowsToInsert.length} specialities into admin_specialities table!`);
    }
  } catch (err) {
    console.error('Unexpected error during seeding:', err);
  }
}

seed();
