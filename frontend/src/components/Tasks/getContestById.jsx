
export async function getContestById(id) {
  console.log("Fetching contest with slug:", id);
    const response = await fetch(`http://localhost:3000/contests/${id}`, {
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