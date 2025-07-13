const Submission = require('../../models/submissionSchema');

async function getContestUserAttemptedProblems(req, res) {
    try {
        const contestId = req.params.contestId;
        const problems = await Submission.find({contestId , userId: req.user._id});
        console.log('Submitted problems for contest:', contestId, problems);
        res.status(200).json(problems);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getContestUserAttemptedProblems;