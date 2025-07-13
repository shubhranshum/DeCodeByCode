const Submission = require('../../models/submissionSchema');

async function submissionsByUser(req, res) {
    const { contestId, problemId } = req.params; // Extracting contestId and problemId from the request parameters

    try {
        // Fetching submissions for the specific user, contest, and problem
        const submissions = await Submission.find({
            contestId,
            problemId,
            userId: req.user._id // Assuming req.user is populated with the authenticated user's info
        }).sort({ submissionTime: -1 }); // Sorting by submission time in descending order

        res.status(200).json(submissions); // Sending the submissions as a JSON response
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ message: 'Internal server error' }); // Handling errors
    }
}

module.exports = submissionsByUser;