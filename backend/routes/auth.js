const express = require('express');
const router = express.Router();
const userSignUp = require('../controllers/signup');
const userLogin = require('../controllers/login');
const authContr = require('../controllers/authController');

router.post('/signup',userSignUp)
router.post('/login',userLogin)
router.get('/check/auth',authContr.checkAuth)

module.exports = router;