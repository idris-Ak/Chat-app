const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        console.log('Received message request:', { receiverId, content, senderId });

        // Check if recipient exists
        const recipient = await User.findByPk(receiverId);
        if (!recipient) {
            console.log('Recipient not found:', receiverId);
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Create message with associations
        const message = await Message.create({
            content,
            senderId,
            receiverId
        });

        console.log('Message created:', message.id);

        // Fetch the complete message with all necessary associations
        const completeMessage = await Message.findByPk(message.id, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar']
                },
                {
                    model: User,
                    as: 'recipient',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });

        // Emit the message through socket if available
        if (req.app.get('io')) {
            req.app.get('io').to(receiverId).emit('message', completeMessage);
        }

        console.log('Complete message:', completeMessage);
        res.status(201).json(completeMessage);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Error sending message', error: error.message });
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
                    as: 'recipient',
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
        const userId = req.user.id;

        const message = await Message.findByPk(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Ensure user is the recipient of the message
        if (message.receiverId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await message.update({ read: true });

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Error marking message as read', error: error.message });
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