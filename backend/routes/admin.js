
const express = require('express');
const router = express.Router();
const editProblem = require('../controllers/editProblem.js');
const testCase = require('../controllers/testCase.js');
const verify = require('../controllers/verify.js');
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
// });

router.post("/edit-problem/:id/testcase",  testCase);

router.post('/edit-problem/:id', editProblem);
router.post('/edit-problem/:id/verify',verify);

// Export the router to use in the main app
module.exports = router;