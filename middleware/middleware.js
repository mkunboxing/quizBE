const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.', success: false });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here
    req.user = verified; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.', success: false });
  }
};

module.exports = authMiddleware;
