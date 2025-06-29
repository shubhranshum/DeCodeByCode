const express = require('express');
const router = express.Router();
const createProblem = require('../controllers/createProblem');
const fetchProblem = require('../controllers/fetchProblem');
const fetchAllProblems = require('../controllers/fetchAllProblems');
// const fetchAdminProblems = require('../controllers/fetchAdminProblems');


router.post('/admin/createProblem', createProblem);
router.get('/fetchAllProblems', fetchAllProblems);
router.get('/fetchProblem/:id', fetchProblem);
// router.get('/admin/problems',fetchAdminProblems);

module.exports = router;