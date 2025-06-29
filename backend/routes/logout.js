const logOutUser = require('../controllers/logout');
const router = require('express').Router();

router.get('/logout', logOutUser);

module.exports = router;