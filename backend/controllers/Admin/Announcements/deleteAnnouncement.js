const Announcement = require('../../../models/home/announcement/announcemnt');

const deleteAnnouncement = async (req, res) => {
    try {
        console.log("Hello from deleteAnnouncement");
        const { announcementId } = req.params;
        
        const announcement = await Announcement.findOneAndDelete({ _id: announcementId });
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        console.error('Error deleting announcement:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = deleteAnnouncement;