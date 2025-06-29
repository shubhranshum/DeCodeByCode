
const express = require('express');
const router = express.Router();
const editProblem = require('../controllers/adminProblem/editProblem.js');
const testCase = require('../controllers/adminProblem/testCase.js');
const verify = require('../controllers/adminProblem/verify.js');
const createProblem = require('../controllers/adminProblem/createProblem.js');
const getAdminProblems  = require('../controllers/adminProblem/getAdminProblems.js');
const getAdminProblemById = require('../controllers/adminProblem/getAdminProblemById.js');
const deleteAdminProblemById = require('../controllers/adminProblem/deleteAdminProblemById');
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
// });

router.post("/edit-problem/:id/testcase",  testCase);
router.post('/createProblem', createProblem);
router.post('/edit-problem/:id', editProblem);
router.post('/edit-problem/:id/verify',verify);
router.get('/problems',getAdminProblems)
router.get('/problem/:id',getAdminProblemById);
router.delete('/deleteProblem/:id',deleteAdminProblemById);

// Export the router to use in the main app
module.exports = router;