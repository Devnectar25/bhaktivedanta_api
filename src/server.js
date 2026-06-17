import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './utils/storage.js';


// Routers
import doctorsRouter from './routes/doctors.js';
import appointmentsRouter from './routes/appointments.js';
import specialitiesRouter from './routes/specialities.js';
import eventsRouter from './routes/events.js';
import testimonialsRouter from './routes/testimonials.js';
import newsRouter from './routes/news.js';
import galleryRouter from './routes/gallery.js';
import queriesRouter from './routes/queries.js';
import subadminsRouter from './routes/subadmins.js';

// Load Environment Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize JSON database storage & seeding
initializeDatabase();


// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Bhaktivedanta Hospital API',
    endpoints: {
      health: '/api/health',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      specialities: '/api/specialities-state',
      events: '/api/events',
      testimonials: '/api/testimonials',
      news: '/api/news',
      gallery: '/api/gallery',
      queries: '/api/queries',
      subadmins: '/api/subadmins'
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Bhaktivedanta Hospital API is healthy and running',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/specialities-state', specialitiesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/news', newsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/queries', queriesRouter);
app.use('/api/subadmins', subadminsRouter);

// Page Not Found (404) Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start listening
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS allowed origins: ${FRONTEND_URL}`);
  });
}

export default app;
