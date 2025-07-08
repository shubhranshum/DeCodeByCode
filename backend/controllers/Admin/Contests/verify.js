const Contest = require("../../../models/contest/contest");
const mongoose = require("mongoose");



module.exports = async function (req, res) {
  const { contestId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Contest ID" });
  }
  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    if(contest.isVerified) {
      return res.status(400).json({ error: "Contest already verified" });
    }
    // Now mark as verified and save
    contest.isVerified = true;
    await contest.save();
    return res.status(200).json({ message: "Contest Verified!!" });
  } catch (error) {
    console.error("Error verifying contest:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
