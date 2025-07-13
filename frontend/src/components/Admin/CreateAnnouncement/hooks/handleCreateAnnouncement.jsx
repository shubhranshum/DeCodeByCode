export const handleCreateAnnouncement = (title) => {
    fetch(`http://localhost:3000/admin/createAnnouncement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
      credentials: "include",
    }).then(() => window.location.reload());
  };