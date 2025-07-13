import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiEdit, FiPlus, FiClock, FiLock, FiUnlock } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAdminContestById } from "../../Tasks/getAdminContestById.jsx";  
import { getProblemById } from "../../Tasks/getProblemById.jsx";  // Assuming this function fetches a problem by ID


export default function ContestEditSection() {
  const { contestId } = useParams();
  const [activeSection, setActiveSection] = useState("general");
  const [contest, setContest] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: 120,
    isPrivate: false,
    contestType: "ICPC",
  });
  const [problems, setProblems] = useState([]);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemIdInput, setProblemIdInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setContestData = (data) => {
    // Function to round time to next 5-minute interval
    const getNext5MinuteInterval = () => {
      const date = new Date();
      const minutes = date.getMinutes();
      const roundedMinutes = Math.floor(minutes / 5) * 5 + 5;

      // Create new date with rounded time
      const roundedDate = new Date(date);
      roundedDate.setMinutes(roundedMinutes);
      roundedDate.setSeconds(0);
      roundedDate.setMilliseconds(0);

      // Handle hour overflow
      if (roundedMinutes >= 60) {
        roundedDate.setMinutes(0);
        roundedDate.setHours(roundedDate.getHours() + 1);
      }
      return roundedDate;
    };
    const formatForDatetimeLocalInput = (utcDateString) => {
        const date = new Date(utcDateString);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16); // Format: "yyyy-MM-ddTHH:mm"
      };

    setContest({
      title: data.title || "",
      description: data.description || "",
      startTime: formatForDatetimeLocalInput(data.startTime || getNext5MinuteInterval()),
      endTime: formatForDatetimeLocalInput(data.endTime || getNext5MinuteInterval()),
      duration: data.duration || 120,
      isPrivate: data.isPrivate || false,
      contestType: data.contestType || "ICPC",
    });

    // Set problems array (note the capital 'P' in Problems was corrected)
    setProblems(data.Problems || []);
  };

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const data = await getAdminContestById(contestId);
        setContestData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setContest((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


    const handleSaveChanges = async () => {
    try {
      const updatedContest = {
        ...contest,
        startTime: new Date(contest.startTime).toISOString(),
        endTime: new Date(new Date(contest.startTime).getTime() + contest.duration * 60000).toISOString(),
      };
      const response = await fetch(`http://localhost:3000/admin/edit-contest/${contestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContest),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update contest");
      }

      toast.success("Contest updated successfully");
    } catch (error) {
      console.error("Error updating contest:", error);
      toast.error(error.message || "An error occurred while updating the contest");
    }
}
const setProblemsForContest = async (problems) => {
    const response = await fetch(`http://localhost:3000/admin/edit-contest/${contestId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Problems : problems
        }),
        credentials: "include",
    })
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add problems to contest");
    }
}
  const handleAddProblem = async () => {
    if (!problemIdInput.trim()) {;
      toast.error("Please enter a problem ID");
      return;
    }
    const problem = await getProblemById(problemIdInput.trim());
    if (!problem) {
        toast.error("Problem not found");
        return;
    }
    if (problems.some(p => p._id === problem._id)) {
        toast.error("Problem already added to contest");
        return;
      }
    const newProblem = {
      _id : problem._id,
      title: problem.title,
    };
    const updatedProblems = [...problems, newProblem];
    setProblems(updatedProblems);
    await setProblemsForContest(updatedProblems.map(p => p._id));
    setProblemIdInput("");
    setShowProblemModal(false);
  };

  const handleRemoveProblem = (problemId) => {
    const updatedProblems = problems.filter(p => p._id !== problemId);
    setProblems(updatedProblems);
    setProblemsForContest(updatedProblems.map(p => p._id));
    toast.info("Problem removed from contest");
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

//--------------------------------------------------------------------------------------------------------


  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-6">Edit Contest</h2>
        <div className="space-y-4">
          <button
            onClick={() => setActiveSection("general")}
            className={`flex items-center w-full text-left px-4 py-2 rounded-md hover:bg-orange-600 transition ${
              activeSection === "general" ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            <FiEdit className="mr-2" /> General Info
          </button>
          <button
            onClick={() => setActiveSection("problems")}
            className={`flex items-center w-full text-left px-4 py-2 rounded-md hover:bg-orange-600 transition ${
              activeSection === "problems" ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            <FiPlus className="mr-2" /> Contest Problems
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 p-8">
        {activeSection === "general" && (
          <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">General Information</h2>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-md transition"
            >
              Save Changes
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={contest.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={contest.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={contest.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <FiClock className="inline mr-2" /> Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={contest.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Contest Type</label>
              <select
                name="contestType"
                value={contest.contestType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ICPC">ICPC</option>
                <option value="IOI">IOI</option>
                <option value="CF">Codeforces</option>
              </select>
            </div>
            
            <div className="flex items-center col-span-2">
              <input
                type="checkbox"
                name="isPrivate"
                checked={contest.isPrivate}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded"
              />
              <label className="ml-2 block text-sm text-gray-300">
                {contest.isPrivate ? <FiLock className="inline mr-1" /> : <FiUnlock className="inline mr-1" />}
                Private Contest
              </label>
            </div>
          </div>
        </div>
        )}
        
        {activeSection === "problems" && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Contest Problems</h2>
              <button
                onClick={() => setShowProblemModal(true)}
                className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-md transition"
              >
                <FiPlus className="mr-2" /> Add Problem
              </button>
            </div>
        
            {problems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No problems added yet. Click "Add Problem" to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Difficulty</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {problems.map((problem) => (
                      <tr key={problem.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{problem._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{problem.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            problem.difficulty === "Easy" ? "bg-green-900 text-green-300" :
                            problem.difficulty === "Medium" ? "bg-yellow-900 text-yellow-300" :
                            "bg-red-900 text-red-300"
                          }`}>
                            Not-Specified
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                          onClick={() => window.location.href = `/problems/${problem._id}`}
                          className="text-blue-400 hover:text-blue-300 mr-4">View</button>
                          <button 
                            onClick={() => handleRemoveProblem(problem._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Add Problem Modal */}
        {showProblemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
              <h3 className="text-lg font-medium mb-4">Add Problem to Contest</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Problem ID</label>
                <input
                  type="text"
                  value={problemIdInput}
                  onChange={(e) => setProblemIdInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter problem ID"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowProblemModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProblem}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md"
                >
                  Add Problem
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}