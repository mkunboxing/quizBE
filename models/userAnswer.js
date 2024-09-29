const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Questions',
    required: true,
  },
  userSelectedOption: {
    type: String,
    required: true,
  },
  correctAnswerId: {
    type: String,
    required: true,
  },
  takenTime: {
    type: Number, // Time in seconds
    required: true,
  },
  pointsEarned: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);
