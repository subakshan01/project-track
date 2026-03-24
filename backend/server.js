const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();


// ✅ SIMPLE & STABLE CORS (FIXED)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4200",
    "https://spiffy-cuchufli-9bd432.netlify.app",
    "https://techtrack-student.vercel.app",
    "https://techtrack-staff.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors());


// ✅ Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// ✅ Logger
app.use(morgan('dev'));


// ✅ Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/documents', require('./routes/documents'));


// ✅ Health check (IMPORTANT for testing)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TechTrack API is running',
    timestamp: new Date()
  });
});


// ✅ Root route (to check server quickly)
app.get('/', (req, res) => {
  res.send('TechTrack Backend Running 🚀');
});


// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});


// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TechTrack server running on port ${PORT}`);
});

module.exports = app;