const Announcement = require('../../../models/home/announcement/announcemnt');
const getAnnouncementById = async (req, res) => {
    try {
        console.log("Hello from getAnnouncementById");
        const { announcementId } = req.params;
        const announcement = await Announcement.findById(announcementId).populate('createdBy','username');
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json(announcement);
    } catch (err) {
        console.error('Error fetching announcement:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getAnnouncementById