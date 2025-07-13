export const handleCreateProblem = (title) => {
    fetch(`http://localhost:3000/admin/createProblem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title}),
      credentials: "include",
    }).then(() => window.location.reload());
  };
  
