const models = require('../Model/index');
const { Op } = require('sequelize');

// ─────────────────────────────
// Send a message
exports.sendMessage = async (req, res) => {
    try {
      const senderId = req.user.userId;
      const { receiverId, content } = req.body;
  
      if (!receiverId || !content) {
        return res.status(400).json({ message: 'Receiver and content are required.' });
      }
  
      const message = await models.message.create({
        senderId,
        receiverId,
        content
      });
  
      res.status(201).json({ message: 'Message sent', data: message });
    } catch (err) {
      console.error('Error sending message:', err);
      res.status(500).json({ message: 'Failed to send message' });
    }
  };

// ─────────────────────────────
// Get chat between two users (sender and receiver)
exports.getChatWithUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const userId = req.user.userId;
    const { otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({ message: 'Other user ID is required' });
    }

    const messages = await models.message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      offset,
      limit,
      order: [['updatedAt', 'DESC']], // Sort by updatedAt in descending order
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Get Chat Error:', err);
    res.status(500).json({ message: 'Failed to load chat messages.' });
  }
};