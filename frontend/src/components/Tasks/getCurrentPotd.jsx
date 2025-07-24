/**
 * Fetches the current "Problem of the Day" (POTD) from the backend.
 * This function is designed to be used in the admin dashboard to display
 * which problem is currently set as the POTD.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the POTD object if successful, or null if not found.
 * @throws {Error} Throws an error if the network request fails or if the server returns an error status.
 */
export const getCurrentPotd = async () => {
    try {
        // Make a GET request to the specific endpoint for the Problem of the Day.
        // 'credentials: "include"' is important for sending cookies for authentication if your backend requires it.
        const response = await fetch('http://localhost:3000/potd', {
            method: 'GET',
            credentials: 'include',
        });

        // If the server responds with a status other than 200-299, it's considered an error.
        if (!response.ok) {
            // Handle cases where no POTD is set (e.g., a 404 Not Found response).
            if (response.status === 404) {
                console.log("No Problem of the Day is currently set.");
                return null;
            }
            // For other errors, throw to be caught by the catch block.
            throw new Error('Failed to fetch the Problem of the Day');
        }

        // Parse the JSON response from the server.
        const data = await response.json();
        
        // Return the fetched problem data.
        return data;

    } catch (error) {
        // Log the error for debugging purposes.
        console.error("Error in getCurrentPotd:", error);
        // Re-throw the error so the calling component (e.g., AdminDashboard) can handle it,
        // for instance, by showing an error message to the user.
        throw error;
    }
};
