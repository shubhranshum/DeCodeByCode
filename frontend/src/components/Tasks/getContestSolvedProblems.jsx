
export async function getContestSolvedProblems(contestId) {
    const response = await fetch(`http://localhost:3000/contests/user-solved/${contestId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for session management
    });
    if (!response.ok) {
      throw new Error("Failed to fetch problems");
    }
    const data = await response.json();
    return data;
  }