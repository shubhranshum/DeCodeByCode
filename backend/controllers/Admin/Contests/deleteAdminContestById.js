const Contest = require('../../../models/contest/contest');

async function deleteAdminContestById(req, res) {
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        const id = req.params.contestId;
        const contest = await Contest.findByIdAndDelete(id);
        res.status(201).json({ message: 'Contest deleted successfully',contest: contest});
    } catch (err) {
        console.error('Error deleting problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = deleteAdminContestById;