const Problem = require('../../models/problem');

async function getProblemBySlug(req, res) {
    console.log('Fetching problem by ID');
    const {problemSlug} = req.params;// Assuming the problem ID is passed as a URL parameter
    try {
        const problem = await Problem.findOne({slug:problemSlug}).populate('user', 'username'); // Populate user details
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        console.log('Problem fetched successfully:',problem.title);
        res.status(200).json(problem);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = getProblemBySlug;