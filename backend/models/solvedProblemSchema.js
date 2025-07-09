// models/SolvedProblem.js
const mongoose = require("mongoose");

const solvedProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    default: null  // null for practice problems
  },
  solvedAt: {
    type: Date,
    default: Date.now
  },
});

solvedProblemSchema.index({ userId: 1, problemId: 1, contestId: 1 }, { unique: true });

module.exports = mongoose.model("SolvedProblem", solvedProblemSchema);
