const Announcement = require('../../../models/home/announcement/announcemnt');
const verifyAnnouncement = async (req, res) => {
    try {
        console.log("Hello from verifyAnnouncement");
        
       
        
        res.status(200).json({ message: 'Announcement updated successfully', announcement });
    } catch (err) {
        console.error('Error updating announcement:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { verifyAnnouncement }