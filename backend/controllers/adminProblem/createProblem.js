const adminProblem = require('../../models/adminProblem');

async function createProblem(req, res) {
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        const count = await adminProblem.countDocuments();
        const newProblem = new adminProblem({
            // _id : count + 1, // Automatically set content based on the count
            title: req.body.title,
            createdAt: new Date()
        });
        console.log("New Problem Created:", newProblem);
        // // if(req.user) newProblem.user = req.user;// Set the user ID from the authenticated user
        await newProblem.save();
        res.status(201).json({ message: 'Problem created successfully', problem: newProblem });
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = createProblem;