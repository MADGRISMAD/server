const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniTalent API',
      version: '1.0.0',
      description: 'API para la plataforma UniTalent - Conectando estudiantes con oportunidades laborales',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['student', 'employer', 'admin'] },
            verified: { type: 'boolean' },
            university: { type: 'string' },
            major: { type: 'string' },
            graduationYear: { type: 'number' },
            currentSemester: { type: 'number' },
            gpa: { type: 'number' },
            skills: { type: 'array', items: { type: 'string' } },
            languages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  language: { type: 'string' },
                  level: { type: 'string', enum: ['básico', 'intermedio', 'avanzado', 'nativo'] }
                }
              }
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  company: { type: 'string' },
                  description: { type: 'string' },
                  startDate: { type: 'string', format: 'date' },
                  endDate: { type: 'string', format: 'date' },
                  isCurrent: { type: 'boolean' }
                }
              }
            },
            projects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  technologies: { type: 'array', items: { type: 'string' } },
                  url: { type: 'string' },
                  startDate: { type: 'string', format: 'date' },
                  endDate: { type: 'string', format: 'date' }
                }
              }
            },
            certifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  issuer: { type: 'string' },
                  date: { type: 'string', format: 'date' },
                  url: { type: 'string' }
                }
              }
            },
            socialLinks: {
              type: 'object',
              properties: {
                linkedin: { type: 'string' },
                github: { type: 'string' },
                portfolio: { type: 'string' }
              }
            },
            bio: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                country: { type: 'string' },
                isRemote: { type: 'boolean' }
              }
            },
            availability: { type: 'string', enum: ['full-time', 'part-time', 'internship', 'project-based'] },
            preferredSalary: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
                currency: { type: 'string', default: 'USD' }
              }
            },
            company: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                website: { type: 'string' },
                description: { type: 'string' }
              }
            }
          }
        },
        JobOffer: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            company: { type: 'string' },
            companyLogo: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            isRemote: { type: 'boolean' },
            salaryRange: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
                currency: { type: 'string', default: 'USD' },
                type: { type: 'string', enum: ['hora', 'mes', 'proyecto'] }
              }
            },
            duration: { type: 'string' },
            highlighted: { type: 'boolean' },
            applicants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'string', format: 'uuid' },
                  coverLetter: { type: 'string' },
                  appliedAt: { type: 'string', format: 'date-time' },
                  status: { type: 'string', enum: ['applied', 'viewed', 'interview', 'hired', 'rejected'] }
                }
              }
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            recipient: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: ['application', 'status', 'interview', 'admin'] },
            message: { type: 'string' },
            link: { type: 'string' },
            read: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            reviewer: {
              type: 'string',
              format: 'uuid',
              description: 'ID del usuario que hace la reseña'
            },
            reviewed: {
              type: 'string',
              format: 'uuid',
              description: 'ID del usuario calificado'
            },
            job: {
              type: 'string',
              format: 'uuid',
              description: 'ID del trabajo relacionado'
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Calificación general'
            },
            comment: {
              type: 'string',
              description: 'Comentario de la reseña'
            },
            categories: {
              type: 'object',
              properties: {
                professionalism: {
                  type: 'number',
                  minimum: 1,
                  maximum: 5
                },
                communication: {
                  type: 'number',
                  minimum: 1,
                  maximum: 5
                },
                punctuality: {
                  type: 'number',
                  minimum: 1,
                  maximum: 5
                },
                skills: {
                  type: 'number',
                  minimum: 1,
                  maximum: 5
                }
              }
            },
            isVerified: {
              type: 'boolean',
              description: 'Indica si la reseña ha sido verificada'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Recommendation: {
          type: 'object',
          properties: {
            student: {
              $ref: '#/components/schemas/User'
            },
            matchScore: {
              type: 'number',
              description: 'Puntaje de coincidencia (0-1)'
            },
            skillMatch: {
              type: 'number',
              description: 'Coincidencia de habilidades (0-1)'
            },
            experienceMatch: {
              type: 'number',
              description: 'Coincidencia de experiencia (0-1)'
            },
            ratingMatch: {
              type: 'number',
              description: 'Coincidencia de calificación (0-1)'
            }
          }
        },
        JobRecommendation: {
          type: 'object',
          properties: {
            job: {
              $ref: '#/components/schemas/Job'
            },
            matchScore: {
              type: 'number',
              description: 'Puntaje de coincidencia (0-1)'
            },
            skillMatch: {
              type: 'number',
              description: 'Coincidencia de habilidades (0-1)'
            },
            salaryMatch: {
              type: 'number',
              description: 'Coincidencia de salario (0-1)'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID del mensaje'
            },
            sender: {
              type: 'string',
              description: 'ID del remitente'
            },
            recipient: {
              type: 'string',
              description: 'ID del destinatario'
            },
            content: {
              type: 'string',
              description: 'Contenido del mensaje'
            },
            job: {
              type: 'string',
              description: 'ID del trabajo relacionado (opcional)'
            },
            read: {
              type: 'boolean',
              description: 'Estado de lectura del mensaje'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            }
          }
        },
        Conversation: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID del usuario de la conversación'
            },
            lastMessage: {
              $ref: '#/components/schemas/Message'
            },
            unreadCount: {
              type: 'integer',
              description: 'Número de mensajes no leídos'
            },
            user: {
              type: 'object',
              properties: {
                fullName: {
                  type: 'string'
                },
                role: {
                  type: 'string',
                  enum: ['student', 'employer']
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Archivos que contienen las anotaciones
};

module.exports = swaggerJsdoc(options);
