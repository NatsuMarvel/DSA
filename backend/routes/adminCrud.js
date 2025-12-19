const express = require('express');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const authMiddleware = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

function isValidUrl(str){
  if (!str) return true; // empty allowed
  try { new URL(str); return true } catch { return false }
}

// Create topic
router.post('/topics', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { title, description, youtubeLink } = req.body;
    if (youtubeLink && !isValidUrl(youtubeLink)) return res.status(400).json({ error: 'Invalid youtubeLink' });
    const t = await Topic.create({ title, description, youtubeLink });
    res.json(t);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Update topic (title/description/youtubeLink only)
router.put('/topics/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { title, description, youtubeLink } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (youtubeLink !== undefined) {
      if (youtubeLink && !isValidUrl(youtubeLink)) return res.status(400).json({ error: 'Invalid youtubeLink' });
      update.youtubeLink = youtubeLink;
    }
    const t = await Topic.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(t);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Delete topic
router.delete('/topics/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Create problem (optionally attach to topic)
router.post('/problems', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { title, description, youtubeLink, leetCodeLink, articleLink, level, topicId } = req.body;
    if (youtubeLink && !isValidUrl(youtubeLink)) return res.status(400).json({ error: 'Invalid youtubeLink' });
    if (leetCodeLink && !isValidUrl(leetCodeLink)) return res.status(400).json({ error: 'Invalid leetCodeLink' });
    if (articleLink && !isValidUrl(articleLink)) return res.status(400).json({ error: 'Invalid articleLink' });
    const p = await Problem.create({ title, description, youtubeLink, leetCodeLink, articleLink, level });
    if (topicId) {
      await Topic.findByIdAndUpdate(topicId, { $push: { problems: p._id } });
    }
    res.json(p);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Update problem
router.put('/problems/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { youtubeLink, leetCodeLink, articleLink } = req.body;
    if (youtubeLink && !isValidUrl(youtubeLink)) return res.status(400).json({ error: 'Invalid youtubeLink' });
    if (leetCodeLink && !isValidUrl(leetCodeLink)) return res.status(400).json({ error: 'Invalid leetCodeLink' });
    if (articleLink && !isValidUrl(articleLink)) return res.status(400).json({ error: 'Invalid articleLink' });
    const p = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Delete problem (also remove from topics)
router.delete('/problems/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await Problem.findByIdAndDelete(id);
    await Topic.updateMany({ problems: id }, { $pull: { problems: id } });
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;