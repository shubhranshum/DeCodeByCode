const Problem = require("../models/problem"); // Adjust based on your schema
const codeOutput = require("../utils/codeOutput"); // Assuming you have a utility to execute code and get output

module.exports = async function (req, res) {
  const { id } = req.params;
  const { input, visible } = req.body;
  if (!input) return res.status(400).json({ error: "Test case input required" });
  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    problem.testCases.push({ input, visible: visible || false });
    await problem.save();

    return res.status(200).json({ message: "Test case added successfully" });
  } catch (error) {
    console.error("Error saving test case:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
