const express = require('express');
const connectDB = require('./config/db');
const cardRoutes = require('./routes/cardRoutes');
const quizRoutes = require('./routes/questionsRoutes');
const authRoutes = require('./routes/authRoutes');
const userAnswerRoutes = require('./routes/userAnswerRoutes');
const authenticate = require('./middleware/middleware');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

// Socket.IO setup
const io = require('socket.io')(http, {
  cors: {
    origin: ["http://localhost:3000", "https://quizy-orcin.vercel.app", "https://quizy1.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://quizy-orcin.vercel.app', 'https://quizy1.vercel.app'],
  credentials: true
}));

// Store connected users
const users = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('userJoined', username);
    io.emit('userList', Array.from(users.values()));
  });

  socket.on('message', (message) => {
    const username = users.get(socket.id);
    io.emit('message', {
      username,
      text: message,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userLeft', username);
    io.emit('userList', Array.from(users.values()));
    console.log('User disconnected');
  });
});

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello Quiz' });
});

app.use('/api/cards', cardRoutes);
app.use('/api/question', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ans', userAnswerRoutes);

app.get('/api/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route', userId: req.userId });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server (using http.listen instead of app.listen)
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});