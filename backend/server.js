const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config(); // Load variables from a .env file locally

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: isProd ? process.env.FRONTEND_URL : '*',
  methods: ['GET', 'POST'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);
const io = new Server(server, { 
    cors: corsOptions,
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 60000
});

// Use the PORT provided by the hosting service (Render) or 5000 locally
const PORT = process.env.PORT || 5000;

// Use the MONGO_URI from Atlas (Online) or a local DB string
const dbURI = process.env.MONGO_URI || 'mongodb+srv://adia12528_db_user:A12528@as@cluster0.8q6h4e9.mongodb.net/devchat?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch(err => console.log("❌ DB Connection Error:", err));

const MsgSchema = new mongoose.Schema({
    room: String,
    sender: String,
    text: String,
    time: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MsgSchema);

io.on('connection', (socket) => {
    socket.on('join_room', async (room) => {
        socket.join(room);
        // Fetch message history for the specific room
        const history = await Message.find({ room }).sort({ time: 1 }).limit(100);
        socket.emit('load_history', history);
    });

    socket.on('send_message', async (data) => {
        if (!data.text.trim()) return;
        
        const newMessage = new Message({
            room: data.room,
            sender: data.sender,
            text: data.text,
            time: new Date()
        });
        
        await newMessage.save();
        
        // Broadcast to everyone in the room (including sender)
        io.in(data.room).emit("receive_message", newMessage);
    });

    socket.on('clear_chat', async (room) => {
        await Message.deleteMany({ room });
        io.in(room).emit('chat_cleared');
    });

    socket.on('disconnect', () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server live on port ${PORT}`);
    console.log(`📝 Environment: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: isProd ? 'Internal server error' : err.message });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});