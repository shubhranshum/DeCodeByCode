const mongoose = require("mongoose");

const Output = new mongoose.Schema({
  stdout: {
    type: String,
    default: "",
  },
  stderr:{
    type:String,
    default: "",
  },
  time:{
    type: Number,
  },
  memory:{
    type: Number
  },
  compile_output: {
    type: String,
    default: "",
  },
  status_id:{
    type: String,
  },
  language_id: {
    type: String,
  }
})



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
    type: Output,
    default: {
      stdout: "",
      stderr: "",
      time: 0,
      memory: 0,
      compile_output: "",
      status_id: "",
      language_id: ""
    }
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
  points:{
    type: Number,
    default: 100, // Default to 0 points
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true, // Assuming every problem is created by a user
  },
  //added by omvrut

  attemptCount: {
    type: Number,
    default: 0,
  },
  solvedCount: {
    type: Number,
    default: 0,
  },
  solvedBy:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  isVerified: {
    type: Boolean,
    default: false, // Default to false
  },
  isGlobal:{
    type: Boolean,
    default: false, // Default to false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


module.exports = mongoose.model("Problem", problemSchema);
