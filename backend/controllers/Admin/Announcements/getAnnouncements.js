const Announcement = require('../../../models/home/announcement/announcemnt');
const getAnnouncements = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("Hello from getAnnouncements");
        const announcements = await Announcement.find().populate('createdBy','username');
        if(!announcements){
            res.status(200).json(announcements);
        }
       
        const finalAnnouncements = announcements.filter((announcement) => announcement.createdBy && announcement.createdBy._id.toString() === userId.toString());
        console.log("finalAnnouncements",finalAnnouncements);

        res.status(200).json(finalAnnouncements);
    } catch (err) {
        console.error('Error fetching announcements:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAnnouncements }; // Export the getAnnouncements