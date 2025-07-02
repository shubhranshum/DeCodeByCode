const Problem = require('../models/problem');

async function getProblemById(req, res) {
    const {id} = req.params;// Assuming the problem ID is passed as a URL parameter
    console.log('Fetching problem with ID:', id);
    try {
        const problem = await Problem.findById(id).populate('user', 'username'); // Populate user details
        console.log('Problem fetched:', problem);
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