const Problem = require('../models/problem');

async function deleteProblemById(req, res) {
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        await Problem.findByIdAndDelete(req.params.id); // Delete the problem by ID
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = deleteProblemById;