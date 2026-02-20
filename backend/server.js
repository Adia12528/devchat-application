const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load variables from a .env file locally

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { 
    cors: { 
        origin: "*", // In production, replace with your specific frontend URL
        methods: ["GET", "POST"] 
    } 
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

server.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));