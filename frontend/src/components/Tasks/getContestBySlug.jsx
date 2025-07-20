
export async function getContestBySlug(slug) {
    console.log("Fetching contest with slug:", slug);
      const response = await fetch(`http://localhost:3000/contests/slug/${slug}`, {
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