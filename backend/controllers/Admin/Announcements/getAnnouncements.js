const Announcement = require('../../../models/home/announcement/announcemnt');
const getAnnouncements = async (req, res) => {
    try {
        console.log("Hello from GetAnnouncements");
        
       
        const announcements = await Announcement.find().populate('createdBy','username');
        if(!announcements){
            res.status(200).json(announcements);
        }
       
        const finalAnnouncements = announcements.filter((announcement) => announcement.visibleFrom <= Date.now() && announcement.visibleTill >= Date.now());
        
        res.status(200).json(finalAnnouncements);
    } catch (err) {
        console.error('Error fetching announcements:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getAnnouncements }; // Export the getAnnouncements