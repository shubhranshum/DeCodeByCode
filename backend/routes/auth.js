const express = require('express');
const router = express.Router();
const userSignUp = require('../controllers/Authentication/signup');
const userLogin = require('../controllers/Authentication/login');

router.post('/signup',userSignUp)
router.post('/login',userLogin)

module.exports = router;