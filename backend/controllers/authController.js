require('dotenv').config();
const JsonWebTokenError = require('jsonwebtoken');

const checkAuth = (req, res) => {
  try {
    const token = req.cookies.token;

    console.log(token + "for check auth");
    const user = JsonWebTokenError.verify(token, process.env.JWT_SECRET);
    console.log(user);
    if (user == null) {
      return res.status(401).json({
        isAuthenticated: false,
        error: 'Authentication failed',
        message: 'Token not found'
      });
    }
    else {
      return res.status(200).json({
        isAuthenticated: true,
        user: user
      });
    }
  }
  catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      error: 'Authentication check failed',
      message: error.message
    });
  }
};

module.exports = { checkAuth };