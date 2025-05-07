const autocannon = require('autocannon');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/User');
const Job = require('../../models/Job');
const jwt = require('jsonwebtoken');

let mongoServer;
let server;
let studentToken;
let employerToken;
let student;
let employer;
let job;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

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

  // Iniciar servidor
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Message API Load Tests', () => {
  it('debería manejar múltiples solicitudes de envío de mensajes', async () => {
    const instance = autocannon({
      url: `http://localhost:${server.address().port}/api/messages`,
      connections: 100,
      duration: 10,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        recipientId: employer._id,
        content: 'Mensaje de prueba',
        jobId: job._id
      })
    });

    const result = await instance;
    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.requests.average).toBeGreaterThan(0);
    expect(result.latency.p99).toBeLessThan(1000); // 99% de las solicitudes deben completarse en menos de 1 segundo
  });

  it('debería manejar múltiples solicitudes de obtención de conversaciones', async () => {
    const instance = autocannon({
      url: `http://localhost:${server.address().port}/api/messages/conversation/${employer._id}`,
      connections: 100,
      duration: 10,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    const result = await instance;
    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.requests.average).toBeGreaterThan(0);
    expect(result.latency.p99).toBeLessThan(1000);
  });

  it('debería manejar múltiples solicitudes de conversaciones recientes', async () => {
    const instance = autocannon({
      url: `http://localhost:${server.address().port}/api/messages/recent`,
      connections: 100,
      duration: 10,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    const result = await instance;
    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.requests.average).toBeGreaterThan(0);
    expect(result.latency.p99).toBeLessThan(1000);
  });

  it('debería manejar múltiples solicitudes de marcar mensajes como leídos', async () => {
    const instance = autocannon({
      url: `http://localhost:${server.address().port}/api/messages/read/${employer._id}`,
      connections: 100,
      duration: 10,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    const result = await instance;
    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.requests.average).toBeGreaterThan(0);
    expect(result.latency.p99).toBeLessThan(1000);
  });
}); 