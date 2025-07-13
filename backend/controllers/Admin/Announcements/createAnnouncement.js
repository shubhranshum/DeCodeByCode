const Announcement = require('../../../models/home/announcement/announcemnt');


const createAnnouncement = async (req, res) => {
    console.log("Hello from createAnnouncement");

    try {
        const userId = req.user._id;
        const { title } = req.body;

        const newAnnouncement = new Announcement({
            
            });
        
        newAnnouncement.title = title;
        newAnnouncement.createdBy = userId;
        console.log(newAnnouncement);
        await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement created successfully', announcement: newAnnouncement });
    } catch (err) {
        console.error('Error creating announcement:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = createAnnouncement;