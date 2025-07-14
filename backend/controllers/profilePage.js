const UserProfile = require('../models/profile/userProfile');
const BlogPost = require('../models/blogPost');
const User = require('../models/user');
const getProfileByUserName = async (req, res) => {
  try {
    const username = req.params.username;
    console.log(username);
    console.log("Hello from getProfileByUsername");
    const profile = await User.findOne({ username: username })
    
    
    console.log("Hello from getProfileByUserName");
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
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
    const { profilePicture,  about, city, state, country, college, skills, firstName,lastName,age} = req.body;

    
  
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
    
    profile.skills= skills;


    
    console.log(profile.skills);

    await profile.save();
    const updatedProfile = await User.findOne({ _id: userId });
    res.status(200).json(updatedProfile);

    

    
   
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { getProfile , updateProfile , getProfileByUserName};
