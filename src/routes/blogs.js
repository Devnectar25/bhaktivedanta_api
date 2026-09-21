import express from 'express';
import { supabase } from '../utils/supabase.js';
import { readData, writeData } from '../utils/storage.js';

const router = express.Router();

// GET all blog posts
router.get('/', async (req, res, next) => {
  try {
    if (!supabase) {
      const blogs = readData('blogs');
      return res.json(blogs);
    }

    const { data, error } = await supabase
      .from('bv_blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase get blogs error, fallback to local storage:', error.message);
      const blogs = readData('blogs');
      return res.json(blogs);
    }

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// GET single blog post by ID or slug
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      const blogs = readData('blogs');
      const found = blogs.find(b => b.id === id || b.slug === id);
      if (!found) return res.status(404).json({ error: 'Blog post not found' });
      return res.json(found);
    }

    const { data, error } = await supabase
      .from('bv_blogs')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (error || !data) {
      const blogs = readData('blogs');
      const found = blogs.find(b => b.id === id || b.slug === id);
      if (!found) return res.status(404).json({ error: 'Blog post not found' });
      return res.json(found);
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST create blog post
router.post('/', async (req, res, next) => {
  try {
    const title = req.body.title || 'Untitled Blog';
    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newBlog = {
      id: req.body.id || `blog-${Date.now()}`,
      title,
      slug,
      category: req.body.category || 'General Health',
      author: req.body.author || 'Admin Team',
      authorRole: req.body.authorRole || 'Contributor',
      date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: req.body.readTime || '5 min read',
      image: req.body.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      summary: req.body.summary || '',
      content: req.body.content || '',
      tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : ['Health']),
      status: req.body.status || 'Published',
      views: req.body.views || 0,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('bv_blogs')
        .insert([newBlog])
        .select();

      if (error) {
        console.error('Supabase blog insert error:', error.message);
      } else if (data && data.length > 0) {
        // Also sync local storage
        const local = readData('blogs');
        local.unshift(data[0]);
        writeData('blogs', local);
        return res.status(201).json(data[0]);
      }
    }

    const blogs = readData('blogs');
    blogs.unshift(newBlog);
    writeData('blogs', blogs);
    res.status(201).json(newBlog);
  } catch (err) {
    next(err);
  }
});

// PUT update blog post
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogs = readData('blogs');
    const index = blogs.findIndex(b => b.id === id);

    const title = req.body.title;
    const slug = req.body.slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined);

    const updatePayload = {
      ...req.body,
      ...(slug ? { slug } : {})
    };

    if (index !== -1) {
      blogs[index] = {
        ...blogs[index],
        ...updatePayload,
        id
      };
      writeData('blogs', blogs);
    }

    if (supabase) {
      const { error } = await supabase
        .from('bv_blogs')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        console.error('Supabase blog update error:', error.message);
      }
    }

    res.json(blogs[index] || updatePayload);
  } catch (err) {
    next(err);
  }
});

// DELETE blog post
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogs = readData('blogs');
    const filtered = blogs.filter(b => b.id !== id);

    writeData('blogs', filtered);

    if (supabase) {
      const { error } = await supabase
        .from('bv_blogs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase blog delete error:', error.message);
      }
    }

    res.json({ success: true, message: `Blog post ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
