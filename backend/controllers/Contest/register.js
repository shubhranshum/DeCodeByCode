const Contest = require('../../models/contest/contest');

async function register(req, res) {
    const { contestId } = req.params; // Assuming the contest ID is passed as a URL parameter
    try {
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Check if the user is already registered
        if (contest.Participants.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already registered for this contest' });
        }

        // Add the user to the registered users list
        contest.Participants.push(req.user._id);
        await contest.save();

        res.status(200).json({ message: 'Successfully registered for the contest', contest });
    } catch (err) {
        console.error('Error registering for contest:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = register;