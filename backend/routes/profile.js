const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const noAuth = require('../middlewares/noAuth');
const { getSolvedProblemsByUsername, getSolvedProblems} = require('../controllers/getSolvedProblems');
const {getAttemptedProblems, getAttemptedProblemsByUsername} = require('../controllers/getAttemptedProblem')
const { getProfile, updateProfile, getProfileByUserName, followProfile,unfollowProfile, getFollowers, getFollowing} = require('../controllers/profilePage');
// const Profile = require('../models/profile/userProfile');
const BlogController = require('../controllers/blog');
const ActivityController = require('../controllers/activityController');
router.get('/profile', auth, getProfile);
router.get('/profile/user/:username',noAuth, getProfileByUserName);
router.put('/profile',auth, updateProfile);
router.get('/profile/user-blogs',auth, BlogController.getBlogsByUserId); 
router.get('/profile/user-activities/:username', ActivityController.getUserActivitiesByUsername);

//for solved
router.get('/profile/solved-problems',auth, getSolvedProblems);
router.get('/profile/solved-problems/:username', getSolvedProblemsByUsername);


//for attempted 
router.get('/profile/recent-attempts/', auth, getAttemptedProblems);
router.get('/profile/recent-attempts/:username',getAttemptedProblemsByUsername)

//follow
router.post('/profile/follow/:username',auth,followProfile)
router.post('/profile/unfollow/:username',auth,unfollowProfile)
//get followers
router.get('/profile/followers',auth,getFollowers);
//get followings
router.get('/profile/followings',auth, getFollowing);
module.exports = router;
