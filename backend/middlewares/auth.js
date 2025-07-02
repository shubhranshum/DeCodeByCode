const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET="shubh@123#1234#12345#";

async function auth(req, res, next) {
    // console.log(req)
  const token = req.cookies.token;
  // console.log(req.cookies);

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;
