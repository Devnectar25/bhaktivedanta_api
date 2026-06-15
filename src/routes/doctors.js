import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all doctors
router.get('/', (req, res, next) => {
  try {
    const doctors = readData('doctors');
    res.json(doctors);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update doctors (overwrite entire list)
router.put('/', (req, res, next) => {
  try {
    writeData('doctors', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create doctor
router.post('/', (req, res, next) => {
  try {
    const doctors = readData('doctors');
    const newDoctor = {
      id: `d-${Date.now()}`,
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
    
    doctors.push(newDoctor);
    writeData('doctors', doctors);
    res.status(201).json(newDoctor);
  } catch (err) {
    next(err);
  }
});

// PUT update doctor
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const doctors = readData('doctors');
    const index = doctors.findIndex(d => d.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    doctors[index] = {
      ...doctors[index],
      ...req.body,
      id // Prevent overwriting key id
    };
    
    writeData('doctors', doctors);
    res.json(doctors[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE doctor
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const doctors = readData('doctors');
    const filtered = doctors.filter(d => d.id !== id);
    
    if (doctors.length === filtered.length) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    writeData('doctors', filtered);
    res.json({ success: true, message: `Doctor ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
