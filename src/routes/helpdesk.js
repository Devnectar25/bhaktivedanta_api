import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all tickets
// Helper to normalize ticket object for frontend and database compatibility
const normalizeTicket = (t) => {
  if (!t) return t;
  const subject = t.subject || t.ticketSubject || '';
  const description = t.description || t.ticketDescription || '';
  const requesterName = t.requesterName || t.submittedBy || 'Anonymous';
  const requesterEmail = t.requesterEmail || t.submittedEmail || '';
  const ticketNo = t.ticketNo || t.id || '';
  const status = t.status || 'Pending';
  const priority = t.priority || 'Medium';
  const category = t.category || 'General Support';
  const created = t.created || (t.created_at ? new Date(t.created_at).toLocaleString() : new Date().toLocaleString());

  return {
    ...t,
    id: t.id || ticketNo,
    ticketNo,
    subject,
    ticketSubject: subject,
    description,
    ticketDescription: description,
    requesterName,
    submittedBy: requesterName,
    requesterEmail,
    submittedEmail: requesterEmail,
    status,
    priority,
    category,
    created
  };
};

// GET all tickets
router.get('/', async (req, res, next) => {
  try {
    let tickets = [];
    if (!supabase) {
      tickets = readData('helpdesk') || [];
      return res.json(tickets.map(normalizeTicket));
    }

    const { data, error } = await supabase
      .from('bv_helpdesk')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get helpdesk error, fallback to local storage:', error.message);
      tickets = readData('helpdesk') || [];
      return res.json(tickets.map(normalizeTicket));
    }

    const result = (data || []).map(normalizeTicket);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update tickets
router.put('/', async (req, res, next) => {
  try {
    const list = Array.isArray(req.body) ? req.body.map(normalizeTicket) : req.body;
    writeData('helpdesk', list);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// POST create ticket
router.post('/', async (req, res, next) => {
  try {
    const subject = req.body.subject || req.body.ticketSubject || '';
    const description = req.body.description || req.body.ticketDescription || '';
    const requesterName = req.body.requesterName || req.body.submittedBy || 'Anonymous';
    const requesterEmail = req.body.requesterEmail || req.body.submittedEmail || '';
    const ticketNo = req.body.ticketNo || `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: req.body.id || `TK-${Math.floor(100 + Math.random() * 900)}`,
      ticketSubject: subject,
      ticketDescription: description,
      submittedBy: requesterName,
      submittedEmail: requesterEmail,
      status: req.body.status || 'Pending',
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
        return res.status(201).json(normalizeTicket({ ...data[0], ticketNo, subject, description, requesterName, requesterEmail }));
      }
    }

    const helpdesk = readData('helpdesk') || [];
    const normalized = normalizeTicket({ ...newTicket, ticketNo, subject, description, requesterName, requesterEmail });
    helpdesk.unshift(normalized);
    writeData('helpdesk', helpdesk);
    res.status(201).json(normalized);
  } catch (err) {
    next(err);
  }
});

// PUT update ticket
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = req.body.subject || req.body.ticketSubject || '';
    const description = req.body.description || req.body.ticketDescription || '';
    const requesterName = req.body.requesterName || req.body.submittedBy || 'Anonymous';
    const requesterEmail = req.body.requesterEmail || req.body.submittedEmail || '';

    const updateData = {
      ticketSubject: subject,
      ticketDescription: description,
      submittedBy: requesterName,
      submittedEmail: requesterEmail,
      status: req.body.status,
      priority: req.body.priority
    };

    const helpdesk = readData('helpdesk') || [];
    const index = helpdesk.findIndex(h => h.id === id);

    if (index !== -1) {
      helpdesk[index] = normalizeTicket({
        ...helpdesk[index],
        ...req.body,
        id
      });
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

    res.json(helpdesk[index] ? normalizeTicket(helpdesk[index]) : normalizeTicket({ ...updateData, id, ...req.body }));
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
