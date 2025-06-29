const adminProblem = require("../../models/adminProblem"); // Adjust based on your schema


module.exports = async function (req, res) {
  const { id } = req.params;
  const { input, visible, explanation } = req.body;
  console.log(input,visible,explanation);
  if (!input) return res.status(400).json({ error: "Test case input required" });
  try {
    const problem = await adminProblem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    // console.log(problem);
    problem.testCases.push({ input, visible: visible || false , explanation: explanation || "" });
    await problem.save();
    return res.status(200).json({ message: "Test case added successfully" });
  } catch (error) {
    console.error("Error saving test case:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
