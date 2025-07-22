const bcrypt = require('bcryptjs');
const User = require('../models/user');

const UserProfile = require('../models/profile/userProfile');
const JWT_SECRET="shubh@123#1234#12345#";
const Community = require('../models/community/community');


async function userSignUp(req,res){
    console.log("I am in userSignUp controller");
    const {username, email, password,college} = req.body;

    
    try{
        const userExists = await User.findOne({email});
        const nuserExists = await UserProfile.findOne({username});
    if(userExists || nuserExists){
        return res.status(400).json({message: 'User already exists with this email or username'});
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    var newUser = new User({
        username,
        email,
        password: hashedPassword,
        college: college,
        isAdmin: false // Default to false, can be changed later
    })
    newUser = await newUser.save();
    console.log(newUser._id)

    const newProfile = new UserProfile({
        userId: newUser._id,
        username,
        email,
        college: college
    });
    
    const community = await Community.findOne();
    console.log(community);
    community.numberOfBlogs += 1;
    await community.save();
    
    
    await newProfile.save();
    

    res.status(201).json({message : 'User created successfully', user: newUser});
    console.log("Received data6:", { username, email, password });
    }
    catch(err){
        console.error('Error creating user:', err);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = userSignUp;