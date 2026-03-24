const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();


// ✅ DYNAMIC CORS FIX (WORKS FOR NETLIFY + VERCEL + LOCALHOST)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server requests

    // ✅ Allow Netlify domains
    if (origin.includes(".netlify.app")) return callback(null, true);

    // ✅ Allow Vercel domains
    if (origin.includes(".vercel.app")) return callback(null, true);

    // ✅ Allow localhost (development)
    if (origin.includes("localhost")) return callback(null, true);

    // ❗ TEMP: allow all (safe during development)
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


// ✅ HANDLE PREFLIGHT REQUESTS (VERY IMPORTANT)
app.options("*", cors());


// ✅ BODY PARSERS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// ✅ LOGGER
app.use(morgan('dev'));


// ✅ STATIC FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/documents', require('./routes/documents'));


// ✅ HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TechTrack API is running 🚀',
    time: new Date()
  });
});


// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.send('TechTrack Backend Running 🚀');
});


// ❌ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;