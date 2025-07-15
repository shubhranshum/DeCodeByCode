const ProblemStats = require('../../models/profile/problemStatsSchema');
const Submission = require('../../models/submissionSchema');

const getProblemSubmissionsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;

    const submissions = await ProblemStats.find({
      user: userId,
      problemid: problemId
    }).sort({ createdAt: -1 }); // Most recent first

    var ifSolved = "";
    if(submissions.length >0) ifSolved = "Attempted"
    const hasSolved = submissions.some(entry => entry.status === 'Accepted');
    
    if (hasSolved) {
      ifSolved = "Solved";
    }
    res.status(200).json({
      success: true,
      submissions,
      ifSolved
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching submissions'
    });
  }
};


const getSubmittedSolutions = async (req, res) => {
  try {
    const problemId = req.params.id;

    const submittedSolutions = await ProblemStats.find({
      problemid: problemId,
      status: 'Accepted'
    })
      .populate('user', 'username') // populate only the username field
      .sort({ createdAt: -1 }); // optional: sort by newest first
    console.log(submittedSolutions.username);
    res.status(200).json({
      success: true,
      solutions: submittedSolutions
    });
  } catch (error) {
    console.error('Error fetching submitted solutions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching submitted solutions'
    });
  }
};




module.exports = {getProblemSubmissionsByUser, getSubmittedSolutions};
