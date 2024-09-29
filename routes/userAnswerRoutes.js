const express = require('express');
const { submitAnswer, getQuestionReview, getTotalPointsByCard } = require('../controllers/UserAnswerController');
const router = express.Router();

// Route for submitting answers
router.post('/save-answer', submitAnswer);

// Route for getting question review
router.get('/review/:userId/:cardId', getQuestionReview);

router.get('/points/:cardId', getTotalPointsByCard);

module.exports = router;
