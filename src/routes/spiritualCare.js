import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

/**
 * Helper to retrieve current spiritual care state
 */
async function getCurrentState() {
  const state = readData('spiritual_care_state');
  if (state && typeof state === 'object' && Array.isArray(state.sections)) {
    return state;
  }
  return null;
}

/**
 * Helper to persist full spiritual care state
 */
async function saveFullState(state) {
  writeData('spiritual_care_state', state);
  return state;
}

// ----------------------------------------------------
// 1. GET FULL SPIRITUAL CARE STATE
// ----------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const state = await getCurrentState();
    if (!state) {
      return res.json({ success: true, data: null });
    }
    res.json(state);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 2. PUT / UPDATE FULL SPIRITUAL CARE STATE
// ----------------------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const updatedState = req.body;
    if (!updatedState || typeof updatedState !== 'object') {
      return res.status(400).json({ error: 'Invalid spiritual care state payload' });
    }

    await saveFullState(updatedState);
    res.json({
      success: true,
      message: 'Spiritual care state updated successfully',
      data: updatedState
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 3. POST NEW SECTION
// ----------------------------------------------------
router.post('/sections', async (req, res, next) => {
  try {
    const state = (await getCurrentState()) || { sections: [] };
    const newSection = req.body;

    if (!newSection || !newSection.title) {
      return res.status(400).json({ error: 'Section title is required' });
    }

    if (!newSection.id) {
      newSection.id = newSection.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    state.sections.push(newSection);
    await saveFullState(state);

    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      section: newSection,
      sections: state.sections
    });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------
// 4. DELETE SECTION
// ----------------------------------------------------
router.delete('/sections/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = (await getCurrentState()) || { sections: [] };

    state.sections = state.sections.filter(s => s.id !== id);
    await saveFullState(state);

    res.json({
      success: true,
      message: `Section ${id} deleted successfully`,
      sections: state.sections
    });
  } catch (err) {
    next(err);
  }
});

export default router;
