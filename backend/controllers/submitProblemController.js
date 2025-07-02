const ProblemStat = require("../models/profile/problemStatsSchema.js");

const Problem = require("../models/problem.js");

const User = require("../models/user.js");
const { logActivity, getUserActivities, deleteUserActivities } = require('./activityController.js');


const submitProblem = async (req, res) => {
    try {
        const { problemid, solution, status, timetaken, memorytaken } = req.body;
        const problem = await Problem.findOne({ _id: problemid });
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        const user = await User.findOne({_id:req.user._id});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const problemStat = new ProblemStat({
            user: user._id,
            problemid: problem._id,
            problemtitle: problem.title,
            solution: solution,
            solvedAt: new Date(),
            status: status,
            timetaken: timetaken,
            memorytaken: memorytaken
        });
        await problemStat.save();
        res.status(200).json({ message: "Problem submitted successfully" });
    } catch (error) {
        console.error("Error submitting problem:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = submitProblem;
