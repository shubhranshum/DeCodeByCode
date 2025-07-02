const express = require('express');
const router = express.Router();
const getProblemById = require('../controllers/getProblemById');
const getGlobalProblems = require('../controllers/getGlobalProblems');
// const fetchAdminProblems = require('../controllers/fetchAdminProblems');



router.get('/problems', getGlobalProblems);
router.get('/problem/:id', getProblemById);

module.exports = router;