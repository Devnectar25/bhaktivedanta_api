import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as seeds from './seeds.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Get absolute path for a data file.
 */
function getFilePath(key) {
  return path.join(DATA_DIR, `${key}.json`);
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
 * Write data back to a key's JSON file.
 */
export function writeData(key, data) {
  memoryCache[key] = data;
  const filePath = getFilePath(key);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn(`Error writing database file for ${key} (ignoring since memory is updated):`, err.message);
    return true; // Return true so client API doesn't get error
  }
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
    'specialities_state'
  ];
  
  for (const entity of entities) {
    readData(entity); // Triggers seeding if not exists
  }
  console.log('Database seeded and initialized successfully.');
}
