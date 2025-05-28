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
// const allowedOrigins = ['https://jtaskhubbeta.com.au','http://localhost:3000', 'https://api.jtaskhubbeta.com.au'];
const rawOrigins = process.env.CORS_ORIGIN_WEB_SOCKET || '';
const allowedOrigins = [
  'http://localhost:3000',
  ...rawOrigins.split(',').map(origin => origin.trim())
];

// Import models
const User = require('./models/User');
const Message = require('./models/Message');
const BlacklistedToken = require('./models/BlacklistedToken');

const app = express();
const server = http.createServer(app);

// Middleware

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));
  
  app.use(express.json());

  app.set('trust proxy', 1);

  app.use((req, res, next) => {
    console.log(`💡 Incoming: ${req.method} ${req.originalUrl}`);
    next();
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize Socket.io
const io = initializeSocket(server);
app.set('io', io);  // ✅ Add this line


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

        await sequelize.sync(); // no `force` means it won't drop anything
        console.log('✅ Database models synchronized.');

        server.listen(PORT,'0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
            console.log(`🗃 Connected to DB: ${process.env.DB_NAME}`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
}

startServer();
