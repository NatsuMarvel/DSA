require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');

async function ensureProblem(p) {
  const existing = await Problem.findOne({ title: p.title });
  if (existing) return existing;
  return await Problem.create(p);
}

async function ensureTopic(t, problemDocs) {
  // find or create topic
  let topic = await Topic.findOne({ title: t.title });
  if (!topic) {
    topic = await Topic.create({ title: t.title, description: t.description || '', youtubeLink: t.youtubeLink || '' });
  }
  // ensure problem ids are present (idempotent)
  const idsToAdd = problemDocs.map(pd => pd._id);
  await Topic.findByIdAndUpdate(topic._id, { $addToSet: { problems: { $each: idsToAdd } }, ...(t.youtubeLink ? { youtubeLink: t.youtubeLink } : {}) }, { new: true });
  return await Topic.findById(topic._id).populate('problems');
}

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is required to run seedProduction.js');
    process.exit(1);
  }
  // require explicit confirmation for production seeding
  const allow = (process.env.FORCE_PROD_SEED || '').toLowerCase();
  if (!(allow === '1' || allow === 'true')) {
    console.error('FORCE_PROD_SEED is not set to "1" or "true". Aborting to avoid accidental prod changes.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to', process.env.MONGO_URI.replace(/:(?:.*)@/, ':***@'));

  try {
    // Problems to ensure exist
    const problems = [
      { title: 'Two Sum', leetCodeLink: 'https://leetcode.com/problems/two-sum/', youtubeLink: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', articleLink: 'https://leetcode.com/problems/two-sum/solution/', level: 'Easy' },
      { title: 'Best Time to Buy and Sell Stock', leetCodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', youtubeLink: 'https://www.youtube.com/watch?v=1pkOgXD63yU', articleLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solution/', level: 'Easy' },
      { title: '3Sum', leetCodeLink: 'https://leetcode.com/problems/3sum/', youtubeLink: 'https://www.youtube.com/watch?v=8hly31xKli0', articleLink: 'https://leetcode.com/problems/3sum/solution/', level: 'Medium' },
      { title: 'Reverse Linked List', leetCodeLink: 'https://leetcode.com/problems/reverse-linked-list/', youtubeLink: 'https://www.youtube.com/watch?v=8Jz4e3vn4fE', articleLink: 'https://leetcode.com/problems/reverse-linked-list/solution/', level: 'Easy' },
      { title: 'Merge Two Sorted Lists', leetCodeLink: 'https://leetcode.com/problems/merge-two-sorted-lists/', youtubeLink: 'https://www.youtube.com/watch?v=XIdigk956u0', articleLink: 'https://leetcode.com/problems/merge-two-sorted-lists/solution/', level: 'Easy' },
      { title: 'Longest Substring Without Repeating Characters', leetCodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', youtubeLink: 'https://www.youtube.com/watch?v=wiGpQwVHdE0', articleLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/', level: 'Medium' },
      { title: 'Sliding Window Maximum', leetCodeLink: 'https://leetcode.com/problems/sliding-window-maximum/', youtubeLink: 'https://www.youtube.com/watch?v=9Y4rA5s-5dw', articleLink: 'https://leetcode.com/problems/sliding-window-maximum/solution/', level: 'Hard' },
      { title: 'Valid Parentheses', leetCodeLink: 'https://leetcode.com/problems/valid-parentheses/', youtubeLink: 'https://www.youtube.com/watch?v=J2pghVyK3v0', articleLink: 'https://leetcode.com/problems/valid-parentheses/solution/', level: 'Easy' },
      { title: 'Min Stack', leetCodeLink: 'https://leetcode.com/problems/min-stack/', youtubeLink: 'https://www.youtube.com/watch?v=ZIn6m_qIYx4', articleLink: 'https://leetcode.com/problems/min-stack/solution/', level: 'Medium' },
      { title: 'Binary Tree Inorder Traversal', leetCodeLink: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', youtubeLink: 'https://www.youtube.com/watch?v=Zz2b3e2xC-4', articleLink: 'https://leetcode.com/problems/binary-tree-inorder-traversal/solution/', level: 'Easy' },
      { title: 'Maximum Depth of Binary Tree', leetCodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', youtubeLink: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', articleLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/solution/', level: 'Easy' },
      { title: 'Climbing Stairs', leetCodeLink: 'https://leetcode.com/problems/climbing-stairs/', youtubeLink: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI', articleLink: 'https://leetcode.com/problems/climbing-stairs/solution/', level: 'Easy' },
      { title: 'Longest Increasing Subsequence', leetCodeLink: 'https://leetcode.com/problems/longest-increasing-subsequence/', youtubeLink: 'https://www.youtube.com/watch?v=CE2b_-XfVDk', articleLink: 'https://leetcode.com/problems/longest-increasing-subsequence/solution/', level: 'Medium' },
      { title: 'Number of Islands', leetCodeLink: 'https://leetcode.com/problems/number-of-islands/', youtubeLink: 'https://www.youtube.com/watch?v=pVfj6mxhdMw', articleLink: 'https://leetcode.com/problems/number-of-islands/solution/', level: 'Medium' },
      { title: 'Course Schedule', leetCodeLink: 'https://leetcode.com/problems/course-schedule/', youtubeLink: 'https://www.youtube.com/watch?v=vWV5F39LAJE', articleLink: 'https://leetcode.com/problems/course-schedule/solution/', level: 'Medium' },
      { title: 'Jump Game', leetCodeLink: 'https://leetcode.com/problems/jump-game/', youtubeLink: 'https://www.youtube.com/watch?v=F91rKqBic1k', articleLink: 'https://leetcode.com/problems/jump-game/solution/', level: 'Medium' },
      { title: 'Single Number', leetCodeLink: 'https://leetcode.com/problems/single-number/', youtubeLink: 'https://www.youtube.com/watch?v=3E5p4d6wyJg', articleLink: 'https://leetcode.com/problems/single-number/solution/', level: 'Easy' },
      { title: 'Kth Largest Element in an Array', leetCodeLink: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', youtubeLink: 'https://www.youtube.com/watch?v=4v2E1Jq2Qro', articleLink: 'https://leetcode.com/problems/kth-largest-element-in-an-array/solution/', level: 'Medium' },
      { title: 'Trie Implementation', leetCodeLink: 'https://leetcode.com/problems/implement-trie-prefix-tree/', youtubeLink: 'https://www.youtube.com/watch?v=AXjmTQ8LEoI', articleLink: 'https://leetcode.com/problems/implement-trie-prefix-tree/solution/', level: 'Medium' },
      { title: 'Median of Two Sorted Arrays', leetCodeLink: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', youtubeLink: 'https://www.youtube.com/watch?v=LPFhl65R7ww', articleLink: 'https://leetcode.com/problems/median-of-two-sorted-arrays/solution/', level: 'Hard' }
    ];

    // ensure problems
    const createdProblems = [];
    for (const p of problems) {
      const doc = await ensureProblem(p);
      createdProblems.push(doc);
    }

    // topics mapping
    const topics = [
      { title: 'Arrays', description: 'Array related problems', youtubeLink: createdProblems.find(p => p.title === 'Two Sum').youtubeLink, problems: ['Two Sum', 'Best Time to Buy and Sell Stock', '3Sum', 'Kth Largest Element in an Array'] },
      { title: 'Linked Lists', description: 'Linked list common problems', youtubeLink: createdProblems.find(p => p.title === 'Reverse Linked List').youtubeLink, problems: ['Reverse Linked List', 'Merge Two Sorted Lists'] },
      { title: 'Strings & Sliding Window', description: 'String manipulation and sliding window techniques', youtubeLink: createdProblems.find(p => p.title === 'Longest Substring Without Repeating Characters').youtubeLink, problems: ['Longest Substring Without Repeating Characters', 'Sliding Window Maximum'] },
      { title: 'Stacks & Queues', description: 'Stack and queue based problems', youtubeLink: createdProblems.find(p => p.title === 'Valid Parentheses').youtubeLink, problems: ['Valid Parentheses', 'Min Stack'] },
      { title: 'Trees', description: 'Binary tree fundamentals', youtubeLink: createdProblems.find(p => p.title === 'Binary Tree Inorder Traversal').youtubeLink, problems: ['Binary Tree Inorder Traversal', 'Maximum Depth of Binary Tree'] },
      { title: 'Dynamic Programming', description: 'DP foundation problems', youtubeLink: createdProblems.find(p => p.title === 'Climbing Stairs').youtubeLink, problems: ['Climbing Stairs', 'Longest Increasing Subsequence'] },
      { title: 'Graphs', description: 'Graph search & topological sort', youtubeLink: createdProblems.find(p => p.title === 'Number of Islands').youtubeLink, problems: ['Number of Islands', 'Course Schedule'] },
      { title: 'Greedy & Math', description: 'Greedy and number problems', youtubeLink: createdProblems.find(p => p.title === 'Jump Game').youtubeLink, problems: ['Jump Game', 'Single Number'] },
      { title: 'Heaps & Selection', description: 'Using heaps and selection algorithms', youtubeLink: createdProblems.find(p => p.title === 'Kth Largest Element in an Array').youtubeLink, problems: ['Kth Largest Element in an Array'] },
      { title: 'Tries & Strings', description: 'Prefix trees and string problems', youtubeLink: createdProblems.find(p => p.title === 'Trie Implementation').youtubeLink, problems: ['Trie Implementation'] },
      { title: 'Hard / Advanced', description: 'Advanced algorithmic problems', youtubeLink: createdProblems.find(p => p.title === 'Median of Two Sorted Arrays').youtubeLink, problems: ['Median of Two Sorted Arrays'] }
    ];

    for (const t of topics) {
      const probDocs = t.problems.map(title => createdProblems.find(p => p.title === title)).filter(Boolean);
      await ensureTopic({ title: t.title, description: t.description, youtubeLink: t.youtubeLink }, probDocs);
      console.log('Ensured topic:', t.title);
    }

    console.log('Production-safe seed finished');
  } catch (err) {
    console.error('Seed production error', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed().catch(err => { console.error(err); process.exit(1) });