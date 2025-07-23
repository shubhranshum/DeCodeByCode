const Profile = require('../models/profile/userProfile');
const Problem = require('../models/problem');
const User = require('../models/user');

const getSolvedProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Hello from getSolvedProblems")
    const profile = await Profile.findOne({ userId })
      .populate({
        path: 'ProblemHistory.problemId',
        select: 'title difficulty',

        // only get title from Problem model
      });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Filter only solved problems
    const solvedProblems = profile.ProblemHistory
      .filter(entry => entry.status === 'Solved' && entry.problemId)
      .map(entry => ({
        _id: entry.problemId._id,
        title: entry.problemId.title,
        difficulty: entry.problemId.difficulty,
        solvedAt: entry.solvedAt,
        lastTriedAt: entry.lastTriedAt
      }));

    res.status(200).json({ success: true, solvedProblems });
  } catch (error) {
    console.error('Error fetching solved problems:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
const getSolvedProblemsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    console.log("Hello from getSolvedProblemByUsername ",username)

    // Find user by username
    const user = await User.findOne({ username });
   
    if (user == null) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find profile by userId
    const profile = await user.populate({
      path: 'ProblemHistory.problemId',
      select: 'title difficulty',
    });
    console.log(profile)
    

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Filter only solved problems
    const solvedProblems = profile.ProblemHistory
      .filter(entry => entry.status === 'Solved' && entry.problemId)
      .map(entry => ({
        _id: entry.problemId._id,
        title: entry.problemId.title,
        difficulty: entry.problemId.difficulty,
        solvedAt: entry.solvedAt,
        lastTriedAt: entry.lastTriedAt
      }));
      console.log(solvedProblems.length)

    res.status(200).json({ success: true, solvedProblems });
  } catch (error) {
    console.error('Error fetching solved problems by username:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};





module.exports ={ getSolvedProblems, getSolvedProblemsByUsername};
