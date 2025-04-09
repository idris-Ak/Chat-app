
require('dotenv').config({ path: __dirname + '/.env' });

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

// Graceful crash visibility for async errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Database connection and server start
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await createDatabase();
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        await sequelize.sync({ force: true });
        console.log('✅ Database models synchronized.');

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
            console.log(`🗃 Connected to DB: ${process.env.DB_NAME}`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
}

startServer();
