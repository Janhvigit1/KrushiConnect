import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { socketAuth } from './sockets/socketAuth.js';
import { registerChatHandlers } from './sockets/chatHandler.js';
import { registerCallHandlers } from './sockets/callHandler.js';
import { cleanupExpiredStories } from './utils/storyCleaner.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import discoverRoutes from './routes/discoverRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import callRoutes from './routes/callRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express & HTTP server
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'KrushiConnect Farmer Platform API',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/conversations', chatRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Authentication middleware for Sockets
io.use(socketAuth);

// Track online users & active calls
const onlineUsers = new Map(); // userId -> socketId
const activeCalls = new Map(); // callId -> metadata

io.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  onlineUsers.set(userId, socket.id);

  // Join personal room for private notifications
  socket.join(`user:${userId}`);

  // Broadcast online presence to others
  socket.broadcast.emit('user:online', {
    userId,
    name: socket.user.name
  });

  // Register chat & WebRTC call handlers
  registerChatHandlers(io, socket, onlineUsers);
  registerCallHandlers(io, socket, activeCalls);

  // Send current online users list to connecting user
  socket.emit('presence:online_list', Array.from(onlineUsers.keys()));

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    socket.broadcast.emit('user:offline', { userId });
  });
});

// Periodic cleanup of expired stories every hour
setInterval(cleanupExpiredStories, 60 * 60 * 1000);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 KrushiConnect Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
