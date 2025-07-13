export const handleDeleteProblem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;
    try {
      await fetch(`http://localhost:3000/admin/deleteProblem/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(() => window.location.reload());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };