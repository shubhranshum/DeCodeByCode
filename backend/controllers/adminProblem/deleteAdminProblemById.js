const Problem = require('../../models/problem');

async function deleteAdminProblemById(req, res) {
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        const id = req.params.id;
        await Problem.findByIdAndDelete(id);
        res.status(201).json({ message: 'Problem deleted successfully', problem: newProblem });
    } catch (err) {
        console.error('Error deleting problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = deleteAdminProblemById;