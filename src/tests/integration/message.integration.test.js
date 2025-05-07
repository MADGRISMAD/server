const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/User');
const Job = require('../../models/Job');
const jwt = require('jsonwebtoken');

let mongoServer;
let studentToken;
let employerToken;
let student;
let employer;
let job;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Crear usuarios de prueba
  student = await User.create({
    fullName: 'Estudiante Test',
    email: 'student@test.com',
    password: 'password123',
    role: 'student'
  });

  employer = await User.create({
    fullName: 'Empleador Test',
    email: 'employer@test.com',
    password: 'password123',
    role: 'employer'
  });

  // Crear trabajo de prueba
  job = await Job.create({
    title: 'Trabajo Test',
    description: 'Descripción test',
    creator: employer._id,
    requiredSkills: ['JavaScript', 'Node.js']
  });

  // Generar tokens
  studentToken = jwt.sign(
    { id: student._id },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );

  employerToken = jwt.sign(
    { id: employer._id },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
});

describe('Message API Integration Tests', () => {
  describe('POST /api/messages', () => {
    it('debería permitir a un estudiante enviar un mensaje a un empleador', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          recipientId: employer._id,
          content: 'Hola, estoy interesado en el trabajo',
          jobId: job._id
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('content', 'Hola, estoy interesado en el trabajo');
      expect(response.body).toHaveProperty('sender', student._id.toString());
      expect(response.body).toHaveProperty('recipient', employer._id.toString());
    });

    it('debería retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({
          recipientId: employer._id,
          content: 'Mensaje test'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/messages/conversation/:userId', () => {
    it('debería obtener la conversación entre dos usuarios', async () => {
      // Primero enviar algunos mensajes
      await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          recipientId: employer._id,
          content: 'Mensaje 1'
        });

      await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          recipientId: student._id,
          content: 'Respuesta 1'
        });

      const response = await request(app)
        .get(`/api/messages/conversation/${employer._id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('messages');
      expect(response.body.messages).toHaveLength(2);
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('totalMessages', 2);
    });
  });

  describe('PUT /api/messages/read/:userId', () => {
    it('debería marcar los mensajes como leídos', async () => {
      // Primero enviar algunos mensajes no leídos
      await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          recipientId: student._id,
          content: 'Mensaje no leído 1'
        });

      await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({
          recipientId: student._id,
          content: 'Mensaje no leído 2'
        });

      const response = await request(app)
        .put(`/api/messages/read/${employer._id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Mensajes marcados como leídos');
    });
  });

  describe('GET /api/messages/recent', () => {
    it('debería obtener las conversaciones recientes', async () => {
      // Primero enviar algunos mensajes
      await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          recipientId: employer._id,
          content: 'Mensaje reciente'
        });

      const response = await request(app)
        .get('/api/messages/recent')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('_id');
      expect(response.body[0]).toHaveProperty('lastMessage');
      expect(response.body[0]).toHaveProperty('unreadCount');
      expect(response.body[0]).toHaveProperty('user');
    });
  });
}); 