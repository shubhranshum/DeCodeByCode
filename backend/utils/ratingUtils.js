function calculateRatingChanges(users) {
    const K = 60;
    const n = users.length;
  
    users.sort((a, b) => a.rank - b.rank);
  
    for (let i = 0; i < n; i++) {
      let expectedRank = 1;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        expectedRank += 1 / (1 + Math.pow(10, (users[j].rating - users[i].rating) / 400));
      }
  
      const actualRank = i + 1;
      const delta = K * (expectedRank - actualRank) / Math.log2(n);
      users[i].delta = Math.round(delta);
      users[i].newRating = users[i].rating + users[i].delta;
    }
  
    return users;
  }
  module.exports = { calculateRatingChanges };
  