const Card = require('../models/Card');

// Fetch all cards
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch a specific card by ID
const getCardByCardId = async (req, res) => {
  const { cardId } = req.params; // Get cardId from request parameters
  try {
    // Find card by the custom cardId (not the MongoDB _id)
    const card = await Card.findOne({ cardId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new card
const createCard = async (req, res) => {
  const { image, title, cardId } = req.body;

  try {
    const newCard = new Card({
      image,
      title,
      cardId,
    });

    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCards,
  getCardByCardId,
  createCard,
};
