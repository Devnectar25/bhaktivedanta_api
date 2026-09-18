import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as seeds from './seeds.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LEGACY_SRC_DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Get absolute path for a data file.
 */
function getFilePath(key) {
  const rootPath = path.join(DATA_DIR, `${key}.json`);
  if (!fs.existsSync(rootPath)) {
    const legacyPath = path.join(LEGACY_SRC_DATA_DIR, `${key}.json`);
    if (fs.existsSync(legacyPath)) {
      try {
        fs.copyFileSync(legacyPath, rootPath);
      } catch (e) { }
    }
  }
  return rootPath;
}

const memoryCache = {};

/**
 * Read data for a key. If the file doesn't exist, seed it.
 */
export function readData(key) {
  if (memoryCache[key]) {
    return memoryCache[key];
  }

  const filePath = getFilePath(key);

  if (!fs.existsSync(filePath)) {
    // Determine the seed mapping
    let seedData = [];
    if (key === 'doctors') seedData = seeds.defaultDoctors;
    else if (key === 'appointments') seedData = seeds.defaultAppointments;
    else if (key === 'events') seedData = seeds.defaultEvents;
    else if (key === 'testimonials') seedData = seeds.defaultTestimonials;
    else if (key === 'news') seedData = seeds.defaultNews;
    else if (key === 'gallery') seedData = seeds.defaultGallery;
    else if (key === 'queries') seedData = seeds.defaultQueries;
    else if (key === 'subadmins') seedData = seeds.defaultSubAdmins;
    else if (key === 'helpdesk') seedData = seeds.defaultHelpDesk;
    else if (key === 'app_errors') seedData = seeds.defaultAppErrors;
    else if (key === 'specialities_state') seedData = seeds.defaultSpecialitiesState;
    else if (key === 'services_state') seedData = seeds.defaultServicesState;
    else if (key === 'patient_corner_state') seedData = seeds.defaultPatientCornerState;
    else if (key === 'career_jobs') seedData = seeds.defaultCareerJobs;
    else if (key === 'career_applications') seedData = seeds.defaultCareerApplications;

    // Write seed data
    try {
      fs.writeFileSync(filePath, JSON.stringify(seedData, null, 2), 'utf-8');
    } catch (err) {
      console.warn(`Could not write seed file for ${key} (probably read-only fs):`, err.message);
    }
    memoryCache[key] = seedData;
    return seedData;
  }

  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(rawContent);
    memoryCache[key] = parsed;
    return parsed;
  } catch (err) {
    console.error(`Error reading database file for ${key}:`, err);
    return [];
  }
}

/**
 * Write data back to memory cache and fallback JSON file if Supabase is offline.
 */
export function writeData(key, data) {
  memoryCache[key] = data;

  const isSupabaseActive = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (isSupabaseActive) {
    // Supabase is the primary persistent store; memoryCache serves as in-process cache
    return true;
  }

  // Fallback mode without Supabase: save to disk
  const filePath = getFilePath(key);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Error writing database file for ${key}:`, err.message);
  }

  return true;
}

// Pre-initialize all seed data
export function initializeDatabase() {
  const entities = [
    'doctors',
    'appointments',
    'events',
    'testimonials',
    'news',
    'gallery',
    'queries',
    'subadmins',
    'helpdesk',
    'app_errors',
    'specialities_state',
    'services_state',
    'patient_corner_state'
  ];

  for (const entity of entities) {
    readData(entity); // Triggers seeding if not exists
  }
  console.log('Database seeded and initialized successfully.');
}
