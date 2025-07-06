const Contest = require('../../../models/contest/contest');

async function getAdminContests(req, res) {
    const userId = req.user._id; // We need to return the all problems referred to user with userid - id
    try {
        const contests = await Contest.find({}).populate('creator', 'username'); // Populate user details
        if(!contests){
            res.status(200).json(contests);
        }
        const adminContests = contests.filter(contest => contest.creator && contest.creator._id.toString() === userId.toString());
        res.status(200).json(adminContests);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getAdminContests;