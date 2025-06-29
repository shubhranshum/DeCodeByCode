const adminProblem = require('../../models/adminProblem');

async function deleteAdminProblemById(req, res) {
    console.log("dffdf");
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        const id = req.params.id;
        await adminProblem.findByIdAndDelete(id);
        console.log("Problem Deleted:", newProblem);
        // // if(req.user) newProblem.user = req.user;// Set the user ID from the authenticated user
        await newProblem.save();
        res.status(201).json({ message: 'Problem deleted successfully', problem: newProblem });
    } catch (err) {
        console.error('Error deleting problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = deleteAdminProblemById;