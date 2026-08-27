import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all helpdesk tickets
router.get('/', (req, res, next) => {
  try {
    const tickets = readData('helpdesk');
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

// POST create helpdesk ticket
router.post('/', (req, res, next) => {
  try {
    const tickets = readData('helpdesk');
    const newTicket = {
      id: req.body.id || `HD-${Date.now()}`,
      ticketNo: req.body.ticketNo || `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterName: req.body.requesterName || 'Anonymous',
      requesterEmail: req.body.requesterEmail || '',
      category: req.body.category || 'General Inquiry',
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'Pending',
      subject: req.body.subject || '',
      description: req.body.description || '',
      created: req.body.created || new Date().toLocaleString(),
      response: req.body.response || ''
    };

    tickets.unshift(newTicket);
    writeData('helpdesk', tickets);
    res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
});

// PUT update helpdesk ticket
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const tickets = readData('helpdesk');
    const index = tickets.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    tickets[index] = {
      ...tickets[index],
      ...req.body,
      id
    };

    writeData('helpdesk', tickets);
    res.json(tickets[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE helpdesk ticket
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const tickets = readData('helpdesk');
    const filtered = tickets.filter(t => t.id !== id);

    if (tickets.length === filtered.length) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    writeData('helpdesk', filtered);
    res.json({ success: true, message: `Ticket ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
