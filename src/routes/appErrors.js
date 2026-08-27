import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all application error logs
router.get('/', (req, res, next) => {
  try {
    const appErrors = readData('app_errors');
    res.json(appErrors);
  } catch (err) {
    next(err);
  }
});

// POST record new application error
router.post('/', (req, res, next) => {
  try {
    const appErrors = readData('app_errors');
    const newError = {
      id: req.body.id || `ERR-${Date.now()}`,
      timestamp: req.body.timestamp || new Date().toLocaleString(),
      level: req.body.level || 'Error',
      source: req.body.source || 'Client Web App',
      message: req.body.message || 'Unhandled error exception',
      endpoint: req.body.endpoint || '',
      status: req.body.status || 'Investigating',
      details: req.body.details || ''
    };

    appErrors.unshift(newError);
    writeData('app_errors', appErrors);
    res.status(201).json(newError);
  } catch (err) {
    next(err);
  }
});

// PUT update error log status
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const appErrors = readData('app_errors');
    const index = appErrors.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Error log entry not found' });
    }

    appErrors[index] = {
      ...appErrors[index],
      ...req.body,
      id
    };

    writeData('app_errors', appErrors);
    res.json(appErrors[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE clear all error logs or single error log
router.delete('/', (req, res, next) => {
  try {
    const { id } = req.query;
    if (id) {
      const appErrors = readData('app_errors');
      const filtered = appErrors.filter(e => e.id !== id);
      writeData('app_errors', filtered);
      return res.json({ success: true, message: `Error log ${id} deleted` });
    }

    writeData('app_errors', []);
    res.json({ success: true, message: 'All application error logs cleared' });
  } catch (err) {
    next(err);
  }
});

export default router;
