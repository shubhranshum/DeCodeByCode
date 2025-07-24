const express = require('express');
const auth = require('../middlewares/auth');
const notificationController = require('../controllers/Notification/notificationController');
const router = express.Router();

router.get('/notifications',auth, notificationController.getNotification);
router.post('/notifications/read/:notificationId',auth, notificationController.readNotification);
router.post('/notifications/create/',auth, notificationController.createNotification);
module.exports = router;

