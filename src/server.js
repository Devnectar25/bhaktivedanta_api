// Bhaktivedanta API Server
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
import blogsRouter from './routes/blogs.js';
import galleryRouter from './routes/gallery.js';
import queriesRouter from './routes/queries.js';
import subadminsRouter from './routes/subadmins.js';
import helpdeskRouter from './routes/helpdesk.js';
import appErrorsRouter from './routes/appErrors.js';
import servicesRouter from './routes/services.js';
import patientCornerRouter from './routes/patientCorner.js';
import careersRouter from './routes/careers.js';
import educationResearchRouter from './routes/educationResearch.js';
import spiritualCareRouter from './routes/spiritualCare.js';
import statutoryCompliancesRouter from './routes/statutoryCompliances.js';
import associateCentresRouter from './routes/associateCentres.js';

// Load Environment Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    const allowed = [
      FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://localhost:3000'
    ];

    const isAllowed = allowed.some(url => url && origin.startsWith(url)) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      origin.includes('bhaktivedanta') ||
      origin.includes('vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ensure dynamic endpoints are never cached by proxies / browsers
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

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
      subadmins: '/api/subadmins',
      helpdesk: '/api/helpdesk',
      appErrors: '/api/app-errors',
      services: '/api/services-state',
      patientCorner: '/api/patient-corner-state',
      spiritualCare: '/api/spiritual-care-state',
      educationResearch: '/api/education-research'
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
app.use('/api/specialities', specialitiesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/news', newsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/queries', queriesRouter);
app.use('/api/subadmins', subadminsRouter);
app.use('/api/helpdesk', helpdeskRouter);
app.use('/api/app-errors', appErrorsRouter);
app.use('/api/services-state', servicesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/patient-corner-state', patientCornerRouter);
app.use('/api/patient-corner', patientCornerRouter);
app.use('/api/careers', careersRouter);
app.use('/api/spiritual-care-state', spiritualCareRouter);
app.use('/api/spiritual-care', spiritualCareRouter);
app.use('/api/education-research', educationResearchRouter);
app.use('/api/statutory-compliances-state', statutoryCompliancesRouter);
app.use('/api/statutory-compliances', statutoryCompliancesRouter);
app.use('/api/associate-centres', associateCentresRouter);

// Page Not Found (404) Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  // Gracefully handle malformed JSON payload errors from body-parser
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON payload format'
    });
  }

  console.error('Unhandled server error:', err);
  res.status(err.status || err.statusCode || 500).json({
    error: err.name || 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start listening
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS allowed origins: ${FRONTEND_URL}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is busy, retrying listener...`);
      setTimeout(() => {
        try {
          server.close();
        } catch (e) { }
        server.listen(PORT);
      }, 1000);
    } else {
      console.error('Server error:', err);
    }
  });

  process.once('SIGUSR2', () => {
    server.close(() => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
}

export default app;
