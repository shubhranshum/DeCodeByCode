const adminProblem = require('../../models/adminProblem');

async function getAdminProblems(req, res) {
    // console.log('Fetching all problems');
    try {
        const problems = await adminProblem.find({}).populate('user', 'username'); // Populate user details
        // console.log('Problems fetched:', problems);
        if (!problems) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json(problems);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getAdminProblems;