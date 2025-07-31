const Problem = require('../../../models/problem');

async function editProblem(req, res) {
    console.log(req.body, req.user);
    if (req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    const updates = req.body;
    try {
        console.log("Editing problem with ID:", req.params.problemId);
        updates.isVerified = false; // Ensure isVerified is set to false on update
        const problem = await Problem.findByIdAndUpdate(req.params.problemId, { $set: updates },{new: true});
        if (!problem) {
            console.log("Problem not found");
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json({ message: 'Problem updated successfully', problem });
    } catch (err) {
        console.error('Error updating problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = editProblem;