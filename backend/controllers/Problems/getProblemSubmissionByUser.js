const Submission = require('../../models/submissionSchema');
const SolvedProblem = require('../../models/solvedProblemSchema')

async function getProblemSubmissionsByUser(req, res) {
    const {problemId} = req.params
    const userId = req.user._id
    try {
        // Fetching submissions for the specific user, contest, and problem
        const submissions = await Submission.find({problemId,userId}).sort({ submissionTime: -1 }); // Sorting by submission time in descending order

        res.status(200).json(submissions); // Sending the submissions as a JSON response
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ message: 'Internal server error' }); // Handling errors
    }
}


async function getProblemSolvedSubmissions(req, res) {
    const {problemId} = req.params
    try {
        // Fetching submissions for the specific user, contest, and problem
        const submissions = await SolvedProblem.find({problemId}).sort({ solvedAt: -1 }); // Sorting by submission time in descending order

        res.status(200).json(submissions); // Sending the submissions as a JSON response
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ message: 'Internal server error' }); // Handling errors
    }
}



module.exports = {getProblemSubmissionsByUser,getProblemSolvedSubmissions};