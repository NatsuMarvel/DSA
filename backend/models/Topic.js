const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  youtubeLink: { type: String },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
}, { timestamps: true });

module.exports = mongoose.model('Topic', TopicSchema);
