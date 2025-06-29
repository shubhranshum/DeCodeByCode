const Problem = require('../models/problem');

async function fetchProblem(req, res) {
    console.log("Fetching problem details");
    const id = req.params.id; // Assuming the problem ID is passed as a URL parameter
    try {
        const problem = await Problem.findById(id).populate('user', 'username'); // Populate user details
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json(problem);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = fetchProblem;