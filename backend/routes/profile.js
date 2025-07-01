const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getProfile, updateProfile } = require('../controllers/profilePage');
// const Profile = require('../models/profile/userProfile');
const BlogController = require('../controllers/blog');
const ActivityController = require('../controllers/activityController');
router.get('/profile', auth, getProfile);
router.put('/profile',auth, updateProfile);
router.get('/profile/user-blogs',auth, BlogController.getBlogsByUserId); 
router.get('/profile/user-activities',auth, ActivityController.getUserActivities);

module.exports = router;
