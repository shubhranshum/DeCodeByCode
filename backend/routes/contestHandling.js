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
const Standings = require('../models/contest/standings');



router.get('/contests', getGlobalContests);
router.get('/contests/:contestId', getContestById);
router.get('/contests/user-solved/:contestId',getContestUserSolvedProblems)
router.get('/contests/user-submissions/:contestId', getContestUserAttemptedProblems); // Assuming this is to fetch attempted problems by user
router.post('/contests/:contestId/register', register); // Assuming this is to fetch problems of a contest
router.post('/contests/:contestId/problems/:problemId/submit', submitProblem);
router.get('/contests/:contestId/submissions/:problemId', submissionsByUser); // Assuming this is to fetch submissions for a specific problem in a contest
router.get('/contests/:contestId/standings', async (req, res) => {
    const standings = await Standings.find({ contestId: req.params.contestId })
      .populate("userId", "username")
      .populate("problemResults", "problemId")
      .sort({ totalSolved: -1, totalPenalty: 1 });
    standings.forEach((user,idx) => {
      user.rank = idx + 1; // Assign rank based on position in sorted standings
    });
    res.json(standings);
  });
  




module.exports = router;