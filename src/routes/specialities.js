import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET specialities state
router.get('/', (req, res, next) => {
  try {
    const state = readData('specialities_state');
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// PUT update specialities state
router.put('/', (req, res, next) => {
  try {
    writeData('specialities_state', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

export default router;
