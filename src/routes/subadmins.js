import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all sub-admins
router.get('/', (req, res, next) => {
  try {
    const subadmins = readData('subadmins');
    res.json(subadmins);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update sub-admins
router.put('/', (req, res, next) => {
  try {
    writeData('subadmins', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create sub-admin
router.post('/', (req, res, next) => {
  try {
    const subadmins = readData('subadmins');
    
    // Check if username already exists
    const username = req.body.username;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    if (subadmins.some(s => s.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const newSubAdmin = {
      username,
      email: req.body.email || '',
      role: req.body.role || 'Administration',
      status: req.body.status || 'Active',
      created: req.body.created || new Date().toLocaleDateString()
    };
    
    subadmins.push(newSubAdmin);
    writeData('subadmins', subadmins);
    res.status(201).json(newSubAdmin);
  } catch (err) {
    next(err);
  }
});

// PUT update sub-admin
router.put('/:username', (req, res, next) => {
  try {
    const { username } = req.params;
    const subadmins = readData('subadmins');
    const index = subadmins.findIndex(s => s.username.toLowerCase() === username.toLowerCase());
    
    if (index === -1) {
      return res.status(404).json({ error: 'Sub-admin not found' });
    }
    
    subadmins[index] = {
      ...subadmins[index],
      ...req.body,
      username // Prevent username change
    };
    
    writeData('subadmins', subadmins);
    res.json(subadmins[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE sub-admin
router.delete('/:username', (req, res, next) => {
  try {
    const { username } = req.params;
    const subadmins = readData('subadmins');
    const filtered = subadmins.filter(s => s.username.toLowerCase() !== username.toLowerCase());
    
    if (subadmins.length === filtered.length) {
      return res.status(404).json({ error: 'Sub-admin not found' });
    }
    
    writeData('subadmins', filtered);
    res.json({ success: true, message: `Sub-admin ${username} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
