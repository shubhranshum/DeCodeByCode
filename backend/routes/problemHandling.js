const express = require('express');
const router = express.Router();
const getProblemById = require('../controllers/getProblemById');
const getGlobalProblems = require('../controllers/getGlobalProblems');
const {getProblemSubmissionsByUser, getSubmittedSolutions} = require('../controllers/Problem/getProblemSubmission');
// const fetchAdminProblems = require('../controllers/fetchAdminProblems');


// //by om vrit
const submitProblem = require('../controllers/submitProblemController');



router.get('/problems', getGlobalProblems);
router.get('/problem/:id', getProblemById);



//by om vrit
router.post('/problem/submit',submitProblem);





///for getting submissions of user // Route: GET /problem/submissions/:id
router.get('/problem/submissions/:id', getProblemSubmissionsByUser);
router.get('/problem/solutions/:id', getSubmittedSolutions);




module.exports = router;