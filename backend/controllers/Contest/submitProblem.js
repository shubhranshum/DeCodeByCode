const Submission = require('../../models/submissionSchema');
const SolvedProblem = require('../../models/solvedProblemSchema');
const updateStandingsOnSubmit = require('./submitToContest'); // Assuming you have a function to update standings
const Contest = require('../../models/contest/contest'); // Assuming you have a Contest model

async function submitProblem(req, res) {
    const { problemId,contestId } = req.params; // Assuming the contest ID is passed as a URL parameter
    console.log('Problem ID:', problemId);
    console.log('Contest ID:', contestId);
    try {
        // console.log('Submission request received:', req.body);
        const {code,language,verdict,timeTaken,memoryTaken} = req.body;
        const contest = await Contest.findById(contestId);
        // console.log('Contest found:', contest);
        const startTime = contest.startTime; // Assuming startTime is a Date object in the contest document
        // const startDate = new Date(startTime);
        // if (isNaN(startDate.getTime())) {
        //     console.error('Invalid startTime:', startTime);
        //     return res.status(400).json({ message: 'Invalid startTime' });
        // }

        const timeFromStart = Math.floor((Date.now() - startTime.getTime()) / 1000); // in seconds

        const submission = await Submission.create({
            userId: req.user._id,
            problemId,
            contestId,
            code,
            language,
            verdict,
            timeTaken,
            memoryTaken,
            submissionTime: new Date(),
            timeFromStart
        });
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