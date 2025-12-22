require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');
const adminRoutes = require('./routes/admin');
const adminCrudRoutes = require('./routes/adminCrud');

const app = express();
app.use(cors());
app.use(express.json());

// Enable CORS for your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://dsa-two-zeta.vercel.app',
  credentials: true // allow sending cookies or auth headers
}));

// Simple request logger to help debug client/server interactions
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminCrudRoutes);

app.get('/', (req, res) => res.send({ status: 'DSA sheet API up' }));

module.exports = app;
