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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'employer', 'admin'],
    default: 'student',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  university: String,           // solo aplica a estudiantes
  major: String,                    // Carrera o especialización
  graduationYear: Number,           // Año de graduación esperado
  currentSemester: Number,          // Semestre actual
  gpa: Number,                      // Promedio académico
  skills: [String],             // solo aplica a estudiantes
  languages: [{                     // Idiomas que domina
    language: String,
    level: {
      type: String,
      enum: ['básico', 'intermedio', 'avanzado', 'nativo']
    }
  }],
  experience: [{                    // Experiencia laboral/voluntariado
    title: String,
    company: String,
    description: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean
  }],
  projects: [{                      // Proyectos personales o académicos
    name: String,
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date
  }],
  certifications: [{                // Certificaciones
    name: String,
    issuer: String,
    date: Date,
    url: String
  }],
  socialLinks: {                    // Enlaces a perfiles profesionales
    linkedin: String,
    github: String,
    portfolio: String
  },
  bio: String,                      // Biografía o resumen profesional
  location: {                       // Ubicación
    city: String,
    country: String,
    isRemote: Boolean
  },
  availability: {                   // Disponibilidad
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'project-based'],
    default: 'full-time'
  },
  preferredSalary: {                // Expectativa salarial
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },

  company: {                    // solo aplica a empresas
    name: String,
    website: String,
    description: String,
  },

  verificationToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  categoryRatings: {
    professionalism: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    punctuality: { type: Number, default: 0 },
    skills: { type: Number, default: 0 }
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  favoriteJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
});

module.exports = mongoose.model('User', userSchema);
