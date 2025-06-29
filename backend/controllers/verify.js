const codeOutput = require("../utils/codeOutput");
const Problem = require("../models/problem");

module.exports = async function (req, res) {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    updatedTestCases = problem.testCases;
    // console.log("TestCases: ", updatedTestCases);
    // Process each test case output using Promise.all and async codeOutput
    for(let i = 0 ; i < problem.testCases.length ; i++) {
        updatedTestCases[i].output = await codeOutput(problem.codeSolution,problem.testCases[i].input);
    }
    // console.log("Updated TestCases: ", updatedTestCases);
    // // Save updated testCases back to DB
    await Problem.findByIdAndUpdate(
      id,
      { $set: { testCases: updatedTestCases } },
      { new: true }
    );
    return res.status(200).json({
      message: "Problem Verified!!",
    //   testCases: updatedProblem.testCases,
    });
  } catch (error) {
    console.error("Error saving test case:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
