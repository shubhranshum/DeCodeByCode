const mongoose = require("mongoose");
const ProblemStat = require("../../models/profile/problemStatsSchema.js");
const Profile = require("../../models/profile/userProfile.js");
const Problem = require("../../models/problem.js");
const Activity = require("../../models/profile/activityModel.js");
const User = require("../../models/user.js");
const { logActivity } = require('../activityController.js');

const submitProblem = async (req, res) => {
    try {
        const { problemId, solution, status, timeTaken, memoryTaken } = req.body;

        const problem = await Problem.findById(problemId);

        if (!problem) return res.status(404).json({ message: "Problem not found" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });



        // Save submission to ProblemStat history
        const problemStat = new ProblemStat({
            user: user._id,
            problemid: problem._id,
            problemtitle: problem.title,
            solution,
            solvedAt: new Date(),
            status,
            timeTaken,
            memoryTaken
        });
        if (status == "Accepted") { await logActivity(user._id, problemId, "Problem", "PROBLEM_SOLVED", problem.title); }
        else {
            await logActivity(user._id, problemId, "Problem", "PROBLEM_ATTEMPTED", problem.title);
        }

        await problem.save();
        await problemStat.save();




        res.status(200).json({ message: "Problem submitted successfully" });
    } catch (error) {
        console.error("Error submitting problem:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = submitProblem;
