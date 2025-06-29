import React from "react";
import { useParams } from "react-router-dom";

export default function CodeSolutionSection({codeSolution, setCodeSolution}) {
  const { id } = useParams();
    const [solution, setSolution] = React.useState(codeSolution || "// Write the correct code solution here...");
    const handleSave = async () => {
    if (!solution.trim()) {
        alert("Please enter a valid code solution.");
        return;
    }
    else {
        setCodeSolution(solution);
        // Here you can handle the save logic, e.g., send the code to the backend
        try{
            const response = await fetch(`http://localhost:3000/admin/edit-problem/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session management
            body: JSON.stringify({ codeSolution: solution }),
          })
          if (!response.ok) {
            throw new Error("Failed to save problem data");
          }
          else{
            console.log("Problem Data Saved:", codeSolution);
            alert("Problem data saved successfully!");
          }
        }
        catch (error) {
          console.error("Error saving problem data:", error);
          alert("Failed to save problem data. Please try again.");
          return;
        }
        alert("Code solution saved successfully!");
    }
    }
  return (
    <div>
    {/* <SectionSwitcherCard/> */}
    <div className="text-white space-y-6">
      <div>
        <label className="block mb-2 font-semibold text-white">Solution Code:</label>
        <textarea
          className="bg-gray-900 text-white w-full h-130 p-4 rounded-md border border-gray-700 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="// Write the correct code solution here..."
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
      >
        Save Solution
      </button>
    </div>
    </div>
  );
}
