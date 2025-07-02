
const express = require('express');
const router = express.Router();
const editProblem = require('../controllers/adminProblem/editProblem.js');
const testCase = require('../controllers/adminProblem/testCase.js');
const verify = require('../controllers/adminProblem/verify.js');
const createProblem = require('../controllers/adminProblem/createProblem.js');
const getAdminProblems  = require('../controllers/adminProblem/getAdminProblems.js');
const deleteAdminProblemById = require('../controllers/adminProblem/deleteAdminProblemById');
const getProblemById = require('../controllers/getProblemById.js');
const deleteTestCaseById = require('../controllers/adminProblem/deleteTestCaseById.js');
const postToGlobalProblems = require('../controllers/adminProblem/postToGlobalProblems.js');
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
// });

router.post("/edit-problem/:id/testcase",  testCase);
router.delete("/edit-problem/:id/testcase/:testCaseId",  deleteTestCaseById);
router.post('/createProblem', createProblem);
router.post('/edit-problem/:id', editProblem);
router.post('/edit-problem/:id/verify',verify);
router.get('/problems',getAdminProblems)
router.delete('/deleteProblem/:id',deleteAdminProblemById);
router.get('/problem/:id', getProblemById); // Assuming this is to fetch a specific problem by ID
router.post('/postToGlobalProblems/:id', postToGlobalProblems);

// Export the router to use in the main app
module.exports = router;