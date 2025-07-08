const Announcement = require('../../../models/home/announcement/announcemnt');
const postToGlobalAnnouncements = async (req, res) => {
    try {
        console.log("Hello from postToGlobalAnnouncements");
        const { announcementId } = req.params;
        const announcement = await Announcement.findById(announcementId);
        console.log(announcement);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        announcement.isGlobal = !announcement.isGlobal;
        console.log(announcement);
        await announcement.save();
        res.status(200).json({ message: 'Announcement updated successfully', announcement });
    } catch (err) {
        console.error('Error updating announcement:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = postToGlobalAnnouncements