const UserProfile = require('../models/profile/userProfile');
const BlogPost = require('../models/blogPost');

const getProfile = async (req, res) => {
  try {

    const user = req.user.username;
    console.log(user);

    const profile = await UserProfile.findOne({ username: user })
      .populate('Blog')
      .populate('DraftBlogs')
      .populate('ArchivedBlogs')
      .populate('LikedBlogs')
      .lean();  // You can also populate DraftBlogs, ArchivedBlogs, LikedBlogs as needed

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
    console.log(req.body);
    const { profilePicture, username, about, city, state, country, college, skills } = req.body;

    
  
    const profile = await UserProfile.findOne({ userId: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    console.log(profile);
    profile.profilePicture = profilePicture;
    profile.username = username;
    profile.About = about;
    profile.city = city;
    profile.state = state;
    profile.country = country;
    profile.college = college;
    for (const skill of skills) {
      if (!Array.isArray(profile.Skills)) {
  profile.Skills = [];
}
if (!profile.Skills.includes(skill)) {
  profile.Skills.push(skill);
}


    };

    await profile.save();

    const updatedProfile = await UserProfile.findOne({ userId: userId }).populate('Blog').populate('DraftBlogs').populate('ArchivedBlogs').populate('LikedBlogs').lean(); res.json(updatedProfile);

    res.status(200).json({ updatedProfile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getProfile , updateProfile };
