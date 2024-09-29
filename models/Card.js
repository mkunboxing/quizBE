const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cardId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = model('Card', cardSchema);
