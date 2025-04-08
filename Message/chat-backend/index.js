require('dotenv').config(); // Must be first
console.log("🔍 DB ENV LOADED:");
console.log("    DB_USER:", process.env.DB_USER);
console.log("    DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("    DB_HOST:", process.env.DB_HOST);
console.log("    DB_NAME:", process.env.DB_NAME);


const express = require('express');
const http = require('http');
const cors = require('cors');

// App logic
const { sequelize, createDatabase } = require('./config/db');
const initializeSocket = require('./Socket'); // assumed to export socket setup function
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app); // Needed for socket.io
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Sockets
initializeSocket(server); // attaches socket handlers to same server

// DB Sync & Start
async function startServer() {
  try {
    await createDatabase();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
