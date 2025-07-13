export const getAdminAnnouncements = async () => {
  try {
    const response = await fetch('http://localhost:3000/admin/announcements', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

    });
    if (!response.ok) throw new Error('Failed to fetch announcements');
    
    const data = await response.json();
    console.log(data);
    
    // console.log(data);
    return (data) ? data : []; // Ensure we always return an array
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return []; // Return empty array on error
  }
};