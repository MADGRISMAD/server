const Message = require('../models/Message');
const User = require('../models/User');
const Job = require('../models/Job');

// Enviar un mensaje
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, jobId } = req.body;

    // Verificar que el destinatario existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Destinatario no encontrado' });
    }

    // Si se especifica un trabajo, verificar que existe
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Trabajo no encontrado' });
      }
    }

    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
      job: jobId
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
};

// Obtener conversación con un usuario
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('sender', 'fullName')
    .populate('recipient', 'fullName')
    .populate('job', 'title');

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    });

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la conversación' });
  }
};

// Marcar mensajes como leídos
exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user._id,
        read: false
      },
      {
        read: true
      }
    );

    res.json({ message: 'Mensajes marcados como leídos' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al marcar mensajes como leídos' });
  }
};

// Obtener conversaciones recientes
exports.getRecentConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', req.user._id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          unreadCount: 1,
          'user.fullName': 1,
          'user.role': 1
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener conversaciones recientes' });
  }
}; 