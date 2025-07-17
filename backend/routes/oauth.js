const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "shubh@123#1234#12345#";

// ========== Google OAuth Start ==========
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user;
      console.log(user);

      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2d' });

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set true in production with HTTPS
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      // Optional: redirect to frontend
      res.redirect('http://localhost:5173/home');
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.redirect('/login');
      res.status(500).json({ message: 'OAuth failed internally' });
    }
  }
);
// ========== Google OAuth End ==========


// ========== GitHub OAuth Start ==========
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate JWT
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2d' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.redirect('http://localhost:5173/home');
    } catch (err) {
      console.error('GitHub OAuth callback error:', err);
      res.redirect('/login');
      res.status(500).json({ message: 'OAuth failed internally' });
    }
  }
);
// ========== GitHub OAuth End ==========

module.exports = router;
