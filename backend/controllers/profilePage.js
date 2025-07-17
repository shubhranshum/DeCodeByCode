const UserProfile = require('../models/profile/userProfile');
const BlogPost = require('../models/blogPost');
const User = require('../models/user');
const { logActivity } = require('./activityController');
const Connection = require('../models/connection/connection');
const Notification =  require('../models/notification/notification')

const getProfileByUserName = async (req, res) => {
  try {
    const username = req.params.username;
    console.log(username);

    console.log("Hello from getProfileByUsername");
    console.log(req.user._id);

    const profile = await User.findOne({ username: username })
    const connection = await Connection.findOne({ $and: [{ sender: req.user._id }, { reciever: profile._id }] });
    let ifFollowing = false
    if (connection) {
      ifFollowing = true
    }
    console.log("IF following", ifFollowing);
    console.log("Hello from getProfileByUserName");
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile: profile, isFollowing: ifFollowing });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getProfile = async (req, res) => {
  try {
    console.log("Hello from getProfile");
    const user = req.user.username;


    const profile = await User.findOne({ username: user })


    // You can also populate DraftBlogs, ArchivedBlogs, LikedBlogs as needed
    console.log(profile)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Hello from updateProfile");
    const { profilePicture, about, city, state, country, college, skills, firstName, lastName, age } = req.body;



    const profile = await User.findOne({ _id: userId });
    console.log(profile);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.profilePicture = profilePicture;

    profile.about = about;
    profile.age = age;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.city = city;
    profile.state = state;
    profile.country = country;
    profile.college = college;
    console.log(skills.length);

    profile.skills = skills;



    console.log(profile.skills);
    logActivity(userId, profile._id, 'User', 'PROFILE_UPDATED', "You Updated your Profile");

    await profile.save();
    const updatedProfile = await User.findOne({ _id: userId });
    res.status(200).json(updatedProfile);





  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const followProfile = async (req, res) => {
  try {
    console.log("Hello from followProfile");
    const { username } = req.params; //whome you are following 
    const userId = req.user._id;//who you are 
    const recipient = await User.findOne({ username });
    if (!recipient) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    


    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    

    const existingConnection = await Connection.findOne({ $and: [{ sender: userId }, { reciever: recipient._id }] });
    if (existingConnection) {
      return res.status(400).json({ message: 'You are already following this profile' });
    }

    const connection = new Connection({
      sender: userId,
      reciever: recipient._id,
    });

    await connection.save();
    await logActivity(userId, recipient._id, 'Connection', 'FOLLOWED', "You Followed " + recipient.username);
    //will create notification
    const notification = new Notification({
      sender: userId,
      recipient: recipient._id,
      type: 'FOLLOW',
      isRead: false,
      message: user.username + " Followed you",
      link: '/profile/u' + user.username
    });

    await notification.save();
    
    res.status(200).json({ message: 'Profile followed successfully' });


  }
  catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const unfollowProfile = async (req, res) => {
  try {
    console.log("Hello from unfollowProfile");
    const { username } = req.params; //whome you are following 

    const userId = req.user._id;//who you are 
    const recipient = await User.findOne({ username });
    console.log("unfollowing", recipient.username);
    if (!recipient) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const user = await User.findOne({ _id: userId });
    console.log(user.username);
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const connection = await Connection.findOne({ $and: [{ sender: userId }, { reciever: recipient._id }] });
    console.log(connection);
    if (!connection) {
      return res.status(400).json({ message: 'You are not following this profile' });
    }

    await Connection.deleteOne({ $and: [{ sender: userId }, { reciever: recipient._id }] });
    await logActivity(userId, recipient._id, 'Connection', 'UNFOLLOWED', "You Unfollowed " + recipient.username);
    res.status(200).json({ message: 'Profile unfollowed successfully' });
  }
  catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getFollowers = async (req, res) => {
  try {
    console.log("Hello from getFollowers");
    const user = req.user._id;
    const followers = await Connection.find({ reciever: user }).populate('sender', '_id username email profilePicture firstName lastName age ');
    res.json(followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getFollowing = async (req, res) => {
  try {
    console.log("Hello from getFollowing");
    const user = req.user._id;
    const following = await Connection.find({ sender: user }).populate('reciever', '_id username email profilePicture firstName lastName age ');
    
    res.json(following);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getProfile, updateProfile, getProfileByUserName, followProfile, unfollowProfile, getFollowers, getFollowing };
