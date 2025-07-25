const logOutUser = require('../controllers/Authentication/logout');
const router = require('express').Router();

router.get('/logout', logOutUser);

module.exports = router;