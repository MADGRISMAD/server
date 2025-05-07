const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  pointsHistory: [{
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['earned', 'spent', 'refunded'],
      required: true
    },
    source: {
      type: String,
      enum: ['review', 'job_application', 'auction'],
      required: true
    },
    description: String,
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  activeBids: [{
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: ['active', 'won', 'lost', 'cancelled'],
      default: 'active'
    },
    position: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
pointsSchema.index({ user: 1 });
pointsSchema.index({ 'activeBids.job': 1 });
pointsSchema.index({ 'activeBids.status': 1 });

const Points = mongoose.model('Points', pointsSchema);

module.exports = Points;
