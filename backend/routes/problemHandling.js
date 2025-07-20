const express = require('express');
const router = express.Router();
const getProblemById = require('../controllers/Problems/getProblemById');
const getProblemBySlug = require('../controllers/Problems/getProblemBySlug.js');
const getGlobalProblems = require('../controllers/Problems/getGlobalProblems');

const {getProblemSubmissionsByUser, getProblemSolvedSubmissions} = require('../controllers/Problems/getProblemSubmissionByUser');


const submitProblemByShubhranshu = require('../controllers/Problems/submitProblem');
const submitProblemByOmVrit = require('../controllers/Problems/submitProblemController');


router.get('/problems', getGlobalProblems);
router.get('/problems/:problemId', getProblemById);
router.get('/problems/slug/:problemSlug', getProblemBySlug); // Assuming this is to fetch a problem by its slug



//by om vrit and shubhranshu
router.post('/problems/:problemId/submit',[submitProblemByShubhranshu,submitProblemByOmVrit]);




///for getting submissions of user // Route: GET /problem/submissions/:id
router.get('/problems/:problemId/submissions', getProblemSubmissionsByUser);
router.get('/problems/:problemId/solutions', getProblemSolvedSubmissions);




module.exports = router;