const Submission = require('../../models/submissionSchema');

async function submissionsByUser(req, res) {
    const submissionObject = req.params
    submissionObject.userId = req.user._id; // Assuming the user ID is available in req.user._id
    try {
        // Fetching submissions for the specific user, contest, and problem
        const submissions = await Submission.find(submissionObject).sort({ submissionTime: -1 }); // Sorting by submission time in descending order

        res.status(200).json(submissions); // Sending the submissions as a JSON response
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ message: 'Internal server error' }); // Handling errors
    }
}

module.exports = submissionsByUser;