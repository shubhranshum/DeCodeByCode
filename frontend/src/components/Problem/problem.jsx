import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmissionCodeEditor from "../Tasks/submissionCodeEditor.jsx";
import codeOutput from "../Tasks/output.jsx";
import MathjaxRenderer from "../MathjaxRenderer";

export default function Problem() {
  const { problemId } = useParams();
  const[language, setLanguage] = useState("cpp");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your solution here");
  const [verdict, setVerdict] = useState(null);
  const [activeTab, setActiveTab] = useState("problem");
  const [isLoading, setIsLoading] = useState(true);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [status, setStatus] = useState("");
  const [isSolutionsLoading, setIsSolutionsLoading] = useState(false);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
  const theme = "dark";
  const isDark = theme === "dark";

 useEffect(() => {
  let isMounted = true;
  setIsLoading(true);
  
  fetch(`http://localhost:3000/problems/${problemId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (isMounted) {
        setProblem(data);
        setIsLoading(false);
      }
    })
    .catch((err) => {
      if (isMounted) {
        console.error("Failed to load problem:", err);
        setIsLoading(false);
      }
    });

  fetchSolutions();
  fetchSubmissions();

  return () => {
    isMounted = false;
  };
}, [problemId]);

  // Fetch solutions
  const fetchSolutions = async () => {
    if (solutions.length > 0) return;
    setIsSolutionsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/problem/solutions/${problemId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();

      setSolutions(data.solutions || []);
    } catch (err) {
      console.error("Failed to load solutions:", err);
    } finally {
      setIsSolutionsLoading(false);
    }
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
  if (submissions.length > 0) return;
  setIsSubmissionsLoading(true);
  try {
    const res = await fetch(
      `http://localhost:3000/problem/submissions/${problemId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await res.json();

    // Find the latest correct submission
    // const latestCorrectSubmission = data.submissions.find(
    //   (sub) => sub.status === "Accepted"
    // );

    
    // // Only set code if we found a correct submission
    // if (latestCorrectSubmission) {
    //   setCode(latestCorrectSubmission.solution);
    // }

    setStatus(data.ifSolved);
    setSubmissions(data.submissions || []);
  } catch (err) {
    console.error("Failed to load submissions:", err);
  } finally {
    setIsSubmissionsLoading(false);
  }
};

  const handleCodeSubmit = async (code) => {
    let isCorrect = true;
    let userOutput = null;
    let maxTimeTaken = 0;
    let maxMemoryUsed = 0;
    setCode(code);

    for (let i = 0; i < problem.testCases.length; i++) {
      setVerdict(`Running on test case: ${i + 1}`);
      const testCase = problem.testCases[i];
      userOutput = await codeOutput(code, testCase.input);
      const correctOutput = testCase.output;
      maxTimeTaken = Math.max(maxTimeTaken, userOutput.time);
      maxMemoryUsed = Math.max(maxMemoryUsed, userOutput.memory);

      if (userOutput.status_id !== 3) {
        setVerdict(`${userOutput.status.description} on Test Case: ${i + 1}`);
        isCorrect = false;
        break;
      }

      if (userOutput.stdout !== correctOutput.stdout) {
        setVerdict(`Wrong Answer on Test Case: ${i + 1}`);
        userOutput.stderr = `Wrong Answer on Test Case: ${i + 1}`;
        isCorrect = false;
        break;
      }
    }

    const submissionData = {
      problemid: problemId,
      solution: code,
      solved: isCorrect,
      status: isCorrect ? "Accepted" : userOutput.stderr,
      timetaken: maxTimeTaken,
      memorytaken: maxMemoryUsed,
    };

    try {
      const response = await fetch(`http://localhost:3000/problem/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submissionData),
      });
      const data = await response.json();
      console.log(data);
      if (isCorrect) setVerdict("Accepted");

      // Refresh submissions after submitting
      fetchSubmissions();
    } catch (err) {
      console.error("Submission failed:", err);
      setVerdict("Submission failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 border-4 ${
              isDark ? "border-orange-500" : "border-indigo-600"
            } border-t-transparent rounded-full animate-spin`}
          ></div>
          <p
            className={`mt-4 text-lg ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Loading problem...
          </p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark ? "bg-gray-900" : "bg-slate-50"
        }`}
      >
        <div
          className={`p-8 rounded-xl shadow-lg text-center ${
            isDark ? "bg-gray-800" : "bg-white border border-slate-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-red-500" : "text-red-600"
            }`}
          >
            Problem Not Found
          </h2>
          <p className={isDark ? "text-gray-300" : "text-slate-600"}>
            The requested problem could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Header */}
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
        } border-b px-6 py-4 shadow-sm`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-orange-500" : "text-indigo-600"
              }`}
            >
              {problem.title}
            </h1>
            <div className="flex items-center mt-2 text-sm">
              <span
                className={`mr-4 ${
                  isDark ? "text-gray-400" : "text-slate-500"
                }`}
              >
                Problem ID: {problemId}
              </span>
              
            </div>
             <span
            className={`text-[11px] px-2 py-[2px] rounded-full font-medium border ${
              status === "Solved"
                ? isDark
                  ? "bg-green-900/30 text-green-400 border-green-600"
                  : "bg-green-100 text-green-700 border-green-300"
                : status === "Attempted"
                ? isDark
                  ? "bg-yellow-900/20 text-yellow-400 border-yellow-600"
                  : "bg-yellow-100 text-yellow-700 border-yellow-300"
                : isDark
                ? "bg-gray-800 text-gray-400 border-gray-600"
                : "bg-slate-100 text-slate-500 border-slate-300"
            }`}
          >
            {status === "Solved"
              ? "Solved"
              : status === "Attempted"
              ? "Attempted"
              : "Unattempted"}
          </span>
          </div>
         

          <div
            className={`text-sm px-3 py-1 rounded-full ${
              isDark ? "bg-gray-700" : "bg-slate-200"
            }`}
          >
            Difficulty:{" "}
            <span
              className={`font-medium ${
                problem.difficulty === "Easy"
                  ? "text-green-500"
                  : problem.difficulty === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {problem.difficulty || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto">
        {/* Left Panel - Problem Content */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div
            className={`rounded-lg border overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`flex border-b ${
                isDark ? "border-gray-700" : "border-slate-200"
              }`}
            >
              {["problem", "testcases", "solutions"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? isDark
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-indigo-600 border-b-2 border-indigo-600"
                      : isDark
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "solutions") fetchSolutions();
                  }}
                >
                  {tab === "problem" && "Description"}
                  {tab === "testcases" && "Test Cases"}
                  {tab === "solutions" && "Solutions"}
                </button>
              ))}
            </div>

            <div
              className="p-4 overflow-y-auto"
              style={{ maxHeight: "calc(150vh - 250px)" }}
            >
              {activeTab === "problem" ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Problem Statement</h2>
                    <div
                      className={isDark ? "text-gray-300" : "text-slate-700"}
                    >
                      <MathjaxRenderer html={problem.statement} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Input Format</h2>
                    <div
                      className={`p-4 rounded-md font-mono text-sm ${
                        isDark
                          ? "bg-gray-700 text-gray-200"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <MathjaxRenderer html={problem.inputFormat} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Output Format</h2>
                    <div
                      className={`p-4 rounded-md font-mono text-sm ${
                        isDark
                          ? "bg-gray-700 text-gray-200"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <MathjaxRenderer html={problem.outputFormat} />
                    </div>
                  </div>

                  {problem.notes && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">Notes</h2>
                      <div
                        className={`p-4 rounded-md font-mono text-sm ${
                          isDark
                            ? "bg-gray-700 text-gray-200"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        <MathjaxRenderer html={problem.notes} />
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === "testcases" ? (
                <div className="space-y-6">
                  {problem.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className={`rounded-lg overflow-hidden ${
                        isDark ? "bg-gray-700" : "bg-slate-100"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 font-medium ${
                          isDark ? "bg-gray-600" : "bg-slate-200"
                        }`}
                      >
                        Test Case {index + 1}
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Input</h3>
                          <div
                            className={`p-3 rounded font-mono text-sm ${
                              isDark
                                ? "bg-gray-800"
                                : "bg-white border border-slate-200"
                            }`}
                          >
                            {testCase.input || "NO INPUT TESTCASE"}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">
                            Expected Output
                          </h3>
                          <div
                            className={`p-3 rounded font-mono text-sm ${
                              isDark
                                ? "bg-gray-800"
                                : "bg-white border border-slate-200"
                            }`}
                          >
                            {testCase.output?.stdout || "NO EXPECTED OUTPUT"}
                          </div>
                        </div>
                        {testCase.explanation && (
                          <div className="md:col-span-2">
                            <h3 className="text-sm font-medium mb-1">
                              Explanation
                            </h3>
                            <div
                              className={`p-3 rounded ${
                                isDark
                                  ? "bg-gray-800"
                                  : "bg-white border border-slate-200"
                              }`}
                            >
                              {testCase.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                activeTab === "solutions" && (
                  <SolutionsTab
                    solutions={solutions}
                    isLoading={isSolutionsLoading}
                    isDark={isDark}
                  />
                )
              )}
            </div>
          </div>

          
        </div>

        {/* Right Panel - Editor & Submissions */}
        <div className="lg:w-1/2 flex flex-col gap-4 min-h-[600px]">
          {/* Code Editor Panel */}
          <div
            className={`flex-1 rounded-lg border overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`px-4 py-2 border-b ${
                isDark
                  ? "border-gray-700 bg-gray-800"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Code Editor</h2>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                    onClick={() => setLanguage("cpp")}
                  >
                    C++
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                    onClick={() => setLanguage("python")}
                  >
                    Python
                  </button>
                  <button
                  className={`px-3 py-1 text-xs rounded font-medium ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                    onClick={() => setLanguage("java")}
                  >
                    Java
                  </button>
                  
                </div>
              </div>
            </div>
            <div className="h-[500px]">
              <SubmissionCodeEditor
                initialCode={code}
                language={language}
                onCodeChange={setCode}
                problemId={problemId}
                
              />
            </div>
          </div>

          {/* Output & Submit Panel */}
          <div
            className={`rounded-lg border overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`px-4 py-2 border-b flex justify-between items-center ${
                isDark
                  ? "border-gray-700 bg-gray-800"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <h2 className="font-medium">Output</h2>
              <button
                onClick={() => handleCodeSubmit(code)}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  isDark
                    ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600"
                    : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700"
                }`}
              >
                Submit Solution
              </button>
            </div>
            <div
              className={`p-4 font-mono text-sm min-h-24 ${
                isDark ? "bg-gray-900/30" : "bg-slate-50"
              }`}
            >
              {verdict ? (
                <div
                  className={`p-3 rounded ${
                    verdict === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : verdict.includes("Wrong")
                      ? "bg-red-100 text-red-800"
                      : isDark
                      ? "bg-gray-700"
                      : "bg-slate-200"
                  }`}
                >
                  {verdict}
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDark ? "text-gray-500" : "text-slate-400"
                  }`}
                >
                  Your code output will appear here after submission...
                </div>
              )}
            </div>
          </div>

          {/* Submissions Panel */}
          <div
            className={`rounded-lg border overflow-hidden ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`px-4 py-3 border-b ${
                isDark ? "border-gray-700" : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Your Submissions</h2>
                <button
                  onClick={fetchSubmissions}
                  className={`text-xs px-3 py-1 rounded ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  Refresh
                </button>
              </div>
            </div>
            <SubmissionsTab
              submissions={submissions}
              isLoading={isSubmissionsLoading}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// New component for Solutions Tab
// New component for Solutions Tab
function SolutionsTab({ solutions, isLoading, isDark }) {
  const [expanded, setExpanded] = useState(false);
  const [showCodeIndex, setShowCodeIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center">
        <div
          className={`w-10 h-10 border-4 ${
            isDark ? "border-orange-500" : "border-indigo-600"
          } border-t-transparent rounded-full animate-spin`}
        ></div>
        <p className={`mt-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
          Loading solutions...
        </p>
      </div>
    );
  }

  if (solutions.length === 0) {
    return (
      <div
        className={`py-8 text-center rounded-lg ${
          isDark ? "bg-gray-700/50" : "bg-slate-100"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
            isDark ? "bg-gray-700" : "bg-slate-200"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-base font-medium">No Solutions Yet</h3>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}
        >
          Be the first to share your solution!
        </p>
      </div>
    );
  }

  // Determine how many solutions to show based on expanded state
  const solutionsToShow = expanded ? solutions : solutions.slice(0, 3);

  return (
    <div className="space-y-4">
      

      {/* Solutions Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Community Solutions
        </h3>
        <button
          className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
            isDark
              ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              : "bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300"
          }`}
        >
          Submit Solution
        </button>
      </div>

      {/* Solutions List */}
      <div className="space-y-3">
        {solutionsToShow.map((solution, index) => (
          <div
            key={solution._id || index}
            className={`p-4 rounded-xl transition-all ${
              isDark
                ? "hover:bg-gray-800 bg-gray-900 border border-gray-700"
                : "hover:bg-slate-50 bg-white border border-slate-200"
            }`}
          >
            {/* User Info */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isDark 
                      ? "bg-gradient-to-br from-indigo-700/50 to-purple-800/50" 
                      : "bg-gradient-to-br from-indigo-200 to-purple-300"
                  }`}
                >
                  <span className="text-xs font-bold">U{index + 1}</span>
                </div>
                <div>
                  <div className="font-semibold">
                    {solution?.user?.username || "Anonymous"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">
                    {solution.problemTitle || "Problem Solution"}
                  </div>
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                isDark ? "bg-gray-700" : "bg-slate-200"
              }`}>
                {solution.language || "JS"}
              </div>
            </div>

            {/* Solution Actions */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setShowCodeIndex(showCodeIndex === index ? null : index)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  isDark
                    ? "bg-gradient-to-r from-blue-700/40 to-indigo-800/40 hover:from-blue-600/50 hover:to-indigo-700/50"
                    : "bg-gradient-to-r from-blue-100 to-indigo-200 hover:from-blue-200 hover:to-indigo-300"
                }`}
              >
                {showCodeIndex === index ? "Hide Solution" : "View Solution"}
              </button>
              
              {showCodeIndex === index && (
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(solution.solution || "");
                      alert("Solution copied!");
                    } catch (err) {
                      console.error("Failed to copy:", err);
                    }
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                      : "bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Code Block */}
            {showCodeIndex === index && (
              <div className="relative my-3">
                <div className={`absolute top-2 right-2 flex gap-1 ${isDark ? "bg-gray-800" : "bg-slate-100"} p-1 rounded`}>
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    {solution.language || "JavaScript"}
                  </span>
                </div>
                <pre
                  className={`text-sm overflow-x-auto rounded-lg p-4 max-h-64 ${
                    isDark
                      ? "bg-gray-800 text-gray-300"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {solution.solution || "// No solution provided"}
                </pre>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700 dark:border-slate-200">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  solution.status === "Accepted"
                    ? isDark
                      ? "bg-green-900/30 text-green-400"
                      : "bg-green-100 text-green-700"
                    : isDark
                    ? "bg-gray-700 text-gray-400"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {solution.status || "Pending"}
              </span>
              <span className="text-xs text-slate-500 dark:text-gray-400">
                {solution.createdAt
                  ? new Date(solution.createdAt).toLocaleDateString()
                  : "Date N/A"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All / View Less Button */}
      {solutions.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
            isDark
              ? "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
              : "bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300"
          }`}
        >
          {expanded ? "View Less" : `View All ${solutions.length} Solutions`}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// New component for Submissions Tab
function SubmissionsTab({ submissions, isLoading, isDark }) {
  if (isLoading) {
    return (
      <div className="py-6 flex flex-col items-center justify-center">
        <div
          className={`w-8 h-8 border-4 ${
            isDark ? "border-orange-500" : "border-indigo-600"
          } border-t-transparent rounded-full animate-spin`}
        ></div>
        <p
          className={`mt-3 text-sm ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}
        >
          Loading submissions...
        </p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div
        className={`py-6 text-center ${
          isDark ? "bg-gray-800/30" : "bg-slate-50"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
            isDark ? "bg-gray-700" : "bg-slate-200"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium">No Submissions Yet</h3>
        <p
          className={`text-xs mt-1 ${
            isDark ? "text-gray-500" : "text-slate-500"
          }`}
        >
          Submit your solution to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
      <table className="w-full text-sm">
        <thead>
          <tr
            className={`border-b ${
              isDark ? "border-gray-700" : "border-slate-200"
            }`}
          >
            <th className="text-left py-2 px-4">Time</th>
            <th className="text-left py-2 px-4">Status</th>
            <th className="text-left py-2 px-4">Runtime</th>
            <th className="text-left py-2 px-4">Memory</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, index) => (
            <tr
              key={index}
              className={`border-b ${
                isDark
                  ? "border-gray-700 hover:bg-gray-700/30"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <td className="py-3 px-4">
                {sub.createdAt
                  ? new Date(sub.createdAt).toLocaleString()
                  : "N/A"}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    sub.status === "Accepted"
                      ? isDark
                        ? "bg-green-900/30 text-green-400"
                        : "bg-green-100 text-green-800"
                      : isDark
                      ? "bg-red-900/30 text-red-400"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {sub.status || "Error"}
                </span>
              </td>
              <td
                className={`py-3 px-4 ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                {sub.timetaken ? `${sub.timetaken} ms` : "N/A"}
              </td>
              <td
                className={`py-3 px-4 ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                {sub.memorytaken ? `${sub.memorytaken} KB` : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
