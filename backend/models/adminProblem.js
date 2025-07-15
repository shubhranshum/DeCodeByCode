// models/Problem.js

const mongoose = require("mongoose");

// const Output = new mongoose.Schema({
//   stdout: {
//     type: String,
//     default: "",
//   },
//   stderr:{
//     type:String,
//     default: "",
//   },
//   time:{
//     type: Number,
//   },
//   memory:{
//     type: Number
//   },
//   compilerOutput: {
//     type: String,
//     default: "",
//   },
//   status:{
//     type: String,
//   },
//   language: {
//     type: String,
//   }
// })



const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true, // Default to visible
  },
  explanation:{
    type: String,
    default: "Explanation For Test Case."
  },
  output: {
    type: String,
    default: null
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Output",
    // default: null
  }
});





const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // to ensure no duplicates
  },
  statement: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard","Not Specified"],
    // required: true,
  },
  inputFormat: {
    type: String,
  },
  outputFormat: {
    type: String,
  },
  testCases: {
    type: [testCaseSchema],
    default: []
  },
  timeLimit: {
    type: Number,
    default: 1, // in s
  },
  memoryLimit: {
    type: Number,
    default: 256, // in MB
  },
  notes: {
    type: String,
  },
  tags: [String], // e.g. ["math", "dp", "greedy"]
  codeSolution: {
    type: String,
    // required: true, // Assuming every problem has a code solution
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true, // Assuming every problem is created by a user
  },
  isVerified:{
    type: Boolean,
    default: false, // Problems are not verified by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("adminProblem", problemSchema);
