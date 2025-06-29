const adminProblem = require('../../models/adminProblem');

async function editProblem(req, res) {
    console.log("I am in editProblem controller");
    // console.log(req.body, req.user);
    if (req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    const updates = req.body;
    try {
        console.log("Updates received:", updates);
        console.log("Problem ID to update:", req.params.id);

        const problem = await adminProblem.findByIdAndUpdate(req.params.id, { $set: updates },{new: true});
        console.log("Problem updated successfully", problem);
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