const express = require('express');
const router = express.Router();
const getContestById = require('../controllers/Contest/getContestById');
const getGlobalContests = require('../controllers/Contest/getGlobalContests');
const register = require('../controllers/Contest/register');
const submitProblem = require('../controllers/Contest/submitProblem');
const submissionsByUser = require('../controllers/Contest/submissionsByUser');
const getContestUserSolvedProblems = require('../controllers/Contest/getContestSolvedProblems.js');
const getContestUserAttemptedProblems = require('../controllers/Contest/getContestUserAttemptedProblems.js');
// //by om vrit
// const submitProblem = require('../controllers/submitProblemController');



router.get('/contests', getGlobalContests);
router.get('/contests/:contestId', getContestById);
router.get('/contests/user-solved/:contestId',getContestUserSolvedProblems)
router.get('/contests/user-submissions/:contestId', getContestUserAttemptedProblems); // Assuming this is to fetch attempted problems by user
router.post('/contests/:contestId/register', register); // Assuming this is to fetch problems of a contest
router.post('/contests/:contestId/problems/:problemId/submit', submitProblem);
router.get('/contests/:contestId/submissions/:problemId', submissionsByUser); // Assuming this is to fetch submissions for a specific problem in a contest




//by om vrit
// router.post('/contest/submit',submitProblem);


module.exports = router;