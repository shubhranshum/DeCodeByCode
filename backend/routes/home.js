const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const {getAnnouncements} = require('../controllers/Admin/Announcements/getAnnouncements');
router.get('/home', (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Send user data excluding sensitive information
        const { _id, username, email, college, isAdmin } = req.user;
        // console.log("User data:", { _id, username, email, college });
        res.status(200).json({ _id, username, email, college, isAdmin});
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
router.get('/announcements',auth, getAnnouncements);

module.exports = router;