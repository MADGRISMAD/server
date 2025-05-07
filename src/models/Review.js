const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  universityRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  careerRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  pointsAwarded: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de búsqueda
reviewSchema.index({ reviewer: 1, reviewed: 1 });
reviewSchema.index({ job: 1 });
reviewSchema.index({ verificationStatus: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 