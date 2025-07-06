const Problem = require('../../../models/problem');

async function getAdminProblems(req, res) {
    const userId = req.user._id; // We need to return the all problems referred to user with userid - id
    // console.log('Fetching all problems');
    try {
        const problems = await Problem.find({}).populate('user', 'username'); // Populate user details
        const userProblems = problems.filter(problem => problem.user && problem.user._id.toString() === userId.toString());
        res.status(200).json(userProblems);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getAdminProblems;