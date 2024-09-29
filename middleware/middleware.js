const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Change this to a secure secret in production

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = decoded.userId; // Store user ID for use in protected routes
    next();
  });
};

module.exports = authenticate;
