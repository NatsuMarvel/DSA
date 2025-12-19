const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  youtubeLink: { type: String },
  leetCodeLink: { type: String },
  articleLink: { type: String },
  level: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);
