const Activity = require('../models/profile/activityModel');
const User = require('../models/user');
 // If needed for population

// Log a new activity
exports.logActivity = async (
  userId,
  refId,
  refModel,
  type,
  details
) => {
  console.log("Hello from logActivity")
  try {
    const activity = new Activity({
      user: userId,
      refId:refId,
      type:type,
      refModel:refModel,
      details:details,
    });


    await activity.save();
    

    console.log('Activity logged');
    
  } catch (err) {
    console.error('Error logging activity:', err);
   
  }
};


exports.getUserActivities = async (req, res) => {
  console.log("Hello from getUserActivity")
  try {
   const userId = req.user._id;
   ;
    const query = { user: userId };

    
  
    const activities = await Activity.find(query).populate('refId', 'username');
    console.log(activities);

    res.status(200).json({ success: true, activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch activities' });
  }
};
exports.getUserActivitiesByUsername = async (req, res) => {
  console.log("Hello from getUserActivitiesByUsername")
  try {
   const username = req.params.username;
   const user = await User.findOne({ username });
   if(user == null){
    return res.status(404).json({ success: false, message: 'User not found' });
   }
   const userId = user._id;
   
    const query = { user: userId };
    

    const activities = await Activity.find(query).populate('refId', 'username');
    console.log(activities);

    res.status(200).json({ success: true, activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch activities' });
  }
};


    



// Delete all activities of a user (e.g., on account deletion)
exports.deleteUserActivities = async (req, res) => {
  try {
    const userId = req.params.userId;

    await Activity.deleteMany({ user: userId });

    res.status(200).json({ success: true, message: 'User activities deleted' });
  } catch (err) {
    console.error('Error deleting activities:', err);
    res.status(500).json({ success: false, message: 'Failed to delete activities' });
  }
};

