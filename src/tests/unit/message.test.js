const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Message = require('../../models/Message');
const User = require('../../models/User');
const Job = require('../../models/Job');
const messageController = require('../../controllers/message.controller');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Message.deleteMany({});
  await User.deleteMany({});
  await Job.deleteMany({});
});

describe('Message Controller Tests', () => {
  let sender;
  let recipient;
  let job;

  beforeEach(async () => {
    // Crear usuarios de prueba
    sender = await User.create({
      fullName: 'Remitente Test',
      email: 'sender@test.com',
      password: 'password123',
      role: 'student'
    });

    recipient = await User.create({
      fullName: 'Destinatario Test',
      email: 'recipient@test.com',
      password: 'password123',
      role: 'employer'
    });

    // Crear trabajo de prueba
    job = await Job.create({
      title: 'Trabajo Test',
      description: 'Descripción test',
      creator: recipient._id,
      requiredSkills: ['JavaScript', 'Node.js']
    });
  });

  describe('sendMessage', () => {
    it('debería enviar un mensaje exitosamente', async () => {
      const req = {
        user: { _id: sender._id },
        body: {
          recipientId: recipient._id,
          content: 'Hola, estoy interesado en el trabajo',
          jobId: job._id
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await messageController.sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        sender: sender._id,
        recipient: recipient._id,
        content: 'Hola, estoy interesado en el trabajo',
        job: job._id
      }));
    });

    it('debería retornar error si el destinatario no existe', async () => {
      const req = {
        user: { _id: sender._id },
        body: {
          recipientId: new mongoose.Types.ObjectId(),
          content: 'Mensaje test'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await messageController.sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Destinatario no encontrado'
      });
    });
  });

  describe('getConversation', () => {
    beforeEach(async () => {
      // Crear algunos mensajes de prueba
      await Message.create([
        {
          sender: sender._id,
          recipient: recipient._id,
          content: 'Mensaje 1',
          job: job._id
        },
        {
          sender: recipient._id,
          recipient: sender._id,
          content: 'Respuesta 1',
          job: job._id
        }
      ]);
    });

    it('debería obtener la conversación correctamente', async () => {
      const req = {
        user: { _id: sender._id },
        params: { userId: recipient._id },
        query: { page: 1, limit: 10 }
      };

      const res = {
        json: jest.fn()
      };

      await messageController.getConversation(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.any(String)
          })
        ]),
        currentPage: 1,
        totalPages: expect.any(Number),
        totalMessages: expect.any(Number)
      }));
    });
  });

  describe('markAsRead', () => {
    beforeEach(async () => {
      // Crear mensajes no leídos
      await Message.create([
        {
          sender: recipient._id,
          recipient: sender._id,
          content: 'Mensaje no leído 1',
          read: false
        },
        {
          sender: recipient._id,
          recipient: sender._id,
          content: 'Mensaje no leído 2',
          read: false
        }
      ]);
    });

    it('debería marcar los mensajes como leídos', async () => {
      const req = {
        user: { _id: sender._id },
        params: { userId: recipient._id }
      };

      const res = {
        json: jest.fn()
      };

      await messageController.markAsRead(req, res);

      const unreadMessages = await Message.find({
        sender: recipient._id,
        recipient: sender._id,
        read: false
      });

      expect(unreadMessages).toHaveLength(0);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Mensajes marcados como leídos'
      });
    });
  });
}); 