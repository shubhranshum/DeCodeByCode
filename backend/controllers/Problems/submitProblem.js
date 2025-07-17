const Submission = require('../../models/submissionSchema');
const SolvedProblem = require('../../models/solvedProblemSchema');


async function submitProblem(req, res) {
    const { problemId } = req.params; // Assuming the contest ID is passed as a URL parameter
    try {
        console.log('Submission request received:', req.body);
        const {code,language,verdict,timeTaken,memoryTaken} = req.body;

        Submission.create({
            userId: req.user._id, // Assuming req.user is populated with the authenticated user's info
            problemId,
            code,
            language,
            verdict,
            timeTaken,
            memoryTaken,
            submissionTime: new Date(),
            // timeFromStart: Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)// Calculate second since contest start
        })
        if(verdict == 'Accepted') {
            const alreadySolved = await SolvedProblem.findOne({ userId:req.user._id, problemId });
            if(alreadySolved) {
                // If the problem is already solved, we can skip creating a new entry
                return res.status(200).json({ message: 'Problem already solved' });
            }
            await SolvedProblem.create({
                userId: req.user._id,
                problemId,
                submissionId: submissionId
            });
            console.log('Problem solved successfully');
        }
        res.status(200).json({ message: 'Successful submission for the contest'});
    } catch (err) {
        console.error('Error registering for contest:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = submitProblem;