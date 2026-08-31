import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all tickets
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const helpdesk = readData('helpdesk');
      return res.json(helpdesk);
    }

    const { data, error } = await supabase
      .from('bv_helpdesk')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get helpdesk error, fallback to local storage:', error.message);
      const helpdesk = readData('helpdesk');
      return res.json(helpdesk);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update tickets
router.put('/', async (req, res, next) => {
  try {
    writeData('helpdesk', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create ticket
router.post('/', async (req, res, next) => {
  try {
    const newTicket = {
      id: req.body.id || `TK-${Math.floor(100 + Math.random() * 900)}`,
      ticketSubject: req.body.ticketSubject || '',
      ticketDescription: req.body.ticketDescription || '',
      submittedBy: req.body.submittedBy || '',
      submittedEmail: req.body.submittedEmail || '',
      status: req.body.status || 'Open',
      priority: req.body.priority || 'Medium'
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_helpdesk')
        .insert([newTicket])
        .select();

      if (error) {
        console.error('Supabase helpdesk insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const helpdesk = readData('helpdesk');
    helpdesk.unshift(newTicket);
    writeData('helpdesk', helpdesk);
    res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
});

// PUT update ticket
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ticketSubject: req.body.ticketSubject,
      ticketDescription: req.body.ticketDescription,
      submittedBy: req.body.submittedBy,
      submittedEmail: req.body.submittedEmail,
      status: req.body.status,
      priority: req.body.priority
    };

    const helpdesk = readData('helpdesk');
    const index = helpdesk.findIndex(h => h.id === id);

    if (index !== -1) {
      helpdesk[index] = {
        ...helpdesk[index],
        ...req.body,
        id
      };
      writeData('helpdesk', helpdesk);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_helpdesk')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase ticket update error:', error.message);
      }
    }

    res.json(helpdesk[index] || req.body);
  } catch (err) {
    next(err);
  }
});

// DELETE ticket
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const helpdesk = readData('helpdesk');
    const filtered = helpdesk.filter(h => h.id !== id);

    writeData('helpdesk', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_helpdesk')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase ticket delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Ticket ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
