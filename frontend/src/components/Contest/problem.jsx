import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import SubmissionCodeEditor from "../Tasks/submissionCodeEditor.jsx";
import codeOutput from "../Tasks/output.jsx";
import MathjaxRenderer from "../MathjaxRenderer";

// Loading and Error Components
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
        The requested problem could not be loaded.
      </p>
    </div>
  </div>
);

function formatDuration(ms) {
  const totalSeconds = Math.max(0, ms);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function ContestProblem() {
  const { problemId, contestId } = useParams();
  const location = useLocation();
  const startTime = location.state?.startTime;

  // status priority map
  const STATUS_RANK = { Unattempted: 0, Attempted: 1, Accepted: 2 };
  const STORAGE_KEY = `status-${problemId}`;

  // initialize status
  const [status, setStatus] = useState(() =>
    location.state?.verdict ||
    localStorage.getItem(STORAGE_KEY) ||
    "Unattempted"
  );

  // persist incoming verdict on first mount
  useEffect(() => {
    if (location.state?.verdict) {
      localStorage.setItem(STORAGE_KEY, location.state.verdict);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // central updateStatus: only upgrade
  const updateStatus = useCallback((newStatus) => {
    const prev = localStorage.getItem(STORAGE_KEY) || "Unattempted";
    if (STATUS_RANK[newStatus] > STATUS_RANK[prev]) {
      localStorage.setItem(STORAGE_KEY, newStatus);
      setStatus(newStatus);
    }
  }, [STORAGE_KEY]);

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [activeTab, setActiveTab] = useState("problem");
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const theme = "dark";
  const isDark = theme === "dark";

  // fetch problem + submissions on mount or problemId change
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/problems/${problemId}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setProblem(data))
      .catch(err => {
        console.error("Failed to load problem:", err);
        setProblem(null);
      })
      .finally(() => setIsLoading(false));

    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  const fetchSubmissions = useCallback(async () => {
    setIsSubmissionsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/contests/${contestId}/submissions/${problemId}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (!data.length) {
        updateStatus("Unattempted");
      } else if (data.some(s => s.verdict === "Accepted")) {
        updateStatus("Accepted");
      } else {
        updateStatus("Attempted");
      }

      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setIsSubmissionsLoading(false);
    }
  }, [contestId, problemId, updateStatus]);

  const handleCodeSubmit = useCallback(async (code) => {
    let isCorrect = true;
    let finalVerdict = "Accepted";
    let maxTime = 0, maxMem = 0;

    for (let i = 0; i < problem.testCases.length; i++) {
      setVerdict(`Running on test case ${i + 1}`);
      const tc = problem.testCases[i];
      const out = await codeOutput(code, tc.input, tc.output.stdout);
      maxTime = Math.max(maxTime, Number(out.time));
      maxMem  = Math.max(maxMem, Number(out.memory));

      if (out.status_id !== 3) {
        isCorrect = false;
        finalVerdict = out.stderr
          ? `Runtime Error on Test ${i+1}: ${out.stderr}`
          : out.compile_output
            ? `Compilation Error on Test ${i+1}: ${out.compile_output}`
            : `${out.status.description} on Test ${i+1}`;
        break;
      }
    }

    updateStatus(isCorrect ? "Accepted" : "Attempted");
    setVerdict(finalVerdict);

    // post submission
    await fetch(
      `http://localhost:3000/contests/${contestId}/problems/${problemId}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code,
          language: 52,
          verdict: finalVerdict,
          timeTaken: maxTime,
          memoryTaken: maxMem,
          startTime
        })
      }
    );

    fetchSubmissions();
  }, [contestId, problemId, problem, startTime, updateStatus, fetchSubmissions]);

  const handleRunCustomInput = async () => {
    setIsRunning(true);
    const userOut     = await codeOutput(code, customInput);
    const expectedOut = await codeOutput(problem.codeSolution, customInput);
    setCustomOutput({
      userOutput: userOut.stdout || "No output",
      expectedOutput: expectedOut.stdout || "No expected output"
    });
    setIsRunning(false);
  };

  if (isLoading) return <LoadingSpinner isDark={isDark} />;
  if (!problem)   return <ProblemNotFound isDark={isDark} />;
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
              <span className={`mr-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Problem ID: {problemId}
              </span>
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
                            ? JSON.stringify(customOutput.userOutput, null, 2)
                            : "Run code to see your output"}
                        </pre>

                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Your Output</label>
                      <div className={`rounded-lg overflow-hidden border ${
                        isDark ? "border-gray-600 bg-gray-700" : "border-slate-300 bg-slate-100"
                      }`}>
                        <pre className={`p-3 font-mono text-sm min-h-[100px] max-h-[200px] overflow-auto ${
                        isDark ? "text-gray-200" : "text-slate-800"
                        }`}>
                        {customOutput?.expectedOutput
                            ? JSON.stringify(customOutput.expectedOutput, null, 2)
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
                    : verdict.includes("Wrong")
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

// Submissions Tab Component
function ContestSubmissionsTab({ submissions, isLoading, isDark, onSelectSubmission, selectedSubmission }) {
  if (isLoading) {
    return <div className="py-6 flex items-center justify-center">Loading...</div>;
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
          
          {/* <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-slate-100"}`}>
            <div className="text-xs text-gray-400">Runtime</div>
            <div className="font-medium">
              {selectedSubmission.timetaken} ms
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-slate-100"}`}>
            <div className="text-xs text-gray-400">Memory</div>
            <div className="font-medium">
              {selectedSubmission.memorytaken} KB
            </div>
          </div> */}
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
                {sub.timetaken ? `${sub.timetaken} ms` : "N/A"}
              </td>
              <td className={`py-3 px-4 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                {sub.memorytaken ? `${sub.memorytaken} KB` : "N/A"}
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