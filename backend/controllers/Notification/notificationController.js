const Notification = require('../../models/notification/notification');
const User = require('../../models/user');
const mongoose = require('mongoose');

const getNotification = async (req, res) => {
    try {
        console.log("Hello from getNotification");
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};
const readNotification = async (req, res) => {
    try {
        console.log("Hello from readNotification");
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (notification.isRead === true) {
            return res.json({ message: 'Notification already read' });
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};
const createNotification = async (req, res) => {
    try {
        console.log("Hello from create Notification ")
        const {
            recipient,
            type,
            message,
            link
        } = req.body;
        console.log(req.body);
        const sender = req.user._id;
        if (!message || !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        };
        if(type == "SYSTEM"){

            
            const users = await User.find({  });
            console.log(users.length);
            for (let user of users) {
                const notification = new Notification({
                    recipient: user._id,
                    type,
                    message,
                    link
                });
                await notification.save();
            }
            return res.status(200).json({ message: 'Notification created successfully' });
        }


        const notification = new Notification({
            recipient,
            sender,
            type,
            message,
            link
        });
        await notification.save();
        return res.status(200).json({ message: 'Notification created successfully' });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating notification' });
    }
};


module.exports = { getNotification, readNotification, createNotification };
