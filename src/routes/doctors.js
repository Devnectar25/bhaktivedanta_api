import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

let cachedImageMap = new Map();
let lastImageMapSync = 0;

// Clean doctor name formatting (removes duplicate prefixes like 'Dr. Dr ')
function cleanDoctorName(rawName = '', srNo = 1) {
  let cleaned = rawName.replace(/^[\r\n\s]+/, '').trim();
  if (!cleaned) return `Doctor ${srNo}`;
  
  // If starts with "Dr." or "Dr " or repeated "Dr. Dr "
  if (/^(dr\.?\s*)+/i.test(cleaned)) {
    return cleaned.replace(/^(dr\.?\s*)+/i, 'Dr. ');
  }
  return cleaned;
}

// Normalize doctor name for matching with storage bucket filenames
function normalizeNameKey(str = '') {
  return str.toLowerCase()
    .replace(/[\r\n\s]+/g, ' ')
    .replace(/^(dr\.?|ms\.?|mr\.?|prof\.?|\s+)+/gi, '')
    .replace(/[^a-z0-9]/g, '');
}

// Sync doctor image URLs from Supabase Storage bucket 'Doctors_Imeges'
async function getImageMap() {
  const now = Date.now();
  if (now - lastImageMapSync < 300000 && cachedImageMap.size > 0) {
    return cachedImageMap;
  }

  if (!supabase) return cachedImageMap;

  try {
    const { data: files, error } = await supabase.storage.from('Doctors_Imeges').list('', { limit: 500 });
    if (!error && Array.isArray(files) && files.length > 0) {
      const map = new Map();
      files.forEach(f => {
        if (f.name) {
          const key = normalizeNameKey(f.name.replace(/\.(png|jpg|jpeg|webp)$/i, ''));
          const publicUrl = `https://ohaokdfkdafgpwccauos.supabase.co/storage/v1/object/public/Doctors_Imeges/${encodeURIComponent(f.name)}`;
          map.set(key, publicUrl);
        }
      });
      cachedImageMap = map;
      lastImageMapSync = now;
    }
  } catch (err) {
    console.warn('Could not list Doctors_Imeges storage bucket:', err.message);
  }
  return cachedImageMap;
}

// Helper to extract medical department from Description and Qualification
function extractDepartment(description = '', qualification = '') {
  const text = (description + ' ' + qualification).toLowerCase();
  if (text.includes('anesthes') || text.includes('anaesthes')) return 'Anesthesiology';
  if (text.includes('cardio') || text.includes('cvts') || text.includes('heart')) return 'Cardiology';
  if (text.includes('dermatol') || text.includes('skin')) return 'Dermatology';
  if (text.includes('dent') || text.includes('periodont') || text.includes('endodont') || text.includes('orthodont') || text.includes('pedodont') || text.includes('prosthodont') || text.includes('maxillofacial')) return 'Dental Care';
  if (text.includes('ent') || text.includes('audiolog') || text.includes('speech')) return 'ENT (Ear, Nose, Throat)';
  if (text.includes('internal medicine') || text.includes('general physician') || text.includes('physician') || text.includes('intensivist') || text.includes('general medicine') || text.includes('infectious')) return 'General & Internal Medicine';
  if (text.includes('laparoscop') || text.includes('general surgeon') || text.includes('general & laparoscopic') || text.includes('endoscopic') || text.includes('hepatobiliary')) return 'General & Laparoscopic Surgery';
  if (text.includes('obstetric') || text.includes('gynaecolog') || text.includes('gynecolog')) return 'Obstetrics & Gynaecology';
  if (text.includes('palliative') || text.includes('pain management')) return 'Palliative Care & Pain Clinic';
  if (text.includes('psychiat') || text.includes('psycholog') || text.includes('psychother')) return 'Psychiatry & Psychology';
  if (text.includes('physiotherap') || text.includes('occupational therapist')) return 'Physiotherapy & Rehabilitation';
  if (text.includes('rheumatol')) return 'Rheumatology';
  if (text.includes('pulmonol') || text.includes('chest medicine') || text.includes('sleep medicine') || text.includes('respiratory')) return 'Pulmonology & Chest Medicine';
  if (text.includes('diabet') || text.includes('endocrin') || text.includes('diet')) return 'Endocrinology & Diabetology';
  if (text.includes('gastroenterol')) return 'Gastroenterology';
  if (text.includes('haematol')) return 'Haematology';
  if (text.includes('nephrol')) return 'Nephrology';
  if (text.includes('plastic') || text.includes('cosmetic')) return 'Plastic & Cosmetic Surgery';
  if (text.includes('vascular')) return 'Vascular Surgery';
  if (text.includes('urolog')) return 'Urology';
  if (text.includes('ayurveda') || text.includes('homeopath') || text.includes('yoga') || text.includes('accupunct') || text.includes('spiritual')) return 'Ayush & Holistic Health';
  if (text.includes('orthop') || text.includes('spine') || text.includes('arthroscopy') || text.includes('joint replacement') || text.includes('trauma')) return 'Orthopedics';
  if (text.includes('oncol') || text.includes('cancer') || text.includes('onco-')) return 'Oncology';
  if (text.includes('ophthalmol') || text.includes('eye') || text.includes('cornea') || text.includes('glaucoma') || text.includes('retina')) return 'Ophthalmology';
  if (text.includes('pediatr') || text.includes('paediatr') || text.includes('neonat')) return 'Pediatrics';
  if (text.includes('neuro')) return 'Neurology & Neurosurgery';
  if (text.includes('radiolog')) return 'Radiology';
  return 'General Medicine';
}

// Format doctor record to provide all required frontend properties including real Supabase bucket photo
function formatDoctor(d, index = 0, imageMap = new Map()) {
  const srNo = d['sr.no'] || d.sr_no || (index + 1);
  const rawName = (d.Name || d.name || '').replace(/^[\r\n\s]+/, '').trim();
  const name = cleanDoctorName(rawName, srNo);
  const qualifications = (d.Qualification || d.qualifications || '').replace(/^[\r\n\s]+/, '').trim();
  const rawExp = (d.Experience || d.experience || '5+ Years').replace(/^[\r\n\s]+/, '').trim();
  const experience = rawExp || '5+ Years';
  const description = (d.Description || d.description || '').replace(/^[\r\n\s]+/, '').trim();
  const department = d.department || extractDepartment(description, qualifications);
  const subSpeciality = d.subSpeciality || description || department;
  
  // Resolve real image from Supabase Storage bucket
  let doctorImage = d.image || '';
  if (!doctorImage || doctorImage.startsWith('/doctor')) {
    let key = normalizeNameKey(name);
    if (!imageMap.has(key) && key === 'tussharagarwal') key = 'tusharagarwal';

    if (imageMap.has(key)) {
      doctorImage = imageMap.get(key);
    } else {
      const imageIndex = ((srNo - 1) % 4) + 1;
      doctorImage = `/doctor${imageIndex}.png`;
    }
  }

  // Deterministic realistic availability and featured tags if not specified
  const availOptions = ['Available', 'Available', 'Available', 'Busy', 'On Leave'];
  const defaultAvail = availOptions[srNo % availOptions.length];
  const defaultFeatured = (srNo % 11 === 0 || srNo <= 6) ? 'Yes' : 'No';

  return {
    id: String(d.id || `doc-${srNo}`),
    'sr.no': srNo,
    name,
    qualifications: qualifications || 'MBBS, Specialist Consultant',
    department,
    subSpeciality,
    experience,
    availability: d.availability || defaultAvail,
    featured: d.featured || defaultFeatured,
    status: d.status || 'Active',
    image: doctorImage
  };
}

// Helper to fetch and merge all doctors with real Supabase bucket photo URLs
async function getAllDoctors() {
  const imageMap = await getImageMap();
  let dbDoctors = [];
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bv_doctors')
        .select('*');
      
      if (!error && Array.isArray(data) && data.length > 0) {
        // Sort by sr.no ascending
        data.sort((a, b) => (a['sr.no'] || 0) - (b['sr.no'] || 0));
        dbDoctors = data.map((d, idx) => formatDoctor(d, idx, imageMap));
      } else if (error) {
        console.warn('Error fetching bv_doctors from Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Supabase fetch bv_doctors exception:', err.message);
    }
  }

  // Load any local overrides, edits, or newly added doctors
  const localDocs = readData('doctors') || [];
  
  if (dbDoctors.length === 0) {
    // If Supabase was empty or offline, fallback to local storage
    return localDocs.map((d, idx) => formatDoctor(d, idx, imageMap));
  }

  // If localDocs exists and contains modifications or newly added doctors
  const localMap = new Map();
  for (const doc of localDocs) {
    if (doc.id) {
      localMap.set(doc.id, doc);
    }
  }

  // Merge Supabase doctors with any local modifications
  const merged = dbDoctors.map(dbDoc => {
    if (localMap.has(dbDoc.id)) {
      const local = localMap.get(dbDoc.id);
      const cleanName = cleanDoctorName(local.name || dbDoc.name, dbDoc['sr.no']);
      // Prefer real bucket image if local still has stock fallback
      const finalImage = (local.image && !local.image.startsWith('/doctor')) ? local.image : dbDoc.image;
      return { ...dbDoc, ...local, name: cleanName, image: finalImage };
    }
    return dbDoc;
  });

  // Also include any custom added doctors that have an id not in dbDoctors
  const dbIdSet = new Set(dbDoctors.map(d => d.id));
  for (const doc of localDocs) {
    if (doc.id && !dbIdSet.has(doc.id)) {
      if (!['d1', 'd2', 'd3', 'd4'].includes(doc.id)) {
        merged.push(formatDoctor(doc, merged.length, imageMap));
      }
    }
  }

  return merged;
}

// GET all doctors (returns all 165 from bv_doctors with real bucket photo URLs)
router.get('/', async (req, res, next) => {
  try {
    const doctors = await getAllDoctors();
    res.json(doctors);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update doctors (overwrite list in local storage cache)
router.put('/', async (req, res, next) => {
  try {
    const doctors = req.body;
    if (Array.isArray(doctors)) {
      writeData('doctors', doctors);
      return res.json(doctors);
    }
    res.status(400).json({ error: 'Expected array of doctors' });
  } catch (err) {
    next(err);
  }
});

// POST create doctor
router.post('/', async (req, res, next) => {
  try {
    const imageMap = await getImageMap();
    const currentDoctors = await getAllDoctors();
    const newSrNo = currentDoctors.length + 1;
    const newDoctor = formatDoctor({
      id: req.body.id || `doc-${Date.now()}`,
      'sr.no': newSrNo,
      name: req.body.name || '',
      qualifications: req.body.qualifications || '',
      department: req.body.department || 'General Medicine',
      subSpeciality: req.body.subSpeciality || '',
      experience: req.body.experience || '5+ Years',
      availability: req.body.availability || 'Available',
      featured: req.body.featured || 'No',
      status: req.body.status || 'Active',
      image: req.body.image || `/doctor${((newSrNo - 1) % 4) + 1}.png`
    }, currentDoctors.length, imageMap);

    currentDoctors.unshift(newDoctor);
    writeData('doctors', currentDoctors);

    res.status(201).json(newDoctor);
  } catch (err) {
    next(err);
  }
});

// PUT update doctor
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentDoctors = await getAllDoctors();
    const index = currentDoctors.findIndex(d => d.id === id || String(d['sr.no']) === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    const updated = {
      ...currentDoctors[index],
      ...req.body,
      name: cleanDoctorName(req.body.name || currentDoctors[index].name, currentDoctors[index]['sr.no']),
      id: currentDoctors[index].id
    };

    currentDoctors[index] = updated;
    writeData('doctors', currentDoctors);

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE doctor
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentDoctors = await getAllDoctors();
    const filtered = currentDoctors.filter(d => d.id !== id && String(d['sr.no']) !== id);
    
    if (filtered.length === currentDoctors.length) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    writeData('doctors', filtered);
    res.json({ success: true, message: `Doctor ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
