import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import SubmissionCodeEditor from "../Tasks/submissionCodeEditor.jsx";
import codeOutput from "../Tasks/output.jsx"; // Assuming this is an external utility for running code
import MathjaxRenderer from "../MathjaxRenderer"; // Assuming this is an external utility for rendering MathJax
import { getContestBySlug } from '../Tasks/getContestBySlug'; // Utility to fetch contest by slug
import { getProblemBySlug } from '../Tasks/getProblemBySlug'; // Utility to fetch problem by slug

// --- Loading and Error Components ---
const LoadingSpinner = ({ isDark }) => (
  <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-gray-900" : "bg-slate-50"}`}>
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 border-4 ${isDark ? "border-orange-500" : "border-indigo-600"} border-t-transparent rounded-full animate-spin`}></div>
      <p className={`mt-4 text-lg ${isDark ? "text-gray-300" : "text-slate-700"}`}>
        Loading problem...
      </p>
    </div>
  </div>
);

const ProblemNotFound = ({ isDark }) => (
  <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-gray-900" : "bg-slate-50"}`}>
    <div className={`p-8 rounded-xl shadow-lg text-center ${isDark ? "bg-gray-800" : "bg-white border border-slate-200"}`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-red-500" : "text-red-600"}`}>
        Problem Not Found
      </h2>
      <p className={isDark ? "text-gray-300" : "text-slate-600"}>
        The requested problem could not be loaded or does not belong to this contest. Please check the URL.
      </p>
    </div>
  </div>
);

// --- Utility Function ---
function formatDuration(ms) {
  const totalSeconds = Math.max(0, ms);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// --- Main ContestProblem Component ---
export default function ContestProblem() {
  // Get contestSlug and problemSlug from the URL parameters
  const { contestSlug, problemSlug } = useParams();
  const location = useLocation();

  // Status priority map for updating problem status (Unattempted -> Attempted -> Accepted)
  const STATUS_RANK = { Unattempted: 0, Attempted: 1, Accepted: 2 };

  // Internal state to store problem and contest IDs, derived from the slugs
  const [problemId, setProblemId] = useState(null);
  const [contestId, setContestId] = useState(null);

  // Local storage key for problem status, dependent on problemId
  const STORAGE_KEY = problemId ? `status-${problemId}` : null;

  // Full problem details fetched using getProblemBySlug
  const [problem, setProblem] = useState(null);

  // State for code editor and submission
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [activeTab, setActiveTab] = useState("problem");
  const [isLoading, setIsLoading] = useState(true); // Manages overall loading state

  // State for submissions tab
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // State for custom input/output
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Problem status (Unattempted, Attempted, Accepted)
  const [status, setStatus] = useState("Unattempted");
  // Ref to store initial verdict from navigation state (e.g., after a submission)
  const initialVerdict = useRef(location.state?.verdict);

  // Theme setting
  const theme = "dark"; // This could be dynamic based on user preference
  const isDark = theme === "dark";

  // --- Effect 1: Fetch Contest and Problem Details using Slugs ---
  // This effect orchestrates fetching both contest and problem data,
  // and then validates their relationship.
  useEffect(() => {
    const fetchContestAndProblemData = async () => {
      setIsLoading(true); // Start overall loading
      setProblem(null); // Reset problem data
      setProblemId(null);
      setContestId(null);

      try {
        // 1. Fetch the contest data by its slug
        const contestData = await getContestBySlug(contestSlug);

        if (!contestData || !contestData._id) {
          throw new Error("Contest not found.");
        }
        setContestId(contestData._id); // Set the internal contest ID
        console.log("Contest data loaded:", contestData);
        // 2. Fetch the problem data by its slug
        const problemData = await getProblemBySlug(problemSlug);
        // console.log("Problem data loaded:", problemData);
        if (!problemData || !problemData._id) {
          throw new Error("Problem not found.");
        }
        console.log("Problem data loaded:", problemData);
        console.log("Contest data loaded:", contestData);
        // 3. Validate if the fetched problem belongs to the fetched contest
        // contestData.Problems contains an array of Problem ObjectIds
        const problemBelongsToContest = contestData.Problems.some(
          (pId) => pId._id === problemData._id
        );

        if (!problemBelongsToContest) {
          throw new Error("Problem does not belong to this contest.");
        }

        // If all checks pass, set the problem ID and the full problem object
        setProblemId(problemData._id);
        setProblem(problemData);

      } catch (err) {
        console.error("Error loading contest or problem:", err);
        setProblem(null); // Set problem to null to trigger ProblemNotFound component
      } finally {
        setIsLoading(false); // Stop overall loading
      }
    };

    fetchContestAndProblemData();
  }, [contestSlug, problemSlug]); // Re-run whenever contestSlug or problemSlug changes

  // --- Effect 2: Initialize Problem Status and Handle Initial Verdict ---
  // This effect runs only after problemId has been successfully set.
  useEffect(() => {
    if (!problemId) return; // Wait until problemId is available

    // Load status from localStorage using the problemId
    const savedStatus = localStorage.getItem(STORAGE_KEY) || "Unattempted";
    setStatus(savedStatus);

    // If there's an initial verdict from navigation (e.g., after a submission redirect)
    if (initialVerdict.current) {
      const prevRank = STATUS_RANK[savedStatus];
      const newRank = STATUS_RANK[initialVerdict.current];

      // Only update status if the new verdict is "better" (higher rank)
      if (newRank > prevRank) {
        localStorage.setItem(STORAGE_KEY, initialVerdict.current);
        setStatus(initialVerdict.current);
      }
      initialVerdict.current = null; // Clear the ref after processing
    }
  }, [problemId, STATUS_RANK, STORAGE_KEY]); // Dependencies include problemId and STATUS_RANK

  // --- Callback: Update Problem Status (only upgrades) ---
  const updateStatus = useCallback((newStatus) => {
    if (!problemId || !STORAGE_KEY) return; // Ensure IDs and storage key are ready

    const prev = localStorage.getItem(STORAGE_KEY) || "Unattempted";
    if (STATUS_RANK[newStatus] > STATUS_RANK[prev]) {
      localStorage.setItem(STORAGE_KEY, newStatus);
      setStatus(newStatus);
    }
  }, [problemId, STATUS_RANK, STORAGE_KEY]); // Dependencies for useCallback

  // --- Callback: Fetch Submissions for the Problem ---
  const fetchSubmissions = useCallback(async () => {
    // Ensure both contestId and problemId are available before fetching submissions
    if (!contestId || !problemId) {
      console.warn("Cannot fetch submissions: contestId or problemId not available.");
      return;
    }

    setIsSubmissionsLoading(true);
    try {
      // Use internal contestId and problemId for fetching submissions
      const res = await fetch(
        `http://localhost:3000/contests/${contestId}/submissions/${problemId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      
      // REMOVED LOGIC: The status update logic is no longer here.
      // We only set the submissions data.
      setSubmissions(data);

    } catch (err) {
      console.error("Failed to load submissions:", err);
      setSubmissions([]); // Clear submissions on error
    } finally {
      setIsSubmissionsLoading(false);
    }
    // The dependency on `updateStatus` is now gone, making this callback much more stable.
  }, [contestId, problemId]); // Dependencies are now simpler and more stable
  // --- Effect 3: Fetch Submissions when IDs are available ---
  // --- Effect 3: Fetch Submissions when IDs are available ---
  useEffect(() => {
    if (contestId && problemId) {
      fetchSubmissions();
    }
  }, [contestId, problemId, fetchSubmissions]); // Keeping fetchSubmissions here is also fine

  // --- Effect 4: Update problem status whenever submissions change ---
  useEffect(() => {
    // Don't run this logic if the submissions themselves haven't been loaded yet.
    if (isSubmissionsLoading) return;

    // This logic is now decoupled from the fetching process.
    if (!submissions.length) {
      updateStatus("Unattempted");
    } else if (submissions.some(s => s.verdict === "Accepted")) {
      updateStatus("Accepted");
    } else {
      updateStatus("Attempted");
    }
    // This effect runs only when `submissions` changes, breaking the loop.
  }, [submissions, isSubmissionsLoading, updateStatus]);
  // --- Callback: Handle Code Submission ---
  const handleCodeSubmit = useCallback(async (codeToSubmit) => {
    // Ensure contestId, problemId, and problem object are available
    if (!contestId || !problemId || !problem) {
      setVerdict("Error: Problem or Contest ID not available for submission.");
      return;
    }

    let isCorrect = true;
    let finalVerdict = "Accepted";
    let maxTime = 0, maxMem = 0;

    // Simulate running code against test cases (using the external codeOutput utility)
    for (let i = 0; i < problem.testCases.length; i++) {
      setVerdict(`Running on test case ${i + 1}`);
      const tc = problem.testCases[i];
      // Assuming codeOutput simulates execution and returns status/output
      const out = await codeOutput(codeToSubmit, tc.input, tc.output.stdout);
      maxTime = Math.max(maxTime, Number(out.time || 0));
      maxMem  = Math.max(maxMem, Number(out.memory || 0));

      if (out.status_id !== 3) { // Assuming status_id 3 means Accepted
        isCorrect = false;
        finalVerdict = out.stderr
          ? `Runtime Error on Test ${i+1}: ${out.stderr}`
          : out.compile_output
            ? `Compilation Error on Test ${i+1}: ${out.compile_output}`
            : `${out.status?.description || "Unknown Error"} on Test ${i+1}`;
        break;
      }
    }

    // Update problem status based on the final verdict
    updateStatus(isCorrect ? "Accepted" : "Attempted");
    setVerdict(finalVerdict);

    // Post the submission to the backend using internal IDs
    try {
      await fetch(
        `http://localhost:3000/contests/${contestId}/problems/${problemId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            code: codeToSubmit,
            language: 52, // Example language ID (e.g., C++)
            verdict: finalVerdict,
            timeTaken: maxTime,
            memoryTaken: maxMem,
          })
        }
      );
      fetchSubmissions(); // Refresh submissions list after successful submission
    } catch (error) {
      console.error("Failed to submit code:", error);
      setVerdict("Submission failed due to network error.");
    }
  }, [contestId, problemId, problem, updateStatus, fetchSubmissions]); // Dependencies for useCallback

  // --- Callback: Handle Running Custom Input ---
  const handleRunCustomInput = async () => {
    if (!problem) {
      setCustomOutput({ userOutput: "Error: Problem data not loaded." });
      return;
    }

    setIsRunning(true);
    try {
      // Run user's code with custom input
      const userOut = await codeOutput(code, customInput);
      // Run problem's solution code with custom input to get expected output
      const expectedOut = await codeOutput(problem.codeSolution, customInput);

      setCustomOutput({
        userOutput: userOut.stdout || userOut.stderr || userOut.compile_output || "No output",
        expectedOutput: expectedOut.stdout || expectedOut.stderr || expectedOut.compile_output || "No expected output"
      });
    } catch (error) {
      console.error("Error running custom input:", error);
      setCustomOutput({ userOutput: "Error running code.", expectedOutput: "Error running solution." });
    } finally {
      setIsRunning(false);
    }
  };

  // --- Conditional Rendering for Loading and Not Found States ---
  if (isLoading) {
    return <LoadingSpinner isDark={isDark} />;
  }
  // If problem is null after loading, it means the problem wasn't found or couldn't be linked to contest
  if (!problem) {
    return <ProblemNotFound isDark={isDark} />;
  }

  // --- Main Render for Problem Page ---
  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Header */}
      <div className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"} border-b px-6 py-4 shadow-sm`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-orange-500" : "text-indigo-600"}`}>
              {problem.title}
            </h1>
            <div className="flex items-center mt-2 text-sm">
              <span className={`text-[11px] px-2 py-[2px] rounded-full font-medium border ${
                status === "Accepted"
                  ? isDark ? "bg-green-900/30 text-green-400 border-green-600" : "bg-green-100 text-green-700 border-green-300"
                  : status === "Attempted"
                  ? isDark ? "bg-yellow-900/20 text-yellow-400 border-yellow-600" : "bg-yellow-100 text-yellow-700 border-yellow-300"
                  : isDark ? "bg-gray-800 text-gray-400 border-gray-600" : "bg-slate-100 text-slate-500 border-slate-300"
              }`}>
                {status}
              </span>
            </div>
          </div>
          <div className={`text-sm px-3 py-1 rounded-full ${isDark ? "bg-gray-700" : "bg-slate-200"}`}>
            Difficulty:{" "}
            <span className={`font-medium ${
              problem.difficulty === "Easy" ? "text-green-500"
              : problem.difficulty === "Medium" ? "text-yellow-500"
              : "text-red-500"
            }`}>
              {problem.difficulty || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto h-[calc(100vh-120px)]">
        {/* Left Panel - Problem Content, Submissions, and Run Code */}
        <div className="lg:w-1/2 flex flex-col gap-4 h-full">
          <div className={`flex-1 rounded-lg border overflow-hidden flex flex-col ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
          }`}>
            {/* Tab Navigation */}
            <div className={`flex border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
              <button
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "problem"
                    ? isDark ? "text-orange-500 border-b-2 border-orange-500" : "text-indigo-600 border-b-2 border-indigo-600"
                    : isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("problem")}
              >
                Description
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "submissions"
                    ? isDark ? "text-orange-500 border-b-2 border-orange-500" : "text-indigo-600 border-b-2 border-indigo-600"
                    : isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                Submissions
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "run-code"
                    ? isDark ? "text-orange-500 border-b-2 border-orange-500" : "text-indigo-600 border-b-2 border-indigo-600"
                    : isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("run-code")}
              >
                Run Code
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "problem" && (
                <div className="space-y-6">
                  {/* Problem Statement */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold">Problem Statement</h2>
                    <div className={`${isDark ? "text-gray-300" : "text-slate-700"} prose prose-invert max-w-none`}>
                      <MathjaxRenderer html={problem.statement} />
                    </div>
                  </div>

                  {/* Input/Output Sections */}
                  <div className=" md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">Input Format</h2>
                      <div className={`p-3 rounded-md font-mono text-sm ${
                        isDark ? "bg-gray-700 text-gray-200" : "bg-slate-100 text-slate-800"
                      }`}>
                        <MathjaxRenderer html={problem.inputFormat} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">Output Format</h2>
                      <div className={`p-3 rounded-md font-mono text-sm ${
                        isDark ? "bg-gray-700 text-gray-200" : "bg-slate-100 text-slate-800"
                      }`}>
                        <MathjaxRenderer html={problem.outputFormat} />
                      </div>
                    </div>
                  </div>

                  {/* Sample Test Cases */}
                  {problem.testCases.filter(tc => tc.visible).length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">Sample Test Cases</h2>
                      {problem.testCases.filter(tc => tc.visible).map((testCase, index) => (
                        <div key={index} className={`rounded-lg overflow-hidden ${
                          isDark ? "bg-gray-700/50" : "bg-slate-100"
                        }`}>
                          <div className={`px-4 py-2 ${isDark ? "bg-gray-700" : "bg-slate-200"}`}>
                            <h3 className="font-medium">Sample {index + 1}</h3>
                            {testCase.explanation && (
                              <p className="text-xs mt-1 text-gray-400">
                                {testCase.explanation}
                              </p>
                            )}
                          </div>
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Input</h4>
                              <pre className={`p-2 rounded font-mono text-sm whitespace-pre-wrap ${
                                isDark ? "bg-gray-800" : "bg-white border border-slate-200"
                              }`}>
                                {testCase.input || "No input provided"}
                              </pre>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Output</h4>
                              <pre className={`p-2 rounded font-mono text-sm whitespace-pre-wrap ${
                                isDark ? "bg-gray-800" : "bg-white border border-slate-200"
                              }`}>
                                {testCase.output?.stdout || "No expected output"}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {problem.notes && (
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">Notes</h2>
                      <div className={`p-3 rounded-md ${
                        isDark ? "bg-gray-700 text-gray-200" : "bg-slate-100 text-slate-800"
                      }`}>
                        <MathjaxRenderer html={problem.notes} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "submissions" && (
                <ContestSubmissionsTab
                  submissions={submissions}
                  isLoading={isSubmissionsLoading}
                  isDark={isDark}
                  onSelectSubmission={setSelectedSubmission}
                  selectedSubmission={selectedSubmission}
                />
              )}

              {activeTab === "run-code" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Custom Input</label>
                      <button
                        onClick={handleRunCustomInput}
                        disabled={isRunning}
                        className={`px-3 py-1 text-xs rounded font-medium flex items-center ${
                          isDark
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isRunning ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Running...
                          </>
                        ) : "Run"}
                      </button>
                    </div>
                    <div className={`rounded-lg overflow-hidden border ${
                      isDark ? "border-gray-600" : "border-slate-300"
                    }`}>
                      <textarea
                        rows={5}
                        className={`w-full p-3 font-mono text-sm resize-none focus:outline-none ${
                          isDark ? "bg-gray-700 text-gray-100" : "bg-white text-slate-800"
                        }`}
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter your custom test case input here..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Your Output</label>
                      <div className={`rounded-lg overflow-hidden border ${
                        isDark ? "border-gray-600 bg-gray-700" : "border-slate-300 bg-slate-100"
                      }`}>
                        <pre className={`p-3 font-mono text-sm min-h-[100px] max-h-[200px] overflow-auto ${
                        isDark ? "text-gray-200" : "text-slate-800"
                        }`}>
                        {customOutput?.userOutput
                            ? customOutput.userOutput
                            : "Run code to see your output"}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Expected Output</label>
                      <div className={`rounded-lg overflow-hidden border ${
                        isDark ? "border-gray-600 bg-gray-700" : "border-slate-300 bg-slate-100"
                      }`}>
                        <pre className={`p-3 font-mono text-sm min-h-[100px] max-h-[200px] overflow-auto ${
                        isDark ? "text-gray-200" : "text-slate-800"
                        }`}>
                        {customOutput?.expectedOutput
                            ? customOutput.expectedOutput
                            : "Run code to see Expected Output"}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Editor & Submit */}
        <div className="lg:w-1/2 flex flex-col gap-4 h-full">
          {/* Code Editor */}
          <div className={`flex-1 rounded-lg border overflow-hidden flex flex-col ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
          }`}>
            <div className={`px-4 py-2 border-b ${
              isDark ? "border-gray-700 bg-gray-800" : "border-slate-200 bg-slate-50"
            }`}>
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Code Editor</h2>
                <div className="flex gap-2">
                  <button className={`px-3 py-1 text-xs rounded font-medium ${
                    isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-slate-200 hover:bg-slate-300"
                  }`}>
                    C++
                  </button>
                  <button className={`px-3 py-1 text-xs rounded font-medium ${
                    isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-slate-200 hover:bg-slate-300"
                  }`}>
                    Python
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <SubmissionCodeEditor
                language="cpp"
                onCodeChange={setCode}
                theme={isDark ? "vs-dark" : "light"}
              />
            </div>
          </div>

          {/* Submit Panel */}
          <div className={`rounded-lg border overflow-hidden ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
          }`}>
            <div className={`px-4 py-3 border-b flex justify-between items-center ${
              isDark ? "border-gray-700 bg-gray-800" : "border-slate-200 bg-slate-50"
            }`}>
              <h2 className="font-medium">Submit Solution</h2>
              <button
                onClick={() => handleCodeSubmit(code)}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  isDark
                    ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600"
                    : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700"
                }`}
              >
                Submit
              </button>
            </div>
            <div className={`p-4 font-mono text-sm min-h-24 ${
              isDark ? "bg-gray-900/30" : "bg-slate-50"
            }`}>
              {verdict ? (
                <div className={`p-3 rounded ${
                  verdict === "Accepted"
                    ? "bg-green-100 text-green-800"
                    : verdict.includes("Error") || verdict.includes("Wrong") || verdict.includes("Time Limit Exceeded") || verdict.includes("Memory Limit Exceeded")
                    ? "bg-red-100 text-red-800"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-slate-200"
                }`}>
                  {verdict}
                </div>
              ) : (
                <div className={`flex items-center justify-center h-full ${
                  isDark ? "text-gray-500" : "text-slate-400"
                }`}>
                  Submit your code to see the verdict...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Submissions Tab Component (remains unchanged as it uses internal IDs) ---
function ContestSubmissionsTab({ submissions, isLoading, isDark, onSelectSubmission, selectedSubmission }) {
  if (isLoading) {
    return <div className="py-6 flex items-center justify-center">Loading submissions...</div>;
  }

  if (selectedSubmission) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Submission Details</h3>
          <button
            onClick={() => onSelectSubmission(null)}
            className={`text-xs px-3 py-1 rounded ${
              isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-slate-200 hover:bg-slate-300"
            }`}
          >
            Back to list
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-slate-100"}`}>
            <div className="text-xs text-gray-400">Status</div>
            <div className={`font-medium ${
              selectedSubmission.verdict === "Accepted" ? "text-green-500" : "text-red-500"
            }`}>
              {selectedSubmission.verdict}
            </div>
          </div>

          <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-slate-100"}`}>
            <div className="text-xs text-gray-400">Runtime</div>
            <div className="font-medium">
              {selectedSubmission.timeTaken ? `${selectedSubmission.timeTaken} ms` : "N/A"}
            </div>
          </div>

          <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-slate-100"}`}>
            <div className="text-xs text-gray-400">Memory</div>
            <div className="font-medium">
              {selectedSubmission.memoryTaken ? `${selectedSubmission.memoryTaken} KB` : "N/A"}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-sm font-medium mb-2">Submitted Code</div>
          <pre className={`p-4 rounded-lg overflow-x-auto text-sm ${
            isDark ? "bg-gray-900" : "bg-slate-100"
          }`}>
            {selectedSubmission.code}
          </pre>
        </div>

        <div className="text-xs text-gray-400">
          Submitted at: {new Date(selectedSubmission.submissionTime).toLocaleString()}
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className={`py-6 text-center ${isDark ? "bg-gray-800/30" : "bg-slate-50"}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
          isDark ? "bg-gray-700" : "bg-slate-200"
        }`}>
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
        <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-slate-500"}`}>
          Submit your solution to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className={`border-b ${isDark ? "border-gray-700" : "border-slate-200"}`}>
            <th className="text-left py-2 px-4">Time</th>
            <th className="text-left py-2 px-4">Status</th>
            <th className="text-left py-2 px-4">Runtime</th>
            <th className="text-left py-2 px-4">Memory</th>
            <th className="text-left py-2 px-4">Action</th>
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
                {sub.submissionTime
                  ? formatDuration(sub.timeFromStart)
                  : "N/A"}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  sub.verdict === "Accepted"
                    ? isDark
                      ? "bg-green-900/30 text-green-400"
                      : "bg-green-100 text-green-800"
                    : isDark
                    ? "bg-red-900/30 text-red-400"
                    : "bg-red-100 text-red-800"
                }`}>
                  {sub.verdict || "Error"}
                </span>
              </td>
              <td className={`py-3 px-4 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                {sub.timeTaken ? `${sub.timeTaken} ms` : "N/A"}
              </td>
              <td className={`py-3 px-4 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                {sub.memoryTaken ? `${sub.memoryTaken} KB` : "N/A"}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onSelectSubmission(sub)}
                  className={`text-xs px-3 py-1 rounded ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  View Code
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}