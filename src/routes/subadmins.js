import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all sub-admins
router.get('/', async (req, res, next) => {
  try {
    const localSubadmins = readData('subadmins') || [];

    if (!supabase) {
      return res.json(localSubadmins);
    }

    const { data: dbData, error } = await supabase
      .from('bv_subadmins')
      .select('*')
      .order('username', { ascending: true });

    if (error) {
      console.error('Supabase get subadmins error, fallback to local storage:', error.message);
      return res.json(localSubadmins);
    }

    // Merge Supabase records with local storage records to preserve passwords & creation dates
    const mergedMap = new Map();

    // 1. First populate map with local records
    localSubadmins.forEach(item => {
      if (item && item.username) {
        mergedMap.set(item.username.toLowerCase(), item);
      }
    });

    // 2. Merge with Supabase DB records
    (dbData || []).forEach(dbItem => {
      if (!dbItem || !dbItem.username) return;
      const key = dbItem.username.toLowerCase();
      const localItem = mergedMap.get(key) || {};

      mergedMap.set(key, {
        username: dbItem.username,
        email: dbItem.email || localItem.email || '',
        role: dbItem.role || localItem.role || 'Administrator',
        status: dbItem.status || localItem.status || 'Active',
        created: localItem.created || (dbItem.created_at ? new Date(dbItem.created_at).toLocaleDateString() : 'Recent'),
        password: localItem.password || 'Password123'
      });
    });

    const result = Array.from(mergedMap.values());
    res.json(result);
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

    const cleanUser = username.trim();
    const newSubAdmin = {
      username: cleanUser,
      password: (req.body.password || 'Password123').trim(),
      name: (req.body.name || cleanUser).trim(),
      email: (req.body.email || '').trim(),
      role: req.body.role || 'Administrator',
      status: req.body.status || 'Active',
      created: req.body.created || new Date().toLocaleDateString()
    };

    // Save to local storage first
    const subadmins = readData('subadmins') || [];
    const existingIndex = subadmins.findIndex(s => s.username.toLowerCase() === cleanUser.toLowerCase());
    if (existingIndex !== -1) {
      subadmins[existingIndex] = { ...subadmins[existingIndex], ...newSubAdmin };
    } else {
      subadmins.push(newSubAdmin);
    }
    writeData('subadmins', subadmins);

    // Save to Supabase (using valid columns: username, email, role, status, name)
    if (supabase) {
      const dbPayload = {
        username: newSubAdmin.username,
        email: newSubAdmin.email,
        role: newSubAdmin.role,
        status: newSubAdmin.status,
        name: newSubAdmin.name
      };

      const { data, error } = await supabase
        .from('bv_subadmins')
        .upsert([dbPayload], { onConflict: 'username' })
        .select();

      if (error) {
        console.error('Supabase subadmins insert/upsert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json({ ...data[0], password: newSubAdmin.password, created: newSubAdmin.created });
      }
    }

    res.status(201).json(newSubAdmin);
  } catch (err) {
    next(err);
  }
});

// PUT update sub-admin
router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const cleanUser = username.trim();
    const updateData = { ...req.body };

    const subadmins = readData('subadmins') || [];
    const index = subadmins.findIndex(s => s.username.toLowerCase() === cleanUser.toLowerCase());

    if (index !== -1) {
      subadmins[index] = {
        ...subadmins[index],
        ...updateData,
        username: cleanUser
      };
      writeData('subadmins', subadmins);
    }

    if (supabase) {
      const dbPayload = {};
      if (updateData.email !== undefined) dbPayload.email = updateData.email;
      if (updateData.role !== undefined) dbPayload.role = updateData.role;
      if (updateData.status !== undefined) dbPayload.status = updateData.status;
      if (updateData.name !== undefined) dbPayload.name = updateData.name;

      if (Object.keys(dbPayload).length > 0) {
        const { error } = await supabase
          .from('bv_subadmins')
          .update(dbPayload)
          .eq('username', cleanUser);

        if (error) {
          console.error('Supabase subadmin update error:', error.message);
        }
      }
    }

    res.json(subadmins[index] || { username: cleanUser, ...updateData });
  } catch (err) {
    next(err);
  }
});

// DELETE sub-admin
router.delete('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const cleanUser = username.trim();
    const subadmins = readData('subadmins') || [];
    const filtered = subadmins.filter(s => s.username.toLowerCase() !== cleanUser.toLowerCase());

    writeData('subadmins', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_subadmins')
        .delete()
        .eq('username', cleanUser);

      if (error) {
        console.error('Supabase subadmin delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Sub-admin ${cleanUser} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
