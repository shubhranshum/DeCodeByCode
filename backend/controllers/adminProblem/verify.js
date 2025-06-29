const codeOutput = require("../../utils/codeOutput");
const adminProblem = require("../../models/adminProblem");

module.exports = async function (req, res) {
  const { id } = req.params;

  try {
    const problem = await adminProblem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    updatedTestCases = problem.testCases;
    for(let i = 0 ; i < problem.testCases.length ; i++) {
        updatedTestCases[i].output = await codeOutput(problem.codeSolution,problem.testCases[i].input);
    }
    await Problem.findByIdAndUpdate(
      id,
      { $set: { testCases: updatedTestCases } , $set: {isVerified : true}},
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
