const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

const connectedUsers = new Map();

module.exports = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                console.warn('⚠️ Socket rejected: missing token');
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) {
                console.warn('⚠️ Socket rejected: invalid token');
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.id);
        connectedUsers.set(socket.user.id, socket.id);

        // Update user's online status
        User.update(
            { isOnline: true, lastSeen: new Date() },
            { where: { id: socket.user.id } }
        );

        // Join user's personal room
        socket.join(socket.user.id);

        // Handle new messages
        socket.on('message', async (messageData) => {
            try {
                const { receiverId, content } = messageData;
                const senderId = socket.user.id;

                // Create message in database
                const message = await Message.create({
                    content,
                    senderId,
                    receiverId
                });

                // Fetch complete message with associations
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

                // Emit to sender and receiver
                io.to(senderId).to(receiverId).emit('message', completeMessage);
            } catch (error) {
                console.error('Error handling message:', error);
                socket.emit('error', { message: 'Error sending message' });
            }
        });

        // Handle typing status
        socket.on('typing', ({ receiverId, typing }) => {
            socket.to(receiverId).emit('typing', {
                userId: socket.user.id,
                typing
            });
        });

        // Handle message read status
        socket.on('messageRead', async ({ messageId, senderId }) => {
            try {
                await Message.update(
                    { read: true },
                    { where: { id: messageId } }
                );

                io.to(senderId).emit('messageRead', { messageId });
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.user.id);
            connectedUsers.delete(socket.user.id);

            // Update user's offline status
            await User.update(
                { isOnline: false, lastSeen: new Date() },
                { where: { id: socket.user.id } }
            );

            // Notify others about user's offline status
            io.emit('userStatus', {
                userId: socket.user.id,
                isOnline: false
            });
        });
    });

    // Make io instance available to routes
    io.app = io;
}; 