const Profile = require('../models/profile/userProfile');


const getAttemptedProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Hello from getAttemptedProblems");
    const profile = await Profile.findOne({ userId })
      .populate({
        path: 'ProblemHistory.problemId',
        select: 'title difficulty'
      });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Filter only attempted problems (not solved)
    const attemptedProblems = profile.ProblemHistory
      .filter(entry => entry.status === 'Attempted' && entry.problemId)
      .map(entry => ({

        _id: entry.problemId._id,
        status:entry.status,
        title: entry.problemId.title,
        difficulty: entry.problemId.difficulty,
        lastTriedAt: entry.lastTriedAt
      }));

    res.status(200).json({ success: true, attemptedProblems });
  } catch (error) {
    console.error('Error fetching attempted problems:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
const getAttemptedProblemsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Step 1: Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Step 2: Find the profile using the user's ID
    const profile = await Profile.findOne({ userId: user._id })
      .populate({
        path: 'ProblemHistory.problemId',
        select: 'title difficulty'
      });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Step 3: Filter attempted (not solved) problems
    const attemptedProblems = profile.ProblemHistory
      .filter(entry => entry.status === 'Attempted' && entry.problemId)
      .map(entry => ({
        _id: entry.problemId._id,
        title: entry.problemId.title,
        difficulty: entry.problemId.difficulty,
        lastTriedAt: entry.lastTriedAt
      }));

    res.status(200).json({ success: true, attemptedProblems });
  } catch (error) {
    console.error('Error fetching attempted problems by username:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


module.exports = {getAttemptedProblems,getAttemptedProblemsByUsername};
