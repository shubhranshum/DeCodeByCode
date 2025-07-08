export const handleVerifyAnnouncement = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/edit-announcement/${id}/verify`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.status !== 200) {
        alert("Failed to verify announcement");
        return;
      }
      setAnnouncements(
        announcements.map((a) =>
          a._id === id ? { ...a, isVerified: true } : a
        )
      );
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };
