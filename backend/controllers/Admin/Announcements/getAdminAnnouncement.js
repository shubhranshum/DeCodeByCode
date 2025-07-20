const Announcement = require('../../../models/home/announcement/announcemnt');
const getAdminAnnouncements = async (req, res) => {
    try {
        console.log("Hello from GetAnnouncements");
        const userId = req.user._id;
        
        const announcements = await Announcement.find().populate('createdBy','username');
        if(!announcements){
            res.status(200).json(announcements);
        }
       
        const finalAnnouncements = announcements.filter((announcement) => announcement.createdBy && announcement.createdBy._id.toString() === userId.toString());
        

        res.status(200).json(finalAnnouncements);
    } catch (err) {
        console.error('Error fetching announcements:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAdminAnnouncements }; // Export the getAnnouncements