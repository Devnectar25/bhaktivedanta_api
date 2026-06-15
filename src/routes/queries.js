import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all queries
router.get('/', (req, res, next) => {
  try {
    const queries = readData('queries');
    res.json(queries);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update queries
router.put('/', (req, res, next) => {
  try {
    writeData('queries', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create query
router.post('/', (req, res, next) => {
  try {
    const queries = readData('queries');
    const newQuery = {
      id: req.body.id || `QRY-${Math.floor(500 + Math.random() * 500)}`,
      name: req.body.name || '',
      email: req.body.email || '',
      subject: req.body.subject || '',
      message: req.body.message || '',
      date: req.body.date || new Date().toLocaleDateString(),
      status: req.body.status || 'Pending'
    };
    
    queries.push(newQuery);
    writeData('queries', queries);
    res.status(201).json(newQuery);
  } catch (err) {
    next(err);
  }
});

// PUT update query
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const queries = readData('queries');
    const index = queries.findIndex(q => q.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    queries[index] = {
      ...queries[index],
      ...req.body,
      id // Prevent ID change
    };
    
    writeData('queries', queries);
    res.json(queries[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE query
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const queries = readData('queries');
    const filtered = queries.filter(q => q.id !== id);
    
    if (queries.length === filtered.length) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    writeData('queries', filtered);
    res.json({ success: true, message: `Query ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
