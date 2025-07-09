
// Problems
const express = require('express');
const router = express.Router();
const editProblem = require('../controllers/Admin/Problems/editProblem.js');
const testCase = require('../controllers/Admin/Problems/testCase.js');
const verifyProblem = require('../controllers/Admin/Problems/verify.js');
const createProblem = require('../controllers/Admin/Problems/createProblem.js');
const getAdminProblems  = require('../controllers/Admin/Problems/getAdminProblems.js.js');
const deleteAdminProblemById = require('../controllers/Admin/Problems/deleteAdminProblemById.js');
const getProblemById = require('../controllers/Problems/getProblemById.js');
const deleteTestCaseById = require('../controllers/Admin/Problems/deleteTestCaseById.js');
const postToGlobalProblems = require('../controllers/Admin/Problems/postToGlobalProblems.js');



// Contest
const authMiddleware = require('../middlewares/auth.js');
const adminCheck = require('../middlewares/adminCheck.js');
const getAdminContests = require('../controllers/Admin/Contests/getAdminContests.js');
const createContest = require('../controllers/Admin/Contests/createContest.js');
const deleteAdminContestById = require('../controllers/Admin/Contests/deleteAdminContestById.js');
const getAdminContestById = require('../controllers/Contest/getContestById.js');
const editContest = require('../controllers/Admin/Contests/editContest.js');
const verifyContest = require('../controllers/Admin/Contests/verify.js');
const postToGlobalContests = require('../controllers/Admin/Contests/postToGlobalContests.js');



//announcement
const createAnnouncement = require('../controllers/Admin/Announcements/createAnnouncement.js');
const { getAnnouncements } = require('../controllers/Admin/Announcements/getAnnouncements.js'); 
const editAnnouncement = require('../controllers/Admin/Announcements/editAnnouncement.js');
const deleteAnnouncement = require('../controllers/Admin/Announcements/deleteAnnouncement.js');
const getAnnouncementById = require('../controllers/Admin/Announcements/getAnnouncementById.js');
const {verifyAnnouncement} = require('../controllers/Admin/Announcements/verify.js');
const postToGlobalAnnouncements = require('../controllers/Admin/Announcements/postToGlobalAnnouncements.js');

router.post("/edit-problem/:problemId/testcase",  testCase);
router.delete("/edit-problem/:problemId/testcase/:testCaseId",  deleteTestCaseById);
router.post('/createProblem', createProblem);
router.post('/edit-problem/:problemId', editProblem);
router.post('/edit-problem/:problemId/verify',verifyProblem);
router.get('/problems',getAdminProblems)
router.delete('/deleteProblem/:problemId',deleteAdminProblemById);
router.get('/problems/:problemId', getProblemById); // Assuming this is to fetch a specific problem by ID
router.post('/postToGlobalProblems/:problemId', postToGlobalProblems);


// Contests

router.get('/contests', getAdminContests);
router.get('/contests/:contestId', getAdminContestById);
router.post('/edit-contest/:contestId/verify', authMiddleware, adminCheck, verifyContest);
router.post('/createContest', authMiddleware, adminCheck,createContest);
router.post('/edit-contest/:contestId', authMiddleware, adminCheck, editContest);
router.post('/postToGlobalContests/:contestId', authMiddleware, adminCheck, postToGlobalContests);
router.delete('/deleteContest/:contestId',deleteAdminContestById);


//Announcement 

router.get('/announcements', getAnnouncements);
router.get('/announcements/:announcementId', getAnnouncementById);
router.post('/createAnnouncement', createAnnouncement);
router.post('/edit-announcement/:announcementId/verify', authMiddleware, adminCheck, verifyAnnouncement);
router.post('/edit-announcement/:announcementId', authMiddleware, adminCheck, editAnnouncement);
router.post('/postToGlobalAnnouncements/:announcementId', authMiddleware, adminCheck, postToGlobalAnnouncements);
router.delete('/deleteAnnouncement/:announcementId',deleteAnnouncement);

// Export the router to use in the main app
module.exports = router;