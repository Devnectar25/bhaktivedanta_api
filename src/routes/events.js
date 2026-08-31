import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all events
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const events = readData('events');
      return res.json(events);
    }

    const { data, error } = await supabase
      .from('bv_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get events error, fallback to local storage:', error.message);
      const events = readData('events');
      return res.json(events);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update events
router.put('/', async (req, res, next) => {
  try {
    writeData('events', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create event
router.post('/', async (req, res, next) => {
  try {
    const newEvent = {
      id: req.body.id || `EVT-${Math.floor(100 + Math.random() * 900)}`,
      title: req.body.title || '',
      date: req.body.date || '',
      time: req.body.time || '',
      location: req.body.location || '',
      description: req.body.description || '',
      image: req.body.image || '',
      status: req.body.status || 'Upcoming'
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_events')
        .insert([newEvent])
        .select();

      if (error) {
        console.error('Supabase events insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const events = readData('events');
    events.push(newEvent);
    writeData('events', events);
    res.status(201).json(newEvent);
  } catch (err) {
    next(err);
  }
});

// PUT update event
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      status: req.body.status
    };

    const events = readData('events');
    const index = events.findIndex(e => e.id === id);

    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...req.body,
        id
      };
      writeData('events', events);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_events')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase event update error:', error.message);
      }
    }

    res.json(events[index] || req.body);
  } catch (err) {
    next(err);
  }
});

// DELETE event
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const events = readData('events');
    const filtered = events.filter(e => e.id !== id);

    writeData('events', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase event delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Event ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
