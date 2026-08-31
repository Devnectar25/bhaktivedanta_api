import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all sub-admins
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const subadmins = readData('subadmins');
      return res.json(subadmins);
    }

    const { data, error } = await supabase
      .from('bv_subadmins')
      .select('*')
      .order('username', { ascending: true });

    if (error) {
      console.error('Supabase get subadmins error, fallback to local storage:', error.message);
      const subadmins = readData('subadmins');
      return res.json(subadmins);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update sub-admins
router.put('/', async (req, res, next) => {
  try {
    writeData('subadmins', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create sub-admin
router.post('/', async (req, res, next) => {
  try {
    const username = req.body.username;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const newSubAdmin = {
      username,
      name: req.body.name || '',
      email: req.body.email || '',
      role: req.body.role || 'Administration',
      status: req.body.status || 'Active',
      created: req.body.created || new Date().toLocaleDateString()
    };

    if (supabase) {
      const { data: existing } = await supabase
        .from('bv_subadmins')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existing) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const { data, error } = await supabase
        .from('bv_subadmins')
        .insert([newSubAdmin])
        .select();

      if (error) {
        console.error('Supabase subadmins insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const subadmins = readData('subadmins');
    if (subadmins.some(s => s.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    subadmins.push(newSubAdmin);
    writeData('subadmins', subadmins);
    res.status(201).json(newSubAdmin);
  } catch (err) {
    next(err);
  }
});

// PUT update sub-admin
router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      status: req.body.status
    };

    const subadmins = readData('subadmins');
    const index = subadmins.findIndex(s => s.username.toLowerCase() === username.toLowerCase());

    if (index !== -1) {
      subadmins[index] = {
        ...subadmins[index],
        ...req.body,
        username
      };
      writeData('subadmins', subadmins);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_subadmins')
        .update(updateData)
        .eq('username', username);

      if (error) {
        console.error('Supabase subadmin update error:', error.message);
      }
    }

    res.json(subadmins[index] || req.body);
  } catch (err) {
    next(err);
  }
});

// DELETE sub-admin
router.delete('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const subadmins = readData('subadmins');
    const filtered = subadmins.filter(s => s.username.toLowerCase() !== username.toLowerCase());

    writeData('subadmins', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_subadmins')
        .delete()
        .eq('username', username);

      if (error) {
        console.error('Supabase subadmin delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Sub-admin ${username} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
