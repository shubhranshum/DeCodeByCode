const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Community = require('../../models/community/community');
const Notification = require('../models/notification/notification');

const UserProfile = require('../../models/profile/userProfile');
const JWT_SECRET = "shubh@123#1234#12345#";


async function userSignUp(req, res) {
    console.log("I am in userSignUp controller");
    const { username, email, password, college } = req.body;

    console.log("Received data1:", { username, email, password, });
    try {
        const userExists = await User.findOne({ email });
        const nuserExists = await UserProfile.findOne({ username });
        if (userExists || nuserExists) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            college: college,
            isAdmin: false // Default to false, can be changed later
        })
        const community = await Community.findOne();
        console.log(community);
        community.numberOfUsers += 1;
        await community.save();
        //giving notification if user is new 
        const notification = new Notification({
            recipient: newUser._id,
            type: "SYSTEM",
            message: "Welcome to DecodeByCode Community",
            link: "/profile"
        });
        await notification.save();



        await newUser.save();


        // console.log("Received data5:", { username, email, password });

        res.status(201).json({ message: 'User created successfully', user: newUser });
        console.log("Received data6:", { username, email, password });
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = userSignUp;