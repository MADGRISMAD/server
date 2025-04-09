const mongoose = require("mongoose");

const jobOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String }, // <- opcional
  description: { type: String, required: true },
  tags: [String],
  isRemote: { type: Boolean, default: false },
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: "USD" },
    type: { type: String, enum: ["hora", "mes", "proyecto"], default: "hora" },
  },
  duration: { type: String }, // Ej: "3 meses"
  highlighted: { type: Boolean, default: false },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true, // 🧠 mejora búsquedas por empresa
  },

  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true, // 🧠 mejora búsquedas por postulante
      },
      coverLetter: { type: String },
      appliedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["applied", "viewed", "interview", "hired", "rejected"],
        default: "applied",
      },
    },
  ],

  createdAt: { type: Date, default: Date.now },

  reports: [
    {
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  isVisible: { type: Boolean, default: true },
});

module.exports = mongoose.model("JobOffer", jobOfferSchema);