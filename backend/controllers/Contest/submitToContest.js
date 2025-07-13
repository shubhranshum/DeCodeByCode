const Standings = require("../../models/contest/standings");

async function updateStandingsOnSubmit(userId, contestId, problemId, verdict, timeFromStart) {
  let standing = await Standings.findOne({ contestId, userId });

  if (!standing) {
    // First submission by the user in this contest
    const newProblemResult = {
      problemId,
      verdict,
      attempts: 1,
      timeFromStart: verdict === "Accepted" ? timeFromStart : 0,
    };

    const newStanding = new Standings({
      contestId,
      userId,
      totalSolved: verdict === "Accepted" ? 1 : 0,
      totalPenalty: verdict === "Accepted" ? timeFromStart : 0,
      problemResults: [newProblemResult],
    });

    await newStanding.save();
    return;
  }

  // If the user already has a standing entry
  const problem = standing.problemResults.find(p => p.problemId.toString() === problemId.toString());

  if (!problem) {
    // First attempt on this problem
    standing.problemResults.push({
      problemId,
      verdict,
      attempts: 1,
      timeFromStart: verdict === "Accepted" ? timeFromStart : 0,
    });

    if (verdict === "Accepted") {
      standing.totalSolved += 1;
      standing.totalPenalty += timeFromStart;
    }
  } else {
    // Already attempted this problem
    if (problem.verdict === "Accepted") {
      // Already accepted before, ignore further submissions
      return;
    }

    // Update attempt count
    problem.attempts += 1;

    if (verdict === "Accepted") {
      // Accepted for the first time
      problem.verdict = "Accepted";
      problem.timeFromStart = timeFromStart;

      const penaltyForProblem = timeFromStart + (problem.attempts - 1) * 5;

      standing.totalSolved += 1;
      standing.totalPenalty += penaltyForProblem;
    }
  }

  standing.lastUpdated = Date.now();
  await standing.save();
}

module.exports = updateStandingsOnSubmit;
