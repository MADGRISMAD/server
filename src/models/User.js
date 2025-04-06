const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  university: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  skills: [String],
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationToken: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
