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

        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

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
        
        


        const now = new Date();
        const existingEntryIndex = profile.ProblemHistory.findIndex(entry =>
            entry.problemId.equals(problem._id)
        );


        problem.attemptCount++;
        if (status === "Accepted") {
            problem.solvedCount++;
            problem.solvedBy.push(user._id);
            if (existingEntryIndex === -1) {
                // First time solving correctly
                profile.ProblemHistory.push({
                    problemId: problem._id,
                    status: "Solved",
                    solvedAt: now,
                    lastTriedAt: now
                });

                profile.stats.problemsSolved += 1;
                await logActivity(user._id, problemId, "Problem", "PROBLEM_SOLVED", problem.title);
            } else {
                const entry = profile.ProblemHistory[existingEntryIndex];

                if (entry.status === "Attempted") {
                    // Upgrade status to Solved
                    entry.status = "Solved";
                    entry.solvedAt = now;
                    entry.lastTriedAt = now;

                    profile.stats.problemsSolved += 1;
                    await logActivity(user._id, problemId, "Problem", "PROBLEM_SOLVED", problem.title);
                } else {
                    // Already solved — just update lastTriedAt
                    entry.lastTriedAt = now;
                }
            }

            profile.stats.solutionsAccepted += 1;
        } else {
            // status !== "Accepted"
            if (existingEntryIndex === -1) {
                // First time attempting
                profile.ProblemHistory.push({
                    problemId: problem._id,
                    status: "Attempted",
                    lastTriedAt: now
                });
                logActivity(user._id, problemId, "Problem", "PROBLEM_ATTEMPTED", problem.title);
            } else {
                // Update only lastTriedAt if already attempted or solved
                profile.ProblemHistory[existingEntryIndex].lastTriedAt = now;
                logActivity(user._id, problemId, "Problem", "PROBLEM_ATTEMPTED", problem.title);
            }
        }
        await problem.save();
        await problemStat.save();
        await profile.save();



        res.status(200).json({ message: "Problem submitted successfully" });
    } catch (error) {
        console.error("Error submitting problem:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = submitProblem;
