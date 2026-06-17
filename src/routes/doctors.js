import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// Helper to handle Supabase error scenarios friendly to the user
function handleSupabaseError(err, res, next) {
  if (err.code === 'PGRST205' || (err.message && err.message.includes('does not exist'))) {
    return res.status(500).json({
      error: 'Database table not found',
      message: 'The database table "bv_doctors" does not exist in your Supabase database. Please create it using the SQL Editor in your Supabase dashboard.',
      sql: 'CREATE TABLE IF NOT EXISTS bv_doctors (id TEXT PRIMARY KEY, name TEXT NOT NULL, qualifications TEXT NOT NULL, department TEXT NOT NULL, "subSpeciality" TEXT, experience TEXT NOT NULL, availability TEXT, featured TEXT, status TEXT, image TEXT);'
    });
  }
  next(err);
}

// GET all doctors
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const doctors = readData('doctors');
      // Sort by name ascending to match Supabase behavior
      doctors.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      return res.json(doctors);
    }

    const { data, error } = await supabase
      .from('bv_doctors')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) return handleSupabaseError(error, res, next);
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update doctors (overwrite entire list)
router.put('/', async (req, res, next) => {
  try {
    const doctors = req.body;

    if (!supabase) {
      writeData('doctors', doctors);
      return res.json(doctors);
    }
    
    // 1. Delete all existing doctors
    const { error: deleteError } = await supabase
      .from('bv_doctors')
      .delete()
      .neq('id', ''); // Delete all rows where id is not empty
      
    if (deleteError) return handleSupabaseError(deleteError, res, next);
    
    // 2. Insert new doctors if any
    if (doctors && doctors.length > 0) {
      const formattedDocs = doctors.map(d => ({
        id: d.id,
        name: d.name || '',
        qualifications: d.qualifications || '',
        department: d.department || '',
        subSpeciality: d.subSpeciality || '',
        experience: d.experience || '',
        availability: d.availability || 'Available',
        featured: d.featured || 'No',
        status: d.status || 'Active',
        image: d.image || ''
      }));
      
      const { data, error: insertError } = await supabase
        .from('bv_doctors')
        .insert(formattedDocs)
        .select();
        
      if (insertError) return handleSupabaseError(insertError, res, next);
      res.json(data);
    } else {
      res.json([]);
    }
  } catch (err) {
    next(err);
  }
});

// POST create doctor
router.post('/', async (req, res, next) => {
  try {
    const newDoctor = {
      id: req.body.id || `d-${Date.now()}`,
      name: req.body.name || '',
      qualifications: req.body.qualifications || '',
      department: req.body.department || '',
      subSpeciality: req.body.subSpeciality || '',
      experience: req.body.experience || '',
      availability: req.body.availability || 'Available',
      featured: req.body.featured || 'No',
      status: req.body.status || 'Active',
      image: req.body.image || ''
    };

    if (!supabase) {
      const doctors = readData('doctors');
      doctors.push(newDoctor);
      writeData('doctors', doctors);
      return res.status(201).json(newDoctor);
    }
    
    const { data, error } = await supabase
      .from('bv_doctors')
      .insert([newDoctor])
      .select()
      .single();
      
    if (error) return handleSupabaseError(error, res, next);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// PUT update doctor
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      name: req.body.name,
      qualifications: req.body.qualifications,
      department: req.body.department,
      subSpeciality: req.body.subSpeciality,
      experience: req.body.experience,
      availability: req.body.availability,
      featured: req.body.featured,
      status: req.body.status,
      image: req.body.image
    };

    if (!supabase) {
      const doctors = readData('doctors');
      const index = doctors.findIndex(d => d.id === id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      doctors[index] = {
        ...doctors[index],
        ...updateData,
        id // Prevent overwriting key id
      };
      
      // Remove keys that are undefined to match Supabase partial update style
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete doctors[index][key];
        }
      });
      
      writeData('doctors', doctors);
      return res.json(doctors[index]);
    }
    
    // Remove undefined values to avoid overwriting database fields with null unless explicitly sent
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('bv_doctors')
      .update(updateData)
      .eq('id', id)
      .select();
      
    if (error) return handleSupabaseError(error, res, next);
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE doctor
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      const doctors = readData('doctors');
      const filtered = doctors.filter(d => d.id !== id);
      
      if (doctors.length === filtered.length) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      writeData('doctors', filtered);
      return res.json({ success: true, message: `Doctor ${id} deleted` });
    }
    
    // Check if the doctor exists first
    const { data: existing, error: fetchError } = await supabase
      .from('bv_doctors')
      .select('id')
      .eq('id', id);
      
    if (fetchError) return handleSupabaseError(fetchError, res, next);
    
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const { error: deleteError } = await supabase
      .from('bv_doctors')
      .delete()
      .eq('id', id);
      
    if (deleteError) return handleSupabaseError(deleteError, res, next);
    res.json({ success: true, message: `Doctor ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
