const express = require('express');
const router = express.Router();
const getContestById = require('../controllers/Contest/getContestById');
const getGlobalContests = require('../controllers/Contest/getGlobalContests');
const register = require('../controllers/Contest/register');


// //by om vrit
// const submitProblem = require('../controllers/submitProblemController');



router.get('/contests', getGlobalContests);
router.get('/contests/:contestId', getContestById);
router.post('/contests/:contestId/register', register); // Assuming this is to fetch problems of a contest



//by om vrit
// router.post('/contest/submit',submitProblem);


module.exports = router;