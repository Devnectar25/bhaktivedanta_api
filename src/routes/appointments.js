import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all appointments
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const appointments = readData('appointments');
      return res.json(appointments);
    }

    const { data, error } = await supabase
      .from('bv_appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error, fallback to local storage:', error.message);
      const appointments = readData('appointments');
      return res.json(appointments);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update appointments
router.put('/', async (req, res, next) => {
  try {
    writeData('appointments', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create appointment
router.post('/', async (req, res, next) => {
  try {
    const newAppointment = {
      id: req.body.id || `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: req.body.patientName || req.body.name || req.body.fullName || '',
      patientPhone: req.body.patientPhone || req.body.phone || '',
      doctorName: req.body.doctorName || 'General Physician',
      department: req.body.department || 'General Medicine',
      dateTime: req.body.dateTime || req.body.preferredDate || new Date().toLocaleDateString('en-GB'),
      payment: req.body.payment || 'Unpaid',
      status: req.body.status || 'Pending'
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_appointments')
        .insert([newAppointment])
        .select();

      if (!error && data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const appointments = readData('appointments');
    appointments.unshift(newAppointment);
    writeData('appointments', appointments);
    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
});

// PUT update appointment
router.put('/:id', async (req, res, next) => {
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
      id
    };

    writeData('appointments', appointments);

    if (supabase) {
      await supabase
        .from('bv_appointments')
        .update(req.body)
        .eq('id', id);
    }

    res.json(appointments[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE appointment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointments = readData('appointments');
    const filtered = appointments.filter(a => a.id !== id);

    if (appointments.length === filtered.length) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    writeData('appointments', filtered);

    if (supabase) {
      await supabase
        .from('bv_appointments')
        .delete()
        .eq('id', id);
    }

    res.json({ success: true, message: `Appointment ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;

