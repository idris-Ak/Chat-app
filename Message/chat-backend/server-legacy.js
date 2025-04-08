const express = require('express');
const cors = require('cors');
const http = require('http');

const { sequelize, createDatabase } = require('./config/db');
const initializeSocket = require('./Socket');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const auth = require('./middleware/auth');

// Import models
const User = require('./models/User');
const Message = require('./models/Message');
const BlacklistedToken = require('./models/BlacklistedToken');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Initialize Socket.io
const io = initializeSocket(server);

// Set up associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Database connection and server start
const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        // Create database if it doesn't exist
        await createDatabase();

        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized.');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

startServer();