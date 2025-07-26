const express = require('express');
const router = express.Router();
const userSignUp = require('../controllers/Authentication/signup');
const userLogin = require('../controllers/Authentication/login');
const authContr = require('../controllers/authController');
const {verify} = require('../controllers/Authentication/verifyEmail');
const {sendResetPasswordEmail,handlePasswordChange} = require('../controllers/Authentication/resetPassword')
router.post('/signup',userSignUp)
router.post('/login',userLogin)
router.get('/check/auth',authContr.checkAuth)
router.get('/auth/verify-email/:token',verify)
router.post("/auth/forgot-password/:emailId",sendResetPasswordEmail)
router.post("/auth/reset-password",handlePasswordChange)
module.exports = router;