const Problem = require('../../models/problem');

async function getProblemById(req, res) {
    console.log('Fetching problem by ID');
    const {problemId} = req.params;// Assuming the problem ID is passed as a URL parameter
    console.log('Problem ID:', problemId);
    try {
        const problem = await Problem.findById(problemId).populate('user', 'username'); // Populate user details
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json(problem);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getProblemById;