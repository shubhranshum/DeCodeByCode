const express = require('express');
const router = express.Router();
const getProblemById = require('../controllers/Problems/getProblemById');
const getGlobalProblems = require('../controllers/Problems/getGlobalProblems');
// const fetchAdminProblems = require('../controllers/fetchAdminProblems');


// //by om vrit
const submitProblem = require('../controllers/Problems/submitProblemController');



router.get('/problems', getGlobalProblems);
router.get('/problems/:problemId', getProblemById);



//by om vrit
router.post('/problem/submit',submitProblem);


module.exports = router;