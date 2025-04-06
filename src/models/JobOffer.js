const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  isRemote: { type: Boolean, default: false },
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
    type: { type: String, enum: ['hora', 'mes', 'proyecto'], default: 'hora' }
  },
  duration: { type: String }, // Ej: "3 meses"
  highlighted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coverLetter: { type: String },
    appliedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobOffer', jobOfferSchema);
