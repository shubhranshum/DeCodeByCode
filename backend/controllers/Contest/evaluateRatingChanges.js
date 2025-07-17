const { calculateRatingChanges } = require('../../utils/ratingUtils.js');
const User = require('../../models/user');
const Standings = require('../../models/contest/standings'); // Assuming you have a Standings model

const evaluateContest = async (req, res) => {
  try {
    const contestId = req.params.contestId;

    // 1. Fetch all submissions for this contest
    const users = await Standings.find({ contestId });
    // assign ranks based on the current standings
    users.sort((a, b) => a.totalSolved - b.totalSolved || a.totalPenalty - b.totalPenalty);
    users.forEach((user, index) => {
      user.rank = index + 1; // Assign rank based on position in sorted standings
    });
    await Promise.all(users.map(user => user.save())); // Save updated ranks
    // 3. Fetch ratings for each user and assign ranks
    const usersWithRatings = await Promise.all(
      users.map(async (u, i) => {
        const user = await User.findById(u.userId);
        return {
          userId: user._id,
          username: user.username,
          rating: user.rating || 1500,
          rank: u.rank
        };
      })
    );

    // 4. Apply rating changes
    const ratedUsers = calculateRatingChanges(usersWithRatings);

    // 5. Update user ratings in DB
    await Promise.all(
      ratedUsers.map(u =>
        User.findByIdAndUpdate(u.userId, { rating: u.newRating })
      )
    );

    return res.status(200).json({ message: 'Ratings updated', ratedUsers });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = evaluateContest;