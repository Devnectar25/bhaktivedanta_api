import { supabase } from './supabase.js';
import { defaultSpecialitiesState, ensureStandardTabs } from './seeds.js';

// Deep copy seeds data
const rawState = JSON.parse(JSON.stringify(defaultSpecialitiesState));
rawState.specialities.forEach(ensureStandardTabs);

const categoriesMap = {};
(rawState.categories || []).forEach(cat => {
  categoriesMap[cat.id] = cat;
});

const catRowsToInsert = (rawState.categories || []).map(cat => ({
  id: cat.id,
  name: cat.name,
  description: cat.description || '',
  order: parseInt(cat.order) || 1,
  status: cat.status !== false,
  adminId: cat.adminId || 'ADM-001',
  adminName: cat.adminName || 'Super Administrator',
  created_at: cat.createdAt || new Date().toISOString(),
  updated_at: cat.updatedAt || new Date().toISOString()
}));

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
  console.log(`Seeding ${catRowsToInsert.length} categories into Supabase table "bv_categories"...`);
  try {
    const { data: catData, error: catError } = await supabase
      .from('bv_categories')
      .upsert(catRowsToInsert, { onConflict: 'id' })
      .select();

    if (catError) {
      console.error('Error seeding bv_categories:', catError);
    } else {
      console.log(`Successfully seeded ${catData ? catData.length : catRowsToInsert.length} categories into bv_categories table!`);
    }
  } catch (err) {
    console.error('Unexpected error seeding bv_categories:', err);
  }

  console.log(`Seeding ${rowsToInsert.length} specialities into Supabase table "admin_specialities"...`);
  try {
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
