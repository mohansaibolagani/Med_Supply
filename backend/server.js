const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// System root health route
app.get('/', (req, res) => {
  res.json({
    service: 'MedSupply: Local Blood & Urgent Medical Equipment Exchange API',
    status: 'ONLINE',
    version: '1.0.0',
    documentation: '/api/docs',
    dbStatus: getDBStatus(),
    teamWorkloadSplit: {
      member1: {
        role: 'Backend & APIs',
        responsibilities: [
          'Express REST routes',
          'MongoDB geospatial 2dsphere indexing ($near)',
          'Compound indexing on blood groups & locations',
          'JWT authentication & role-based authorization middleware'
        ]
      },
      member2: {
        role: 'Frontend UI',
        responsibilities: [
          'React responsive interface & Tailwind styling',
          'Live Emergency Request Feed with urgency badges',
          'Modal forms (post SOS, register donor, list equipment)',
          'Interactive status toggle buttons (availability, rental reservation)'
        ]
      },
      member3: {
        role: 'Verification & Ops',
        responsibilities: [
          'External WhatsApp Web & Meta Cloud API deep action hooks',
          'Emergency SOS broadcast engine & simulator',
          'Database seed dataset (25+ realistic records)',
          'Docker containerization, environment configuration & viva documentation'
        ]
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static frontend in production if built
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 Handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on this server.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  const server = app.listen(config.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 MedSupply Backend Server running on port ${config.PORT}`);
    console.log(`🌐 Base URL: http://localhost:${config.PORT}`);
    console.log(`🩺 Mode: ${config.NODE_ENV}`);
    console.log(`💾 DB Engine: ${getDBStatus().type}`);
    console.log(`=======================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] Error: ${err.message}`);
    // Keep server running in development
  });
};

startServer();

module.exports = app;
