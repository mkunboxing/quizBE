const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURL, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
