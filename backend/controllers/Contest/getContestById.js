const Contest = require('../../models/contest/contest');

async function getContestById(req, res) {

    const {contestId} = req.params;// Assuming the problem ID is passed as a URL parameter
    try {
        const contest = await Contest.findById(contestId)
            .populate('creator', 'username')
            .populate('Problems','title _id difficulty points');  // only include title and _id
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        console.log('Contest fetched successfully:', contest);
        res.status(200).json(contest);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getContestById;