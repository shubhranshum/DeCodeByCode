export const handleVerifyProblem = async (id, problems, setProblems) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/edit-problem/${id}/verify`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.status !== 200) {
        alert("Failed to verify problem");
        return;
      }
      setProblems(
        problems.map((p) => (p._id === id ? { ...p, isVerified: true } : p))
      );
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };