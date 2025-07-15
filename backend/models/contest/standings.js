const mongoose = require("mongoose");

const problemResultSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  verdict: {
    type: String, // e.g., "Accepted", "Wrong Answer", "Time Limit Exceeded"
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  timeFromStart: {
    type: Number, // In seconds
    default: 0,
  },
});

const standingsSchema = new mongoose.Schema({
  rank:{
    type: Number,
    // required: true,
    // unique: true, // Ensure ranks are unique
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalSolved: {
    type: Number,
    default: 0,
  },
  totalPenalty: {
    type: Number,
    default: 0, // In seconds or penalty points
  },
  problemResults: [problemResultSchema], // One entry per problem
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("Standings", standingsSchema);
