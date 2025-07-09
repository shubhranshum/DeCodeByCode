export const handleVerifyContest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/edit-contest/${id}/verify`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.status !== 200) {
        alert("Failed to verify contest");
        return;
      }
      setContests(
        contests.map((c) => (c._id === id ? { ...c, isVerified: true } : c))
      );
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };