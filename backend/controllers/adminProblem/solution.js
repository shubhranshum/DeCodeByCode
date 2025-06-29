const adminProblem = require("../../models/adminProblem"); // Adjust based on your schema


module.exports = async function (req, res) {
  const { id } = req.params;
  const { codeSolution } = req.body;
  if (!codeSolution) return res.status(400).json({ error: "code Solution required" });
  try {
    const problem = await adminProblem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    problem.codeSolution = codeSolution;
    await problem.save();

    return res.status(200).json({ message: "Test case added successfully" });
  } catch (error) {
    console.error("Error saving test case:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
