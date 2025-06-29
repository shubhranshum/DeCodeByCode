const express = require('express');
const router = express.Router();
const fetchProblem = require('../controllers/fetchProblem');
const fetchAllProblems = require('../controllers/fetchAllProblems');
// const fetchAdminProblems = require('../controllers/fetchAdminProblems');



router.get('/problems', fetchAllProblems);
router.get('/problem/:id', fetchProblem);

module.exports = router;