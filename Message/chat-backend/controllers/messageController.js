const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !content) {
            return res.status(400).json({ message: 'receiverId and content are required' });
        }

        const message = await Message.create({
            senderId,
            receiverId,
            content,
            read: false
        });

        // If you're using Socket.io, emit the message to the receiver
        if (req.app.get('io')) {
            req.app.get('io').to(receiverId).emit('message', message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        console.log('Fetching messages between users:', { currentUserId, userId });

        // Validate UUIDs
        if (!userId || !currentUserId) {
            console.error('Invalid user IDs:', { currentUserId, userId });
            return res.status(400).json({ message: 'Invalid user IDs provided' });
        }

        // First check if both users exist
        const [currentUser, otherUser] = await Promise.all([
            User.findByPk(currentUserId),
            User.findByPk(userId)
        ]);

        if (!currentUser || !otherUser) {
            console.error('One or both users not found:', { currentUserId, userId });
            return res.status(404).json({ message: 'One or both users not found' });
        }

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

        console.log(`Found ${messages.length} messages`);
        res.json(messages);
    } catch (error) {
        console.error('Error in getMessages:', error);
        res.status(500).json({ 
            message: 'Error retrieving messages', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        
        await Message.update(
            { isRead: true },
            { 
                where: { 
                    id: messageId,
                    receiverId: req.user.id
                }
            }
        );

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Error updating message' });
    }
};

exports.getAllMessages = async (req, res) => {
    const { senderId, receiverId } = req.query;
    try {
        const messages = await Message.findAll({
            where: {
                senderId,
                receiverId
            }
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

exports.createMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        const message = await Message.create({ senderId, receiverId, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error creating message', error });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: userId },
                    { senderId: userId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ message: 'Error retrieving messages' });
    }
};