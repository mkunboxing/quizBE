const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Route for creating a question
router.post('/', questionController.createQuestion);

// Route for getting questions by card ID
router.get('/:cardId', questionController.getQuestionsByCardId);

module.exports = router;
