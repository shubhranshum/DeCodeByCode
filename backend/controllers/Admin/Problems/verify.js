const codeOutput = require("../../../utils/codeOutput");
const Problem = require("../../../models/problem");
const mongoose = require("mongoose");


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


module.exports = async function (req, res) {

  const { problemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    return res.status(400).json({ error: "Invalid problem ID" });
  }
  try {
    console.log("Hello from verify problem")
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    console.log(problem);
    
    if(problem.isVerified) {
      return res.status(400).json({ error: "Problem already verified" });
    }
    if(problem.codeSolution === undefined || problem.codeSolution === "") {
      return res.status(400).json({ error: "Problem code solution is not provided" });
    }

     
    if (problem.testCases.length === 0) {
      return res.status(400).json({ error: "Problem has no test cases" });
    }
    
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];
      console.log("running test case", i + 1);
      const result = await codeOutput(problem.codeSolution, testCase.input);
      console.log(result);
      testCase.output = {
        stdout: result.stdout,
        stderr: result.stderr,
        time: result.time,
        memory: result.memory,
        compile_output: result.compile_output,
        status_id: result.status_id,
        language_id: result.language_id
      };
      if (result.stderr || result.compile_output) {
        return res.status(500).json({ error: "Error in code execution" });
      }
    }
    // Now mark as verified and save
    problem.isVerified = true;
    await problem.save();
    return res.status(200).json({ message: "Problem Verified!!" });
  } catch (error) {
    console.error("Error saving test case:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
