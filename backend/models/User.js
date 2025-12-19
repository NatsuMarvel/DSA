const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  progress: [ProgressSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
