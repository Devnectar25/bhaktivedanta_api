import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';
import * as seeds from '../utils/seeds.js';

const router = express.Router();

const CATEGORY_MAP = {
  appointment: 'Appointments & OPD',
  admission: 'Admission & Inpatient',
  insurance: 'Insurance & TPA',
  emergency: 'Emergency & Diagnostics',
  spiritual: 'Spiritual Care & Visitors'
};

function getLocalFaqs() {
  const data = readData('faqs');
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  return seeds.defaultFaqs || [];
}

// GET /api/faqs - Retrieve all FAQs
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let faqs = getLocalFaqs();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bv_faqs')
          .select('*')
          .order('order', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          faqs = data.map(item => ({
            id: item.id,
            category: item.category,
            categoryLabel: item.category_label || CATEGORY_MAP[item.category] || 'General',
            question: item.question,
            answer: item.answer,
            order: item.order || 1,
            status: item.status || 'Active',
            updatedAt: item.updated_at || new Date().toISOString()
          }));
        }
      } catch (sbErr) {
        // Fallback gracefully to local storage
      }
    }

    if (category && category !== 'all') {
      faqs = faqs.filter(f => f.category === category);
    }

    if (search) {
      const q = String(search).toLowerCase().trim();
      faqs = faqs.filter(f =>
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q) ||
        f.categoryLabel?.toLowerCase().includes(q)
      );
    }

    // Sort by order
    faqs.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

    return res.json(faqs);
  } catch (err) {
    next(err);
  }
});

// POST /api/faqs - Create a new FAQ
router.post('/', async (req, res, next) => {
  try {
    const { question, answer, category, categoryLabel, status = 'Active', order } = req.body || {};

    if (!question || !answer) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Question and answer are required'
      });
    }

    const currentFaqs = getLocalFaqs();
    const newId = `faq-${Date.now()}`;
    const cleanCategory = category || 'appointment';
    const cleanLabel = categoryLabel || CATEGORY_MAP[cleanCategory] || 'Appointments & OPD';
    const newOrder = order !== undefined ? Number(order) : currentFaqs.length + 1;

    const newFaq = {
      id: newId,
      category: cleanCategory,
      categoryLabel: cleanLabel,
      question: question.trim(),
      answer: answer.trim(),
      order: newOrder,
      status: status || 'Active',
      updatedAt: new Date().toISOString()
    };

    const updated = [...currentFaqs, newFaq];
    writeData('faqs', updated);

    // Sync to Supabase if available
    if (supabase) {
      try {
        await supabase.from('bv_faqs').upsert({
          id: newFaq.id,
          category: newFaq.category,
          category_label: newFaq.categoryLabel,
          question: newFaq.question,
          answer: newFaq.answer,
          order: newFaq.order,
          status: newFaq.status,
          updated_at: newFaq.updatedAt
        }, { onConflict: 'id' });
      } catch (e) { }
    }

    console.log(`[API FAQs] Created FAQ "${newFaq.id}":`, newFaq.question);
    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faq: newFaq
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/faqs/:id - Retrieve a single FAQ
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentFaqs = getLocalFaqs();
    const faq = currentFaqs.find(f => String(f.id) === String(id));

    if (!faq) {
      return res.status(404).json({ error: 'Not Found', message: `FAQ with ID ${id} not found` });
    }

    return res.json(faq);
  } catch (err) {
    next(err);
  }
});

// PUT /api/faqs/:id - Update an FAQ
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer, category, categoryLabel, status, order } = req.body || {};

    const currentFaqs = getLocalFaqs();
    const idx = currentFaqs.findIndex(f => String(f.id) === String(id));

    if (idx === -1) {
      return res.status(404).json({ error: 'Not Found', message: `FAQ with ID ${id} not found` });
    }

    const existing = currentFaqs[idx];
    const cleanCategory = category !== undefined ? category : existing.category;
    const cleanLabel = categoryLabel !== undefined ? categoryLabel : (CATEGORY_MAP[cleanCategory] || existing.categoryLabel);

    const updatedFaq = {
      ...existing,
      ...(question !== undefined ? { question: question.trim() } : {}),
      ...(answer !== undefined ? { answer: answer.trim() } : {}),
      category: cleanCategory,
      categoryLabel: cleanLabel,
      ...(status !== undefined ? { status } : {}),
      ...(order !== undefined ? { order: Number(order) } : {}),
      updatedAt: new Date().toISOString()
    };

    currentFaqs[idx] = updatedFaq;
    writeData('faqs', currentFaqs);

    // Sync to Supabase
    if (supabase) {
      try {
        await supabase.from('bv_faqs').upsert({
          id: updatedFaq.id,
          category: updatedFaq.category,
          category_label: updatedFaq.categoryLabel,
          question: updatedFaq.question,
          answer: updatedFaq.answer,
          order: updatedFaq.order,
          status: updatedFaq.status,
          updated_at: updatedFaq.updatedAt
        }, { onConflict: 'id' });
      } catch (e) { }
    }

    console.log(`[API FAQs] Updated FAQ "${id}"`);
    return res.json({
      success: true,
      message: 'FAQ updated successfully',
      faq: updatedFaq
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/faqs/:id - Delete an FAQ
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentFaqs = getLocalFaqs();
    const updated = currentFaqs.filter(f => String(f.id) !== String(id));

    if (updated.length === currentFaqs.length) {
      return res.status(404).json({ error: 'Not Found', message: `FAQ with ID ${id} not found` });
    }

    writeData('faqs', updated);

    if (supabase) {
      try {
        await supabase.from('bv_faqs').delete().eq('id', id);
      } catch (e) { }
    }

    console.log(`[API FAQs] Deleted FAQ "${id}"`);
    return res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/faqs/reset - Reset to default FAQs
router.post('/reset', async (req, res, next) => {
  try {
    const defaults = (seeds.defaultFaqs || []).map(f => ({
      ...f,
      updatedAt: new Date().toISOString()
    }));
    writeData('faqs', defaults);
    return res.json({
      success: true,
      message: 'FAQs reset to default successfully',
      faqs: defaults
    });
  } catch (err) {
    next(err);
  }
});

export default router;
