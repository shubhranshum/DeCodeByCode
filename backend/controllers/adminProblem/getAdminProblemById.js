const adminProblem = require('../../models/adminProblem');

async function getAdminProblemById(req, res) {
    // console.log('Fetching all problems');
    const id = req.params.id; // Assuming you want to fetch by ID, but this function fetches all problems
    try {
        console.log(id);
        const problem = await adminProblem.findById(id).populate('user', 'username'); // Populate user details
        // console.log('Problems fetched:', problems);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json(problem);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getAdminProblemById;