const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();

// =====================================================
// Route Imports
// =====================================================

const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/user.routes');
const schedulerRoutes = require('./routes/scheduler.routes');
const notesRoutes = require('./routes/notes.routes');
const financeRoutes = require('./routes/finance.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const authRoutes = require('./routes/auth.routes');

// =====================================================
// Middleware Imports
// =====================================================

const errorHandler = require('./middleware/errorHandler');
const { chatRateLimiter } = require('./middleware/rateLimits');

// =====================================================
// Global Middleware
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// Session Middleware
// =====================================================

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  })
);

// =====================================================
// API Routes
// =====================================================

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/chatbot', chatRateLimiter, chatbotRoutes);

// =====================================================
// Global Error Handler (must be last)
// =====================================================

app.use(errorHandler);

module.exports = app;
