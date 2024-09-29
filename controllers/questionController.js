const Questions = require('../models/Questions');

// Create a new question
const createQuestion = async (req, res) => {
  const { card, question, options, correctAnswerId } = req.body;

  // Validate required fields
  if (!card || !question || !options || !correctAnswerId) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Create a new question instance
    const newQuestion = new Questions({
      card, // This will now be a string cardId
      question,
      options,
      correctAnswerId,
    });

    // Save the question to the database
    const savedQuestion = await newQuestion.save();
    res.status(201).json({ message: 'Question created successfully', data: savedQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get questions by cardId
const getQuestionsByCardId = async (req, res) => {
  const { cardId } = req.params;

  try {
    // Fetch questions associated with the given cardId
    const questions = await Questions.find({ card: cardId });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this card' });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export the controller functions
module.exports = {
  createQuestion,
  getQuestionsByCardId,
};
