const Contest = require('../../../models/contest/contest');

async function editContest(req, res) {
    console.log('Editing contest with ID:', req.params.contestId);
    if (req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    const updates = req.body;
    try {
        updates.isVerified = false; // Ensure isVerified is set to false on update
        const contest = await Contest.findByIdAndUpdate(req.params.contestId, { $set: updates },{new: true});
        if (!contest) {
            console.log("Contest not found");
            return res.status(404).json({ message: 'Contest not found' });
        }
        res.status(200).json({ message: 'Contest updated successfully', contest });
    } catch (err) {
        console.error('Error updating problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = editContest;