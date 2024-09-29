const Answer = require('../models/userAnswer');
const Questions = require('../models/Questions');
const User = require('../models/User');

const submitAnswer = async (req, res) => {
  const { userId, cardId, questionId, userSelectedOption, takenTime } = req.body;

  try {
    const question = await Questions.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = question.correctAnswerId === userSelectedOption;
    const pointsEarned = isCorrect ? 4 : 0; // Assume 4 points for correct, 0 for wrong

    // Find the answer by userId and questionId and update it, or insert a new document if it doesn't exist
    const answer = await Answer.findOneAndUpdate(
      { user: userId, question: questionId },
      {
        user: userId,
        card: cardId,
        question: questionId,
        userSelectedOption,
        correctAnswerId: question.correctAnswerId,
        takenTime,
        pointsEarned,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true } // upsert creates a new document if it doesn't exist
    );

    res.status(201).json({
      message: 'Answer saved successfully',
      success: true,
      data: answer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


const getQuestionReview = async (req, res) => {
  const { userId, cardId } = req.params;

  try {
    const reviewData = await Answer.find({ user: userId, card: cardId })
      .populate('question', 'question options correctAnswerId') // populate the actual question data
      .populate('card', 'title') // populate card details

    if (!reviewData) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review fetched successfully',
      success: true,
      data: reviewData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getTotalPointsAndUserName = async (req, res) => {
  const { cardId } = req.params;

  try {
    // Fetch all answers for the given cardId and populate the user data
    const answers = await Answer.find({ card: cardId })
      .populate('user', 'fname'); // Populate the user's name

    if (!answers || answers.length === 0) {
      return res.status(404).json({ message: 'No answers found for this card', success: false });
    }

    // Create a map to store points per user
    const userPointsMap = {};

    // Calculate points per unique user for this card
    answers.forEach((answer) => {
      const userId = answer.user._id.toString();
      const userName = answer.user.fname;
      const pointsEarned = answer.pointsEarned || 0;

      // If the userId already exists, add the points; otherwise, initialize with current points
      if (userPointsMap[userId]) {
        userPointsMap[userId].totalPoints += pointsEarned;
      } else {
        userPointsMap[userId] = {
          userName: userName || 'Unknown User', // Use 'Unknown User' if fname is missing
          totalPoints: pointsEarned,
        };
      }
    });

    // Convert the map to an array for easier processing and response
    const results = Object.keys(userPointsMap).map((userId) => ({
      userId,
      userName: userPointsMap[userId].userName,
      totalPoints: userPointsMap[userId].totalPoints,
    }));

    res.status(200).json({
      message: 'Total points and user names fetched successfully',
      success: true,
      data: results, // Returning list of users with their total points for the given cardId
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Add points to the user's total points
const addPointsToUser = async (req, res) => {
  const { userId, pointsToAdd } = req.body; // Assuming userId and pointsToAdd are sent in the request body
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    user.totalPoints += pointsToAdd;
    await user.save();
    res.status(200).json({
      message: 'Points added successfully',
      success: true,
      data: {
        userId: user._id,
        userName: user.fname,
        totalPoints: user.totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getUserPoints = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Return the total points of the user
    res.status(200).json({
      message: 'User points fetched successfully',
      success: true,
      data: {
        userId: user._id,
        userName: user.fname,
        totalPoints: user.totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};





module.exports = {
  submitAnswer,
  getQuestionReview,
  getTotalPointsByCard: getTotalPointsAndUserName,
  addPointsToUser,
  getUserPoints,
};
