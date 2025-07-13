const express = require('express');
const router = express.Router();
const getProblemById = require('../controllers/Problems/getProblemById');
const getGlobalProblems = require('../controllers/Problems/getGlobalProblems');
const{getProblemSubmissionsByUser,getSubmittedSolutions} = require('../controllers/Problem/getProblemSubmission');



const submitProblem = require('../controllers/Problems/submitProblemController');



router.get('/problems', getGlobalProblems);
router.get('/problems/:problemId', getProblemById);



//by om vrit
router.post('/problem/submit',submitProblem);





///for getting submissions of user // Route: GET /problem/submissions/:id
router.get('/problem/submissions/:id', getProblemSubmissionsByUser);
router.get('/problem/solutions/:id', getSubmittedSolutions);




module.exports = router;