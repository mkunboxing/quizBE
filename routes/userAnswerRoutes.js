const express = require('express');
const { submitAnswer, getQuestionReview, getTotalPointsByCard, addPointsToUser, getUserPoints } = require('../controllers/UserAnswerController');
const authMiddleware = require('../middleware/middleware');
const router = express.Router();

// Route for submitting answers
router.post('/save-answer', submitAnswer);

// Route for getting question review
router.get('/review/:userId/:cardId', getQuestionReview);

router.get('/points/:cardId', getTotalPointsByCard);

// Route for adding points to a user
router.post('/add-points', authMiddleware, addPointsToUser);

router.get('/user-points/:userId', authMiddleware, getUserPoints);

module.exports = router;
