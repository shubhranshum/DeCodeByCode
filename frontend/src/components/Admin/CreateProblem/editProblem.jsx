import React, { useState, useEffect } from "react";
import GeneralInfoSection from "./generalInfo.jsx";
import TestCaseSection from "./testcases.jsx";
import CodeSolutionSection from "./codeSolution.jsx";
import StatementSection from "./statement.jsx";
import { useParams } from "react-router-dom";
import {getAdminProblemById} from "../../Tasks/getAdminProblemById.jsx"; // Assuming you have a service to fetch problem details

export default function EditProblemSection() {
  const { id } = useParams(); // Assuming you have a problem ID to edit
  const [activeSection, setActiveSection] = useState("statement");
  const [generalInfo, setGeneralInfo] = useState({
    timeLimit: 1,
    memoryLimit: 256,
    // difficulty: "easy",
    // tags: [],
  })
  const [statement,setStatement] = useState({
    title: "",
    statement: "",
    inputFormat:  "",
    outputFormat: "",
    notes: "",
  })
  const [testCases, setTestCases] = useState([]); // Initialize with fetched test cases or empty array
  const [codeSolution, setCodeSolution] = useState("")

  // Fetch Problem details from backend with id
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const setProblem = (data) => {
    setGeneralInfo({
      timeLimit: data.timeLimit || 1,
      memoryLimit: data.memoryLimit || 256,
      // difficulty: data.difficulty || "easy",
      // tags: data.tags || [],
    });
    setStatement({
      title: data.title || "",
      statement: data.statement || "",
      inputFormat: data.inputFormat || "",
      outputFormat: data.outputFormat || "",
      notes: data.notes || "",
    });
    setTestCases(data.testCases || []);
    setCodeSolution(data.codeSolution || "");
  }


  useEffect(() => {
    // ✅ runs only once per component mount (i.e., per browser reload)
    const fetchProblem = async () => {
      try {
        const data = await getAdminProblemById(id);
        setProblem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, []); // empty dependency array = run once per page reload

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-6">Edit Sections</h2>
        <div className="space-y-4">
          <button
            onClick={() => setActiveSection("general")}
            className={`block w-full text-left px-4 py-2 rounded-md hover:bg-orange-600 transition ${
              activeSection === "general" ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            General Info
          </button>
          <button
            onClick={() => setActiveSection("statement")}
            className={`block w-full text-left px-4 py-2 rounded-md hover:bg-orange-600 transition ${
              activeSection === "statement" ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            Problem Statement
          </button>
          <button
            onClick={() => setActiveSection("code")}
            className={`block w-full text-left px-4 py-2 rounded-md hover:bg-orange-600 transition ${
              activeSection === "code" ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            Code Solution
          </button>
          <button
            onClick={() => setActiveSection("testcase")}
            className={`block w-full text-left px-4 py-2 rounded-md hover:bg-orange-600 transition ${
              activeSection === "testcase" ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            Test Cases
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 p-10">
        {activeSection === "general" && (
          <GeneralInfoSection
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
          />
        )}
        {activeSection === "statement" && (
          <StatementSection
            statement={statement}
            setStatement={setStatement}
          />
        )}
        {activeSection === "code" && (
          <CodeSolutionSection
            codeSolution={codeSolution}
            setCodeSolution={setCodeSolution}
          />
        )}
        {activeSection === "testcase" && (
          <TestCaseSection
            testCases={testCases}
            setTestCases={setTestCases}
          />
        )}
      </main>
    </div>
  );
}
