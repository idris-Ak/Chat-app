const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const socketManager = require('./socketManager');
const { sequelize } = require('./config/db');
const { User, Message } = require('./models/associations');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io instance available to routes
app.set('io', io);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Initialize socket manager
socketManager(io);

const PORT = process.env.PORT || 3001;

// Sync database and start server
async function initializeServer() {
  try {
    // Force sync in development only
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synced successfully');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

initializeServer(); 