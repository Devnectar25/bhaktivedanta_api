import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all events
router.get('/', (req, res, next) => {
  try {
    const events = readData('events');
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update events
router.put('/', (req, res, next) => {
  try {
    writeData('events', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create event
router.post('/', (req, res, next) => {
  try {
    const events = readData('events');
    const newEvent = {
      id: req.body.id || `EVT-${Math.floor(100 + Math.random() * 900)}`,
      title: req.body.title || '',
      date: req.body.date || '',
      time: req.body.time || '',
      venue: req.body.venue || '',
      status: req.body.status || 'Upcoming',
      description: req.body.description || ''
    };
    
    events.push(newEvent);
    writeData('events', events);
    res.status(201).json(newEvent);
  } catch (err) {
    next(err);
  }
});

// PUT update event
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const events = readData('events');
    const index = events.findIndex(e => e.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    events[index] = {
      ...events[index],
      ...req.body,
      id // Prevent ID change
    };
    
    writeData('events', events);
    res.json(events[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE event
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const events = readData('events');
    const filtered = events.filter(e => e.id !== id);
    
    if (events.length === filtered.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    writeData('events', filtered);
    res.json({ success: true, message: `Event ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
