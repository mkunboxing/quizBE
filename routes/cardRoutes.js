const express = require('express');
const { getAllCards, createCard, getCardByCardId } = require('../controllers/cardController');
const router = express.Router();

// Get all cards
router.get('/', getAllCards);

// Get a specific card by ID
router.get('/:cardId', getCardByCardId);

// Create a new card
router.post('/', createCard);

module.exports = router;
