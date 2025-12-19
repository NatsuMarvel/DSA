require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');

async function seed() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  let mongod = null;
  let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_sheet';
  try {
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.warn('Could not connect to provided MongoDB URI, starting in-memory MongoDB for seeding.');
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
  }

  await Problem.deleteMany({});
  await Topic.deleteMany({});

  // Problems (each has leetCode/youtube/article links and per-problem difficulty)
  const p1 = await Problem.create({ title: 'Two Sum', leetCodeLink: 'https://leetcode.com/problems/two-sum/', youtubeLink: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', articleLink: 'https://leetcode.com/problems/two-sum/solution/', level: 'Easy' });
  const p2 = await Problem.create({ title: 'Best Time to Buy and Sell Stock', leetCodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', youtubeLink: 'https://www.youtube.com/watch?v=1pkOgXD63yU', articleLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solution/', level: 'Easy' });
  const p3 = await Problem.create({ title: '3Sum', leetCodeLink: 'https://leetcode.com/problems/3sum/', youtubeLink: 'https://www.youtube.com/watch?v=8hly31xKli0', articleLink: 'https://leetcode.com/problems/3sum/solution/', level: 'Medium' });

  const p4 = await Problem.create({ title: 'Reverse Linked List', leetCodeLink: 'https://leetcode.com/problems/reverse-linked-list/', youtubeLink: 'https://www.youtube.com/watch?v=8Jz4e3vn4fE', articleLink: 'https://leetcode.com/problems/reverse-linked-list/solution/', level: 'Easy' });
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

  // Topics (attach problems; topic-level difficulty is intentionally omitted so difficulty is shown on problems only)
  const t1 = await Topic.create({ title: 'Arrays', description: 'Array related problems', youtubeLink: p1.youtubeLink, problems: [p1._id, p2._id, p3._id, p18._id] });
  const t2 = await Topic.create({ title: 'Linked Lists', description: 'Linked list common problems', youtubeLink: p4.youtubeLink, problems: [p4._id, p5._id] });
  const t3 = await Topic.create({ title: 'Strings & Sliding Window', description: 'String manipulation and sliding window techniques', youtubeLink: p6.youtubeLink, problems: [p6._id, p7._id] });
  const t4 = await Topic.create({ title: 'Stacks & Queues', description: 'Stack and queue based problems', youtubeLink: p8.youtubeLink, problems: [p8._id, p9._id] });
  const t5 = await Topic.create({ title: 'Trees', description: 'Binary tree fundamentals', youtubeLink: p10.youtubeLink, problems: [p10._id, p11._id] });
  const t6 = await Topic.create({ title: 'Dynamic Programming', description: 'DP foundation problems', youtubeLink: p12.youtubeLink, problems: [p12._id, p13._id] });
  const t7 = await Topic.create({ title: 'Graphs', description: 'Graph search & topological sort', youtubeLink: p14.youtubeLink, problems: [p14._id, p15._id] });
  const t8 = await Topic.create({ title: 'Greedy & Math', description: 'Greedy and number problems', youtubeLink: p16.youtubeLink, problems: [p16._id, p17._id] });
  const t9 = await Topic.create({ title: 'Heaps & Selection', description: 'Using heaps and selection algorithms', youtubeLink: p18.youtubeLink, problems: [p18._id] });
  const t10 = await Topic.create({ title: 'Tries & Strings', description: 'Prefix trees and string problems', youtubeLink: p19.youtubeLink, problems: [p19._id] });
  const t11 = await Topic.create({ title: 'Hard / Advanced', description: 'Advanced algorithmic problems', youtubeLink: p20.youtubeLink, problems: [p20._id] });

  console.log('Seeded sample topics & problems');
  if (mongod) {
    console.log('Stopping in-memory MongoDB used for seeding.');
    await mongoose.disconnect();
    await mongod.stop();
  }
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
