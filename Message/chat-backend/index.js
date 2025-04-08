require('dotenv').config({ path: __dirname + '/.env' });


console.log("🔍 DB ENV LOADED:");
console.log("    DB_USER:", process.env.DB_USER);
console.log("    DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("    DB_HOST:", process.env.DB_HOST);
console.log("    DB_NAME:", process.env.DB_NAME);

const express = require('express');
const http = require('http');
const cors = require('cors');

const { sequelize, createDatabase } = require('./config/db');
const initializeSocket = require('./Socket');

const User = require('./models/User');
const Message = require('./models/Message');
const BlacklistedToken = require('./models/BlacklistedToken');

// Sequelize Associations (critical)
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Sockets
initializeSocket(server);

// Graceful crash visibility for async errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// DB Sync & Start
async function startServer() {
  try {
    await createDatabase();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`🗃 Connected to DB: ${process.env.DB_NAME}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
