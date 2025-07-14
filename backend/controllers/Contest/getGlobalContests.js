const Contest = require('../../models/contest/contest');

async function getAllGlobalContests(req, res) {
    try {
        console.log("Hello from getAllGlobalContests");
        const contests = await Contest.find({}).populate('creator', 'username'); // Populate user details
        const filteredContests = contests.filter(contest => contest.isGlobal); 
        // Filter out private problems
        console.log("Contests fetched")
        res.status(200).json(filteredContests);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getAllGlobalContests;