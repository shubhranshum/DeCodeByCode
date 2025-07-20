export const handleCreateContest = (title) => {
    fetch(`http://localhost:3000/admin/createContest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
      credentials: "include",
    })
  };