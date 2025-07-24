const Submission = require('../../models/submissionSchema');
const SolvedProblem = require('../../models/solvedProblemSchema');
//by omvrit
const Problem = require('../../models/problem');
const log  = require('../../controllers/activityController.js');
const User = require('../../models/user');

async function submitProblem(req, res) {
    const { problemId } = req.params; // Assuming the contest ID is passed as a URL parameter
    try {
        console.log("Hello from vibhu controller");
        console.log('Submission request received:', req.body);
        const { code, language, verdict, timeTaken, memoryTaken } = req.body;

        const submission = await Submission.create({
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
        console.log('Submission created successfully:', submission);
        if (verdict == 'Accepted') {
            const alreadySolved = await SolvedProblem.findOne({ userId: req.user._id, problemId });

            if (alreadySolved) {
                console.log('Problem already solved');
                return res.status(200).json({ message: 'Problem already solved' });
            }
            //saving problem
            const problem = await Problem.findById(problemId);
            if (!problem) {
                return res.status(404).json({ message: 'Problem not found' });
            }
            problem.solvedBy.push(req.user._id);
            problem.solvedCount += 1;
            problem.attemptCount += 1;
            await problem.save();
            //saving problem history
            const user  = await User.updateOne(
                { _id: req.user._id },
                {
                    $push: {
                        ProblemHistory: {
                            problemId: problem._id,
                            status: "Solved",
                            solvedAt: new Date(),
                            lastTriedAt: new Date(),
                        }
                    },
                }


            )
            console.log(user.ProblemHistory)
            //
            await SolvedProblem.create({
                userId: req.user._id,
                problemId,
                submissionId: submission._id,

            });
            //loggin activity
            await log.logActivity(req.user._id, problem._id, "Problem", "PROBLEM_SOLVED", "Problem Solved :"+problem.title);
            console.log('Problem solved successfully');
        }
        else{
            const problem = await Problem.findById(problemId);
            if (!problem) {
                return res.status(404).json({ message: 'Problem not found' });
            }
            problem.attemptCount+=1;
            await problem.save();
            console.log('Problem not solved');

        }
        res.status(200).json({ message: 'Successful submission for the contest' });
    } catch (err) {
        console.error('Error registering for contest:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = submitProblem;