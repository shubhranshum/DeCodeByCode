const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getProfile } = require('../controllers/profilePage');
const Profile = require('../models/profile/userProfile');
const BlogController = require('../controllers/blog');

router.get('/profile', auth, getProfile);
router.get('/profile/user-blogs',auth, BlogController.getBlogsByUserId); 

module.exports = router;
