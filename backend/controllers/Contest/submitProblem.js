const Submission = require('../../models/submissionSchema');
const SolvedProblem = require('../../models/solvedProblemSchema');
const updateStandingsOnSubmit = require('./submitToContest'); // Assuming you have a function to update standings

async function submitProblem(req, res) {
    const { problemId,contestId } = req.params; // Assuming the contest ID is passed as a URL parameter
    try {
        const {code,language,verdict,timeTaken,memoryTaken,startTime} = req.body;

        Submission.create({
            userId: req.user._id, // Assuming req.user is populated with the authenticated user's info
            problemId,
            contestId,
            code,
            language,
            verdict,
            timeTaken,
            memoryTaken,
            submissionTime: new Date(),
            timeFromStart: Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)// Calculate second since contest start
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
                contestId: contestId ? contestId : null, // If contestId is not provided, set it to null
            });
            console.log('Problem solved successfully');
        }
        // Update standings or any other logic related to contest submission
        // Assuming you have a function to update standings
        await updateStandingsOnSubmit(req.user._id, contestId, problemId, verdict, Math.floor((Date.now() - new Date(startTime).getTime()) / (60 * 1000)));
        res.status(200).json({ message: 'Successful submission for the contest'});
    } catch (err) {
        console.error('Error registering for contest:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = submitProblem;