import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all appointments
router.get('/', (req, res, next) => {
  try {
    const appointments = readData('appointments');
    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update appointments
router.put('/', (req, res, next) => {
  try {
    writeData('appointments', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create appointment
router.post('/', (req, res, next) => {
  try {
    const appointments = readData('appointments');
    const newAppointment = {
      id: req.body.id || `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: req.body.patientName || '',
      patientPhone: req.body.patientPhone || '',
      doctorName: req.body.doctorName || '',
      department: req.body.department || '',
      dateTime: req.body.dateTime || new Date().toLocaleString(),
      payment: req.body.payment || 'Unpaid',
      status: req.body.status || 'Pending'
    };
    
    appointments.push(newAppointment);
    writeData('appointments', appointments);
    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
});

// PUT update appointment
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const appointments = readData('appointments');
    const index = appointments.findIndex(a => a.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[index] = {
      ...appointments[index],
      ...req.body,
      id // Prevent ID change
    };
    
    writeData('appointments', appointments);
    res.json(appointments[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE appointment
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const appointments = readData('appointments');
    const filtered = appointments.filter(a => a.id !== id);
    
    if (appointments.length === filtered.length) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    writeData('appointments', filtered);
    res.json({ success: true, message: `Appointment ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
