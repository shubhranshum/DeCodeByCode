export const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await fetch(`http://localhost:3000/admin/deleteAnnouncement/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(() => window.location.reload());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
