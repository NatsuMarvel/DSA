const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Dev-only seed endpoint. Only allowed when NODE_ENV !== 'production'.
router.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Forbidden' });
  try {
    await Problem.deleteMany({});
    await Topic.deleteMany({});

    // create a more comprehensive DSA seed with per-problem links and levels
    const p1 = await Problem.create({ title: 'Two Sum', leetCodeLink: 'https://leetcode.com/problems/two-sum/', youtubeLink: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', articleLink: 'https://leetcode.com/problems/two-sum/solution/', level: 'Easy' });
    const p2 = await Problem.create({ title: 'Best Time to Buy and Sell Stock', leetCodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', youtubeLink: 'https://www.youtube.com/watch?v=1pkOgXD63yU', articleLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solution/', level: 'Easy' });
    const p3 = await Problem.create({ title: '3Sum', leetCodeLink: 'https://leetcode.com/problems/3sum/', youtubeLink: 'https://www.youtube.com/watch?v=8hly31xKli0', articleLink: 'https://leetcode.com/problems/3sum/solution/', level: 'Medium' });

    const p4 = await Problem.create({ title: 'Reverse Linked List', leetCodeLink: 'https://leetcode.com/problems/reverse-linked-list/', youtubeLink: 'https://www.youtube.com/watch?v=NJ5no8J4qfU', articleLink: 'https://www.geeksforgeeks.org/reverse-a-linked-list/', level: 'Easy' });
    const p5 = await Problem.create({ title: 'Merge Two Sorted Lists', leetCodeLink: 'https://leetcode.com/problems/merge-two-sorted-lists/', youtubeLink: 'https://www.youtube.com/watch?v=XIdigk956u0', articleLink: 'https://leetcode.com/problems/merge-two-sorted-lists/solution/', level: 'Easy' });

    const p6 = await Problem.create({ title: 'Longest Substring Without Repeating Characters', leetCodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', youtubeLink: 'https://www.youtube.com/watch?v=wiGpQwVHdE0', articleLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/', level: 'Medium' });
    const p7 = await Problem.create({ title: 'Sliding Window Maximum', leetCodeLink: 'https://leetcode.com/problems/sliding-window-maximum/', youtubeLink: 'https://www.youtube.com/watch?v=9Y4rA5s-5dw', articleLink: 'https://leetcode.com/problems/sliding-window-maximum/solution/', level: 'Hard' });

    const p8 = await Problem.create({ title: 'Valid Parentheses', leetCodeLink: 'https://leetcode.com/problems/valid-parentheses/', youtubeLink: 'https://www.youtube.com/watch?v=J2pghVyK3v0', articleLink: 'https://leetcode.com/problems/valid-parentheses/solution/', level: 'Easy' });
    const p9 = await Problem.create({ title: 'Min Stack', leetCodeLink: 'https://leetcode.com/problems/min-stack/', youtubeLink: 'https://www.youtube.com/watch?v=ZIn6m_qIYx4', articleLink: 'https://leetcode.com/problems/min-stack/solution/', level: 'Medium' });

    const p10 = await Problem.create({ title: 'Binary Tree Inorder Traversal', leetCodeLink: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', youtubeLink: 'https://www.youtube.com/watch?v=Zz2b3e2xC-4', articleLink: 'https://leetcode.com/problems/binary-tree-inorder-traversal/solution/', level: 'Easy' });
    const p11 = await Problem.create({ title: 'Maximum Depth of Binary Tree', leetCodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', youtubeLink: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', articleLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/solution/', level: 'Easy' });

    const p12 = await Problem.create({ title: 'Climbing Stairs', leetCodeLink: 'https://leetcode.com/problems/climbing-stairs/', youtubeLink: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI', articleLink: 'https://leetcode.com/problems/climbing-stairs/solution/', level: 'Easy' });
    const p13 = await Problem.create({ title: 'Longest Increasing Subsequence', leetCodeLink: 'https://leetcode.com/problems/longest-increasing-subsequence/', youtubeLink: 'https://www.youtube.com/watch?v=CE2b_-XfVDk', articleLink: 'https://leetcode.com/problems/longest-increasing-subsequence/solution/', level: 'Medium' });

    const p14 = await Problem.create({ title: 'Number of Islands', leetCodeLink: 'https://leetcode.com/problems/number-of-islands/', youtubeLink: 'https://www.youtube.com/watch?v=pVfj6mxhdMw', articleLink: 'https://leetcode.com/problems/number-of-islands/solution/', level: 'Medium' });
    const p15 = await Problem.create({ title: 'Course Schedule', leetCodeLink: 'https://leetcode.com/problems/course-schedule/', youtubeLink: 'https://www.youtube.com/watch?v=vWV5F39LAJE', articleLink: 'https://leetcode.com/problems/course-schedule/solution/', level: 'Medium' });

    const p16 = await Problem.create({ title: 'Jump Game', leetCodeLink: 'https://leetcode.com/problems/jump-game/', youtubeLink: 'https://www.youtube.com/watch?v=F91rKqBic1k', articleLink: 'https://leetcode.com/problems/jump-game/solution/', level: 'Medium' });
    const p17 = await Problem.create({ title: 'Single Number', leetCodeLink: 'https://leetcode.com/problems/single-number/', youtubeLink: 'https://www.youtube.com/watch?v=3E5p4d6wyJg', articleLink: 'https://leetcode.com/problems/single-number/solution/', level: 'Easy' });

    const p18 = await Problem.create({ title: 'Kth Largest Element in an Array', leetCodeLink: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', youtubeLink: 'https://www.youtube.com/watch?v=4v2E1Jq2Qro', articleLink: 'https://leetcode.com/problems/kth-largest-element-in-an-array/solution/', level: 'Medium' });
    const p19 = await Problem.create({ title: 'Trie Implementation', leetCodeLink: 'https://leetcode.com/problems/implement-trie-prefix-tree/', youtubeLink: 'https://www.youtube.com/watch?v=AXjmTQ8LEoI', articleLink: 'https://leetcode.com/problems/implement-trie-prefix-tree/solution/', level: 'Medium' });

    const p20 = await Problem.create({ title: 'Median of Two Sorted Arrays', leetCodeLink: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', youtubeLink: 'https://www.youtube.com/watch?v=LPFhl65R7ww', articleLink: 'https://leetcode.com/problems/median-of-two-sorted-arrays/solution/', level: 'Hard' });

    await Topic.create({ title: 'Arrays', description: 'Array related problems', problems: [p1._id, p2._id, p3._id, p18._id] });
    await Topic.create({ title: 'Linked Lists', description: 'Linked list common problems', problems: [p4._id, p5._id] });
    await Topic.create({ title: 'Strings & Sliding Window', description: 'String manipulation and sliding window techniques', problems: [p6._id, p7._id] });
    await Topic.create({ title: 'Stacks & Queues', description: 'Stack and queue based problems', problems: [p8._id, p9._id] });
    await Topic.create({ title: 'Trees', description: 'Binary tree fundamentals', problems: [p10._id, p11._id] });
    await Topic.create({ title: 'Dynamic Programming', description: 'DP foundation problems', problems: [p12._id, p13._id] });
    await Topic.create({ title: 'Graphs', description: 'Graph search & topological sort', problems: [p14._id, p15._id] });
    await Topic.create({ title: 'Greedy & Math', description: 'Greedy and number problems', problems: [p16._id, p17._id] });
    await Topic.create({ title: 'Heaps & Selection', description: 'Using heaps and selection algorithms', problems: [p18._id] });
    await Topic.create({ title: 'Tries & Strings', description: 'Prefix trees and string problems', problems: [p19._id] });
    await Topic.create({ title: 'Hard / Advanced', description: 'Advanced algorithmic problems', problems: [p20._id] });

    // create a default admin user for development
    const adminEmail = process.env.DEV_ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.DEV_ADMIN_PASSWORD || 'admin123'
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(adminPassword, salt)
      await User.create({ name: 'Admin', email: adminEmail, passwordHash, role: 'admin' })
      console.log('Created dev admin:', adminEmail)
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Seed failed', err);
    res.status(500).json({ error: 'Seed failed' });
  }
});

// Dev debug endpoint to inspect request headers and authenticated user
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');
router.get('/debug', authMiddleware, (req, res) => {
  try {
    const user = req.user ? { id: req.user._id, email: req.user.email, name: req.user.name } : null;
    res.json({ headers: req.headers, user });
  } catch (err) {
    console.error('Debug endpoint error', err);
    res.status(500).json({ error: 'Debug failed' });
  }
});

// Simple DB health check for debugging (dev-only)
router.get('/db-check', async (req, res) => {
  try {
    const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    res.json({ state });
  } catch (err) {
    console.error('DB check failed', err);
    res.status(500).json({ error: 'DB check failed' });
  }
});

module.exports = router;
