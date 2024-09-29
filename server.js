const express = require('express');
const connectDB = require('./config/db');  // Import the connection file
const cardRoutes = require('./routes/cardRoutes');
const quizRoutes = require('./routes/questionsRoutes');
const authRoutes = require('./routes/authRoutes');
const userAnswerRoutes = require('./routes/userAnswerRoutes');
const authenticate = require('./middleware/middleware');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'https://quizy-orcin.vercel.app'],
  }));

app.use(cors());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello Quiz' });
});
// Routes
app.use('/api/cards', cardRoutes);
app.use('/api/question', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ans',userAnswerRoutes)

app.get('/api/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route', userId: req.userId });
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
