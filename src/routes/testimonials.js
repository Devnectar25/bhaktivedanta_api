import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const testimonials = readData('testimonials');
      return res.json(testimonials);
    }

    const { data, error } = await supabase
      .from('bv_testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get testimonials error, fallback to local storage:', error.message);
      const testimonials = readData('testimonials');
      return res.json(testimonials);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update testimonials
router.put('/', async (req, res, next) => {
  try {
    writeData('testimonials', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create testimonial
router.post('/', async (req, res, next) => {
  try {
    const newTestimonial = {
      id: req.body.id || `TST-${Math.floor(200 + Math.random() * 800)}`,
      patientName: req.body.patientName || '',
      disease: req.body.disease || '',
      content: req.body.content || '',
      rating: Number(req.body.rating) || 5,
      status: req.body.status || 'Pending'
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_testimonials')
        .insert([newTestimonial])
        .select();

      if (error) {
        console.error('Supabase testimonials insert error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const testimonials = readData('testimonials');
    testimonials.push(newTestimonial);
    writeData('testimonials', testimonials);
    res.status(201).json(newTestimonial);
  } catch (err) {
    next(err);
  }
});

// PUT update testimonial
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      patientName: req.body.patientName,
      disease: req.body.disease,
      content: req.body.content,
      rating: Number(req.body.rating),
      status: req.body.status
    };

    const testimonials = readData('testimonials');
    const index = testimonials.findIndex(t => t.id === id);

    if (index !== -1) {
      testimonials[index] = {
        ...testimonials[index],
        ...req.body,
        id
      };
      writeData('testimonials', testimonials);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_testimonials')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase testimonial update error:', error.message);
      }
    }

    res.json(testimonials[index] || req.body);
  } catch (err) {
    next(err);
  }
});

// DELETE testimonial
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonials = readData('testimonials');
    const filtered = testimonials.filter(t => t.id !== id);

    writeData('testimonials', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase testimonial delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Testimonial ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
