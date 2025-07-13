async function codeOutput(code,stdin) {
    // console.log("Code Submitted: ",code); // this should be the code string
    console.log("Submitted Code:", code);
    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        "credentials": "include", // Include cookies for session management
        body: JSON.stringify({
          code: code,
          language: 52,
          stdin: stdin, // Use the state variable for stdin
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