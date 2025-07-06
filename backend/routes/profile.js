const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getSolvedProblemsByUsername, getSolvedProblems} = require('../controllers/getSolvedProblems');
const {getAttemptedProblems, getAttemptedProblemsByUsername} = require('../controllers/getAttemptedProblem')
const { getProfile, updateProfile, getProfileByUserName} = require('../controllers/profilePage');
// const Profile = require('../models/profile/userProfile');
const BlogController = require('../controllers/blog');
const ActivityController = require('../controllers/activityController');
router.get('/profile', auth, getProfile);
router.get('/profile/user/:username', getProfileByUserName);
router.put('/profile',auth, updateProfile);
router.get('/profile/user-blogs',auth, BlogController.getBlogsByUserId); 
router.get('/profile/user-activities',auth, ActivityController.getUserActivities);

//for solved
router.get('/profile/solved-problems',auth, getSolvedProblems);
router.get('/profile/solved-problems/:username', getSolvedProblemsByUsername);


//for attempted 
router.get('/profile/recent-attempts/', auth, getAttemptedProblems);
router.get('/profile/recent-attempts/:username',getAttemptedProblemsByUsername)

module.exports = router;
