import express from 'express';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all testimonials
router.get('/', (req, res, next) => {
  try {
    const testimonials = readData('testimonials');
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
});

// PUT bulk update testimonials
router.put('/', (req, res, next) => {
  try {
    writeData('testimonials', req.body);
    res.json(req.body);
  } catch (err) {
    next(err);
  }
});

// POST create testimonial
router.post('/', (req, res, next) => {
  try {
    const testimonials = readData('testimonials');
    const newTestimonial = {
      id: req.body.id || `TST-${Math.floor(200 + Math.random() * 800)}`,
      patientName: req.body.patientName || '',
      disease: req.body.disease || '',
      content: req.body.content || '',
      rating: Number(req.body.rating) || 5,
      status: req.body.status || 'Pending'
    };
    
    testimonials.push(newTestimonial);
    writeData('testimonials', testimonials);
    res.status(201).json(newTestimonial);
  } catch (err) {
    next(err);
  }
});

// PUT update testimonial
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonials = readData('testimonials');
    const index = testimonials.findIndex(t => t.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    testimonials[index] = {
      ...testimonials[index],
      ...req.body,
      id // Prevent ID change
    };
    
    writeData('testimonials', testimonials);
    res.json(testimonials[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE testimonial
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonials = readData('testimonials');
    const filtered = testimonials.filter(t => t.id !== id);
    
    if (testimonials.length === filtered.length) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    writeData('testimonials', filtered);
    res.json({ success: true, message: `Testimonial ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
