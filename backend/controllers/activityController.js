const Activity = require('../models/profile/activityModel');
 // If needed for population

// Log a new activity
exports.logActivity = async (
  userId,
  refId,
  refModel,
  type,
  details
) => {
  try {
    
    const activity = new Activity({
      user: userId,
      refId:refId,
      type:type,
      refModel:refModel,
      details:details,
    });
    
    

    const saved = await activity.save();

    console.log('Activity saved');
    
  } catch (err) {
    console.error('Error logging activity:', err);
   
  }
};

// Get all activities of a user (optional filters)
exports.getUserActivities = async (req, res) => {
  try {
   const userId = req.user._id;
   ;
    const query = { user: userId };

    
  
    const activities = await Activity.find(query);
    console.log('Activities fetched');

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

