const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.userId}`);
        
        // Update user status to online
        await User.update({ isOnline: true }, { where: { id: socket.userId } });
        
        // Join personal room
        socket.join(socket.userId);

        // Handle private messages
        socket.on('private-message', async (data) => {
            io.to(data.receiverId).emit('new-message', {
                content: data.content,
                senderId: socket.userId,
                receiverId: data.receiverId
            });
        });

        // Handle typing status
        socket.on('typing', (data) => {
            socket.to(data.receiverId).emit('user-typing', {
                senderId: socket.userId
            });
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            await User.update(
                { 
                    isOnline: false,
                    lastSeen: new Date()
                }, 
                { where: { id: socket.userId } }
            );
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
}

module.exports = initializeSocket; 