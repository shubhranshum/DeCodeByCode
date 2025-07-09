async function codeOutput(code,stdin,expected_output) {
    // console.log("Code Submitted: ",code); // this should be the code string
    console.log("Submitted Code:", code);
    console.log(expected_output);
    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        "credentials": "include", // Include cookies for session management
        body: JSON.stringify({
          code,
          language: 52, // C++
          stdin,
          expected_output
        }),
      });
      const token = await response.json();
      console.log("Response Token:", token);
      const encodedToken = encodeURIComponent(token.token);
      console.log("Submission Token:", token.token,encodedToken);
      // Poll for result
      let result;
      while (true) {
        const res = await fetch(`http://localhost:3000/result/${encodedToken}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          "credentials": "include", // Include cookies for session management
        }
        );
        result = await res.json();
        if (result.status_id >= 3) break; // 1 = In queue, 2 = Processing
        await new Promise(r => setTimeout(r, 1000));
      }
      return result;
      // alert("Output:\n" + result.output);
    } catch (err) {
      alert("Error submitting code");
      console.error(err);
    }
  };

export default codeOutput;