require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger to help debug client/server interactions
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const adminCrudRoutes = require('./routes/adminCrud');
app.use('/api/admin', adminCrudRoutes);

app.get('/', (req, res) => res.send({status: 'DSA sheet API up'}));

async function start() {
  let usedMemoryServer = null;
  try {
      // Use MONGO_URI from environment (Vercel or runtime). No SSM/Secrets Manager loading in this build.
    const mongoUri = process.env.MONGO_URI || '';    if (!mongoUri) {
      console.warn('MONGO_URI not provided in environment; starting in-memory MongoDB for development. To use Atlas, set MONGO_URI in your .env or EB environment.');
      usedMemoryServer = await MongoMemoryServer.create();
      const memUri = usedMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log('Connected to in-memory MongoDB at', memUri);
    } else {
      // attempt to connect to provided URI
      try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB (using provided MONGO_URI)');
      } catch (err) {
        console.warn('Could not connect to provided MongoDB URI, starting in-memory MongoDB for development. See error:', err.message);
        usedMemoryServer = await MongoMemoryServer.create();
        const memUri = usedMemoryServer.getUri();
        await mongoose.connect(memUri);
        console.log('Connected to in-memory MongoDB at', memUri);
      }
    }

    // After server is up, in development attempt to auto-seed if DB empty
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      if (process.env.NODE_ENV !== 'production') {
        try {
          // seed if no topics exist
          const Topic = require('./models/Topic');
          const seedConnected = require('./seedConnected');
          const cnt = await Topic.countDocuments();
          if (cnt === 0) {
            console.log('No topics in DB — running dev-only seedConnected()');
            await seedConnected();
          } else {
            console.log('Topics already exist — skipping dev seed');
          }
        } catch (err) {
          console.error('Dev seed check failed', err);
        }
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    if (usedMemoryServer) await usedMemoryServer.stop();
    process.exit(1);
  }
}

start();
