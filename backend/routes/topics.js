const express = require('express');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authMiddleware = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

// Get all topics with problems (include user's progress per problem)
// Public: optional auth — if user is present, include progress; otherwise return topics without completed flags
router.get('/', optionalAuth, async (req, res) => {
  try {
    const topics = await Topic.find().populate('problems');
    const user = req.user || null;
    const progressMap = {};
    if (user && user.progress) {
      user.progress.forEach(p => { progressMap[p.problemId.toString()] = p.completed; });
    }
    const topicsWithProgress = topics.map(t => {
      const problems = t.problems.map(p => {
        const obj = p.toObject();
        obj.completed = !!progressMap[p._id.toString()];
        return obj;
      });
      const out = t.toObject();
      out.problems = problems;
      return out;
    });
    res.json(topicsWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single topic (include user's progress)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('problems');
    if (!topic) return res.status(404).json({ error: 'Not found' });
    const user = req.user || null;
    const progressMap = {};
    if (user && user.progress) {
      user.progress.forEach(p => { progressMap[p.problemId.toString()] = p.completed; });
    }
    const problems = topic.problems.map(p => {
      const obj = p.toObject();
      obj.completed = !!progressMap[p._id.toString()];
      return obj;
    });
    const out = topic.toObject();
    out.problems = problems;
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helpful GET response so browser/requests showing a GET receive a clear message
router.get('/progress/toggle', (req, res) => {
  res.status(405).json({ error: 'Method Not Allowed. Use POST /api/topics/progress/toggle with JSON body { problemId, completed }' });
});

// Toggle progress for a problem for the logged-in user
router.post('/progress/toggle', authMiddleware, async (req, res) => {
  try {
    const { problemId, completed } = req.body;

    console.log('Toggle progress request', { userId: req.userId, problemId, completed });

    if (!problemId) return res.status(400).json({ error: 'Missing problemId' });

    // Validate problem exists
    let problem;
    try {
      problem = await Problem.findById(problemId);
      if (!problem) return res.status(400).json({ error: 'Problem not found' });
    } catch (e) {
      // invalid ObjectId or other cast error
      console.warn('Invalid problemId in toggle:', problemId);
      return res.status(400).json({ error: 'Invalid problemId' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const idx = user.progress.findIndex(p => p.problemId.toString() === problemId);
    if (idx === -1) {
      user.progress.push({ problemId, completed, updatedAt: new Date() });
    } else {
      user.progress[idx].completed = completed;
      user.progress[idx].updatedAt = new Date();
    }
    await user.save();
    res.json({ success: true, progress: user.progress });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
