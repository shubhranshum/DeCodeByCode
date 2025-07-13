

export const getAnnouncementById = async(id) => {

    const res = await fetch(`http://localhost:3000/admin/announcements/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
    })
    if(!res.ok) {
        throw new Error("Failed to fetch announcement");
    }
    const data = await res.json();
    return data;

};