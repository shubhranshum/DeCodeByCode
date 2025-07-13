const Announcement = require('../../../models/home/announcement/announcemnt');
export const updateAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const { title, message, type, isPinned, isVisible, visibleFrom, visibleTill } = req.body;
        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        announcement.title = title;
        announcement.message = message;
        announcement.type = type;
        announcement.isPinned = isPinned;
        announcement.isVisible = isVisible;
        announcement.visibleFrom = visibleFrom;
        announcement.visibleTill = visibleTill;
        await announcement.save();
        res.status(200).json({ message: 'Announcement updated successfully', announcement });
    } catch (err) {
        console.error('Error updating announcement:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// module.exports = updateAnnouncement