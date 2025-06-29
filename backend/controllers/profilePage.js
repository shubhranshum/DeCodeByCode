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

module.exports = { getProfile };
