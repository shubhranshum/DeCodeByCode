const Contest = require('../../../models/contest/contest');

async function createContest(req, res) {
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        const newContest = new Contest({
            title: req.body.title,
            creator: req.user._id,
            createdAt: new Date()
        });
        console.log("New Contest Created:", newContest);
        // // if(req.user) newProblem.user = req.user;// Set the user ID from the authenticated user
        await newContest.save();
        res.status(201).json({ message: 'Contest created successfully', contest: newContest });
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = createContest;