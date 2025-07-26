const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors'); 

// Initialize app FIRST
const app = express();

// Connect to DB
const { connectDB } = require('./config/db');
connectDB(); 

// Routers
const indexRouter = require('./routes/index');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads' , express.static(path.join(__dirname, 'uploads')))

// CORS - Allow all origins with credentials
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any origin
    return callback(null, true);  
  },
  credentials: true
}));

// Routes
app.use('/api', indexRouter);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;