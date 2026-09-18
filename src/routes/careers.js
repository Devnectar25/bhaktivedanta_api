import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// ==========================================
// 1. JOB OPENINGS / POSTINGS ENDPOINTS
// ==========================================

// GET all job openings (optionally filter by status or category)
router.get('/jobs', async (req, res, next) => {
  try {
    const { status, category } = req.query;

    if (!supabase) {
      let jobs = readData('career_jobs') || [];
      if (status) jobs = jobs.filter(j => j.status?.toLowerCase() === status.toLowerCase());
      if (category) jobs = jobs.filter(j => j.category?.toLowerCase() === category.toLowerCase());
      return res.json(jobs);
    }

    let query = supabase.from('bv_career_jobs').select('*');
    if (status) query = query.ilike('status', status);
    if (category) query = query.ilike('category', category);
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase get career jobs error, fallback to storage:', error.message);
      let jobs = readData('career_jobs') || [];
      if (status) jobs = jobs.filter(j => j.status?.toLowerCase() === status.toLowerCase());
      if (category) jobs = jobs.filter(j => j.category?.toLowerCase() === category.toLowerCase());
      return res.json(jobs);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST create new job opening
router.post('/jobs', async (req, res, next) => {
  try {
    const newJob = {
      id: req.body.id || `JOB-${Date.now().toString().slice(-4)}`,
      category: req.body.category || 'Consultant Vacancy',
      title: req.body.title || '',
      department: req.body.department || '',
      positions: req.body.positions || '01',
      qualification: req.body.qualification || '',
      experience: req.body.experience || '',
      location: req.body.location || 'Mira Road, Mumbai',
      status: req.body.status || 'Active',
      description: req.body.description || '',
      postedDate: req.body.postedDate || new Date().toISOString().split('T')[0]
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_career_jobs')
        .insert([newJob])
        .select();

      if (error) {
        console.warn('Supabase insert career job error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const jobs = readData('career_jobs') || [];
    jobs.unshift(newJob);
    writeData('career_jobs', jobs);
    res.status(201).json(newJob);
  } catch (err) {
    next(err);
  }
});

// PUT update existing job opening
router.put('/jobs/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      category: req.body.category,
      title: req.body.title,
      department: req.body.department,
      positions: req.body.positions,
      qualification: req.body.qualification,
      experience: req.body.experience,
      location: req.body.location,
      status: req.body.status,
      description: req.body.description
    };

    const jobs = readData('career_jobs') || [];
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updateData, id };
      writeData('career_jobs', jobs);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_career_jobs')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.warn('Supabase update career job error:', error.message);
      }
    }

    res.json(jobs[index] || { id, ...updateData });
  } catch (err) {
    next(err);
  }
});

// DELETE job opening
router.delete('/jobs/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobs = readData('career_jobs') || [];
    const filtered = jobs.filter(j => j.id !== id);
    writeData('career_jobs', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_career_jobs')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete career job error:', error.message);
      }
    }

    res.json({ success: true, message: `Job opening ${id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
});


// ==========================================
// 2. CANDIDATE APPLICATIONS ENDPOINTS
// ==========================================

// GET all candidate applications (supports status and jobId filters)
router.get('/applications', async (req, res, next) => {
  try {
    const { status, jobId } = req.query;

    if (!supabase) {
      let apps = readData('career_applications') || [];
      if (status && status !== 'All') apps = apps.filter(a => a.status?.toLowerCase() === status.toLowerCase());
      if (jobId && jobId !== 'All') apps = apps.filter(a => a.jobId === jobId);
      return res.json(apps);
    }

    let query = supabase.from('bv_career_applications').select('*');
    if (status && status !== 'All') query = query.ilike('status', status);
    if (jobId && jobId !== 'All') query = query.eq('jobId', jobId);
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase get career applications error, fallback to storage:', error.message);
      let apps = readData('career_applications') || [];
      if (status && status !== 'All') apps = apps.filter(a => a.status?.toLowerCase() === status.toLowerCase());
      if (jobId && jobId !== 'All') apps = apps.filter(a => a.jobId === jobId);
      return res.json(apps);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST submit candidate application
router.post('/applications', async (req, res, next) => {
  try {
    const {
      jobId,
      position,
      fullName,
      email,
      phone,
      qualification,
      experience,
      currentCtc,
      expectedCtc,
      noticePeriod,
      city,
      resumeUrl,
      resumeName,
      coverNote
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required applicant details (fullName, email, phone).' });
    }

    const applicationNo = `BVH-APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApplication = {
      id: req.body.id || applicationNo,
      jobId: jobId || 'GENERAL',
      position: position || 'General Medical Vacancy',
      fullName,
      email,
      phone,
      qualification: qualification || 'Not specified',
      experience: experience || 'Not specified',
      currentCtc: currentCtc || 'Negotiable',
      expectedCtc: expectedCtc || 'As per hospital norms',
      noticePeriod: noticePeriod || 'Immediate',
      city: city || 'Mumbai',
      resumeUrl: resumeUrl || '',
      resumeName: resumeName || 'Applicant_Resume.pdf',
      coverNote: coverNote || '',
      status: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      hrNotes: ''
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_career_applications')
        .insert([newApplication])
        .select();

      if (error) {
        console.warn('Supabase insert career application error:', error.message);
      } else if (data && data.length > 0) {
        return res.status(201).json(data[0]);
      }
    }

    const apps = readData('career_applications') || [];
    apps.unshift(newApplication);
    writeData('career_applications', apps);
    res.status(201).json(newApplication);
  } catch (err) {
    next(err);
  }
});

// PUT update candidate application status / notes
router.put('/applications/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, hrNotes } = req.body;

    const apps = readData('career_applications') || [];
    const index = apps.findIndex(a => a.id === id);
    if (index !== -1) {
      apps[index] = {
        ...apps[index],
        status: status || apps[index].status,
        hrNotes: hrNotes !== undefined ? hrNotes : apps[index].hrNotes,
        updatedDate: new Date().toISOString()
      };
      writeData('career_applications', apps);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_career_applications')
        .update({ status, hrNotes, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.warn('Supabase update career application error:', error.message);
      }
    }

    res.json(apps[index] || { id, status, hrNotes });
  } catch (err) {
    next(err);
  }
});

// DELETE candidate application
router.delete('/applications/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const apps = readData('career_applications') || [];
    const filtered = apps.filter(a => a.id !== id);
    writeData('career_applications', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_career_applications')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete career application error:', error.message);
      }
    }

    res.json({ success: true, message: `Application ${id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
});

export default router;
