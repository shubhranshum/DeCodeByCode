const SolvedProblem = require('../../models/solvedProblemSchema');

async function getContestUserSolvedProblems(req, res) {
    try {
        const contestId = req.params.contestId;
        const problems = await SolvedProblem.find({contestId , userId: req.user._id});
        console.log('Solved problems for contest:', contestId, problems);
        res.status(200).json(problems);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getContestUserSolvedProblems;