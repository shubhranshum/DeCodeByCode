const Problem = require('../../../models/problem');

async function createProblem(req, res) {
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        const newProblem = new Problem({
            title: req.body.title,
            user: req.user._id,
            createdAt: new Date()
        });
        // // if(req.user) newProblem.user = req.user;// Set the user ID from the authenticated user
        await newProblem.save();
        res.status(201).json({ message: 'Problem created successfully', problem: newProblem });
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = createProblem;