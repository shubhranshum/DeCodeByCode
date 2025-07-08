import React, {useState} from "react";



export default function TestCaseSection({testCases,setTestCases, id}) {
  const [showPopup, setShowPopup] = useState(false);
  const [newInput, setNewInput] = useState("");
  const [explanation, setExplanation] = useState("");

  const addTestCase = async () => {
    if (newInput.trim() !== "") {
      const updatedTestCases = [...(testCases || []), {input:newInput.trim(),visible:true, explanation: explanation.trim()}];
      setTestCases(updatedTestCases );
      // Set UpdatedTestCases to Backend
      const response = await fetch(`http://localhost:3000/admin/edit-problem/${id}/testcase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
        body: JSON.stringify({ input: newInput.trim(), visible: true , explanation: explanation.trim() }),
      })
      if (!response.ok) {
        alert("Failed to save test cases. Please try again.");
        return;
      }
      else{
        console.log("Test Cases Saved:", updatedTestCases);
        alert("Test cases saved successfully!");
        setNewInput("");
        setExplanation("");
        setShowPopup(false);
      }
    }
  };
  const removeTestCase = async (testCaseId) => {
    const updatedTestCases = testCases.filter((_, index) => index !== id);
    setTestCases(updatedTestCases);
    // Update the backend
    const response = await fetch(`http://localhost:3000/admin/edit-problem/${id}/testcase/${testCaseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for session management
      body: JSON.stringify({ id: id }),
    });
    if (!response.ok) {
      alert("Failed to remove test case. Please try again.");
      return;
    }
    console.log("Test Case Removed:", id);
  }

  return (
    <div className="text-white space-y-6">
      <h2 className="text-2xl font-semibold">Test Cases</h2>

      <ul className="list-disc pl-5 space-y-2">
        {(testCases || []).map((tc, idx) => (
          <li key={idx} className="bg-white/10 p-2 rounded text-sm truncate">
            {tc.input.length > 50 ? tc.input.slice(0, 50) + "..." : tc.input}
          </li>
        ))}
      </ul>

      <button
        className="bg-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-600"
        onClick={() => setShowPopup(true)}
      >
        Add Test Case
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl space-y-4">
            <h3 className="text-xl font-bold text-white">Add Test Case</h3>
            <textarea
              rows={6}
              className="w-full bg-black text-white font-mono p-4 rounded-md border border-white/20 focus:outline-none"
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
              placeholder="Enter test case input..."
            />
            <textarea
              rows={3}
              className="w-full bg-black text-white font-mono p-4 rounded-md border border-white/20 focus:outline-none"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Enter setExplanation for the test case (optional)"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                onClick={addTestCase}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
