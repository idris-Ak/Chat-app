const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        // Check if receiver exists
        const receiver = await User.findByPk(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Create message
        const message = await Message.create({
            content,
            senderId,
            receiverId
        });

        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        // Get conversation messages
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: userId },
                    { senderId: userId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username']
                },
                {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username']
                }
            ]
        });

        res.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Error retrieving messages' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;

        const message = await Message.findByPk(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Ensure user is the receiver of the message
        if (message.receiverId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await message.update({ read: true });

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Error marking message as read' });
    }
};

exports.getAllMessages = async (req, res) => {
    const { senderId, recipientId } = req.query;
    try {
        const messages = await Message.findAll({
            where: {
                senderId,
                recipientId
            }
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

exports.createMessage = async (req, res) => {
    const { senderId, recipientId, content } = req.body;
    try {
        const message = await Message.create({ senderId, recipientId, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error creating message', error });
    }
};