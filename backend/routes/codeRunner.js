const express = require('express');
const router = express.Router();
const {submitCode, getResult} = require('../controllers/codeOutput.js');


router.post('/submit',submitCode);
router.get('/result/:token', getResult);

module.exports = router;