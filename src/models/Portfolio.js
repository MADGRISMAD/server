const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projects: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    technologies: [{
      type: String,
      trim: true
    }],
    images: [{
      url: String,
      publicId: String
    }],
    githubUrl: String,
    liveUrl: String,
    startDate: Date,
    endDate: Date,
    featured: {
      type: Boolean,
      default: false
    }
  }],
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['Principiante', 'Intermedio', 'Avanzado', 'Experto'],
      default: 'Intermedio'
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'DevOps', 'Diseño', 'Otros'],
      required: true
    }
  }],
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    field: String,
    startDate: Date,
    endDate: Date,
    description: String,
    achievements: [String]
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    date: Date,
    credentialUrl: String,
    credentialId: String
  }],
  languages: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['Básico', 'Intermedio', 'Avanzado', 'Nativo'],
      required: true
    }
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
    behance: String,
    dribbble: String
  },
  bio: {
    type: String,
    maxLength: 1000
  },
  cvUrl: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de búsqueda
portfolioSchema.index({ user: 1 });
portfolioSchema.index({ 'projects.technologies': 1 });
portfolioSchema.index({ 'skills.name': 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio; 