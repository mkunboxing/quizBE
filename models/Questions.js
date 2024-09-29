const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  card: {
    type: String, // Change from ObjectId to String
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      answerId: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  correctAnswerId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Questions', questionSchema);
