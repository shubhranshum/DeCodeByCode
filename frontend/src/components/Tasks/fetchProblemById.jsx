

export async function fetchProblemById(id) {
    const response = await fetch(`http://localhost:3000/fetchProblem/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // If using cookies/session
    });
    if (!response.ok) {
      throw new Error("Failed to fetch problem");
    }
    return response.json();
  }