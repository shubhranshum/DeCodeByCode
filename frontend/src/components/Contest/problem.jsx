import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import SubmissionCodeEditor from "../Tasks/submissionCodeEditor.jsx";
import codeOutput from "../Tasks/output.jsx"; // Assuming this is an external utility for running code
import MathjaxRenderer from "../MathjaxRenderer"; // Assuming this is an external utility for rendering MathJax
import { getContestBySlug } from '../Tasks/getContestBySlug'; // Utility to fetch contest by slug
import { getProblemBySlug } from '../Tasks/getProblemBySlug'; // Utility to fetch problem by slug

// Define a comprehensive theme object for light and dark modes
const themes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    secondaryText: 'text-gray-500',
    primaryAccent: 'text-indigo-600',
    primaryAccentBg: 'bg-indigo-50',
    successText: 'text-green-600',
    successBg: 'bg-green-100',
    dangerText: 'text-red-600',
    dangerBg: 'bg-red-100',
    codeBg: 'bg-gray-100',
    codeBorder: 'border-gray-300',
    tabActiveBorder: 'border-indigo-600',
    tabActiveText: 'text-indigo-600',
    tabInactiveText: 'text-gray-500 hover:text-gray-700',
    buttonPrimaryBg: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
    buttonPrimaryText: 'text-white',
    buttonSecondaryBg: 'bg-gray-200 hover:bg-gray-300',
    buttonSecondaryText: 'text-gray-800',
    tableHeaderBg: 'bg-gray-100',
    tableRowHover: 'hover:bg-gray-50',
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    secondaryText: 'text-gray-400',
    primaryAccent: 'text-orange-500',
    primaryAccentBg: 'bg-orange-900/30',
    successText: 'text-green-400',
    successBg: 'bg-green-900/30',
    dangerText: 'text-red-400',
    dangerBg: 'bg-red-900/30',
    codeBg: 'bg-gray-700',
    codeBorder: 'border-gray-600',
    tabActiveBorder: 'border-orange-500',
    tabActiveText: 'text-orange-500',
    tabInactiveText: 'text-gray-400 hover:text-gray-300',
    buttonPrimaryBg: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600',
    buttonPrimaryText: 'text-white',
    buttonSecondaryBg: 'bg-gray-700 hover:bg-gray-600',
    buttonSecondaryText: 'text-gray-100',
    tableHeaderBg: 'bg-gray-700',
    tableRowHover: 'hover:bg-gray-700/30',
  }
};

// --- Loading and Error Components ---
const LoadingSpinner = ({ isDark }) => {
  const themeStyles = themes[isDark ? "dark" : "light"];
  return (
    <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 border-4 ${isDark ? "border-orange-500" : "border-indigo-600"} border-t-transparent rounded-full animate-spin`}></div>
        <p className={`mt-4 text-lg font-medium ${themeStyles.text}`}>
          Loading problem...
        </p>
        <p className={`mt-2 text-sm ${themeStyles.secondaryText}`}>
          Please wait a moment.
        </p>
      </div>
    </div>
  );
};

const ProblemNotFound = ({ isDark }) => {
  const themeStyles = themes[isDark ? "dark" : "light"];
  return (
    <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
      <div className={`p-8 rounded-xl shadow-lg text-center ${themeStyles.card} border ${themeStyles.border}`}>
        <h2 className={`text-2xl font-bold mb-4 ${themeStyles.dangerText}`}>
          Problem Not Found
        </h2>
        <p className={`${themeStyles.secondaryText} mb-6`}>
          The requested problem could not be loaded or does not belong to this contest.
          Please check the URL and try again.
        </p>
        <Link
          to="/contests"
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${themeStyles.buttonPrimaryBg} ${themeStyles.buttonPrimaryText} hover:scale-105`}
        >
          Back to Contests
        </Link>
      </div>
    </div>
  );
};

// --- Utility Function ---
function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000)); // Convert ms to seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${String(hours).padStart(2, '0')}h`);
  parts.push(`${String(minutes).padStart(2, '0')}m`);
  parts.push(`${String(seconds).padStart(2, '0')}s`);

  return parts.join(' ');
}

// --- Main ContestProblem Component ---
export default function ContestProblem() {
  const { contestSlug, problemSlug } = useParams();
  const location = useLocation();

  const STATUS_RANK = { Unattempted: 0, Attempted: 1, Accepted: 2 };

  const [problemId, setProblemId] = useState(null);
  const [contestId, setContestId] = useState(null);

  const STORAGE_KEY = problemId ? `status-${problemId}` : null;

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

  const [status, setStatus] = useState("Unattempted");
  const initialVerdict = useRef(location.state?.verdict);

  const theme = localStorage.getItem('theme') || "light"; // Get theme from local storage
  const isDark = theme === "dark";
  const themeStyles = themes[theme];

  // --- Effect 1: Fetch Contest and Problem Details using Slugs ---
  useEffect(() => {
    const fetchContestAndProblemData = async () => {
      setIsLoading(true);
      setProblem(null);
      setProblemId(null);
      setContestId(null);

      try {
        const contestData = await getContestBySlug(contestSlug);
        if (!contestData || !contestData._id) {
          throw new Error("Contest not found.");
        }
        setContestId(contestData._id);

        const problemData = await getProblemBySlug(problemSlug);
        if (!problemData || !problemData._id) {
          throw new Error("Problem not found.");
        }

        const problemBelongsToContest = contestData.Problems.some(
          (pId) => pId._id === problemData._id
        );

        if (!problemBelongsToContest) {
          throw new Error("Problem does not belong to this contest.");
        }

        setProblemId(problemData._id);
        setProblem(problemData);

      } catch (err) {
        console.error("Error loading contest or problem:", err);
        setProblem(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestAndProblemData();
  }, [contestSlug, problemSlug]);

  // --- Effect 2: Initialize Problem Status and Handle Initial Verdict ---
  useEffect(() => {
    if (!problemId) return;

    const savedStatus = localStorage.getItem(STORAGE_KEY) || "Unattempted";
    setStatus(savedStatus);

    if (initialVerdict.current) {
      const prevRank = STATUS_RANK[savedStatus];
      const newRank = STATUS_RANK[initialVerdict.current];

      if (newRank > prevRank) {
        localStorage.setItem(STORAGE_KEY, initialVerdict.current);
        setStatus(initialVerdict.current);
      }
      initialVerdict.current = null;
    }
  }, [problemId, STATUS_RANK, STORAGE_KEY]);

  // --- Callback: Update Problem Status (only upgrades) ---
  const updateStatus = useCallback((newStatus) => {
    if (!problemId || !STORAGE_KEY) return;

    const prev = localStorage.getItem(STORAGE_KEY) || "Unattempted";
    if (STATUS_RANK[newStatus] > STATUS_RANK[prev]) {
      localStorage.setItem(STORAGE_KEY, newStatus);
      setStatus(newStatus);
    }
  }, [problemId, STATUS_RANK, STORAGE_KEY]);

  // --- Callback: Fetch Submissions for the Problem ---
  const fetchSubmissions = useCallback(async () => {
    if (!contestId || !problemId) {
      console.warn("Cannot fetch submissions: contestId or problemId not available.");
      return;
    }

    setIsSubmissionsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/contests/${contestId}/submissions/${problemId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
      setSubmissions([]);
    } finally {
      setIsSubmissionsLoading(false);
    }
  }, [contestId, problemId]);

  // --- Effect 3: Fetch Submissions when IDs are available ---
  useEffect(() => {
    if (contestId && problemId) {
      fetchSubmissions();
    }
  }, [contestId, problemId, fetchSubmissions]);

  // --- Effect 4: Update problem status whenever submissions change ---
  useEffect(() => {
    if (isSubmissionsLoading) return;

    if (!submissions.length) {
      updateStatus("Unattempted");
    } else if (submissions.some(s => s.verdict === "Accepted")) {
      updateStatus("Accepted");
    } else {
      updateStatus("Attempted");
    }
  }, [submissions, isSubmissionsLoading, updateStatus]);

  // --- Callback: Handle Code Submission ---
  const handleCodeSubmit = useCallback(async (codeToSubmit) => {
    if (!contestId || !problemId || !problem) {
      setVerdict("Error: Problem or Contest ID not available for submission.");
      return;
    }

    let isCorrect = true;
    let finalVerdict = "Accepted";
    let maxTime = 0, maxMem = 0;

    for (let i = 0; i < problem.testCases.length; i++) {
      setVerdict(`Running on test case ${i + 1}`);
      const tc = problem.testCases[i];
      const out = await codeOutput(codeToSubmit, tc.input, tc.output.stdout);
      maxTime = Math.max(maxTime, Number(out.time || 0));
      maxMem = Math.max(maxMem, Number(out.memory || 0));

      // Assuming status_id 3 means Accepted, and other status_ids or errors mean failure
      if (out.status_id !== 3 || out.stderr || out.compile_output) {
        isCorrect = false;
        finalVerdict = out.stderr
          ? `Runtime Error on Test ${i + 1}: ${out.stderr}`
          : out.compile_output
            ? `Compilation Error on Test ${i + 1}: ${out.compile_output}`
            : `${out.status?.description || "Wrong Answer"} on Test ${i + 1}`;
        break;
      }
    }

    updateStatus(isCorrect ? "Accepted" : "Attempted");
    setVerdict(finalVerdict);

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
      fetchSubmissions();
    } catch (error) {
      console.error("Failed to submit code:", error);
      setVerdict("Submission failed due to network error.");
    }
  }, [contestId, problemId, problem, updateStatus, fetchSubmissions]);

  // --- Callback: Handle Running Custom Input ---
  const handleRunCustomInput = async () => {
    if (!problem) {
      setCustomOutput({ userOutput: "Error: Problem data not loaded." });
      return;
    }

    setIsRunning(true);
    setCustomOutput(null); // Clear previous output
    try {
      const userOut = await codeOutput(code, customInput);
      const expectedOut = await codeOutput(problem.codeSolution, customInput); // Assuming problem.codeSolution exists

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
  if (!problem) {
    return <ProblemNotFound isDark={isDark} />;
  }

  // --- Main Render for Problem Page ---
  return (
    <div className={`min-h-screen ${themeStyles.background} font-sans`}>
      {/* Header */}
      <div className={`${themeStyles.card} border-b ${themeStyles.border} px-6 py-4 shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-3xl font-extrabold ${themeStyles.primaryAccent}`}>
              {problem.title}
            </h1>
            <div className="flex items-center mt-2 text-sm">
              <span className={`px-3 py-1 rounded-full font-semibold text-xs border ${
                status === "Accepted"
                  ? themeStyles.successBg + " " + themeStyles.successText + " border-green-600"
                  : status === "Attempted"
                    ? themeStyles.dangerBg + " " + themeStyles.dangerText + " border-red-600"
                    : themeStyles.codeBg + " " + themeStyles.secondaryText + " border-gray-600"
              }`}>
                {status}
              </span>
            </div>
          </div>
          <div className={`text-sm px-4 py-2 rounded-full font-semibold ${themeStyles.codeBg} ${themeStyles.secondaryText} border ${themeStyles.codeBorder}`}>
            Difficulty:{" "}
            <span className={`font-bold ${
              problem.difficulty === "Easy" ? "text-green-500"
                : problem.difficulty === "Medium" ? "text-yellow-500"
                  : "text-red-500"
            }`}>
              {problem.difficulty || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row p-6 gap-6 max-w-8xl mx-auto h-[calc(100vh-100px)]">
        {/* Left Panel - Problem Content, Submissions, and Run Code */}
        <div className="lg:w-1/2 flex flex-col gap-6 h-full">
          <div className={`flex-1 rounded-xl border overflow-hidden flex flex-col shadow-lg ${themeStyles.card} ${themeStyles.border}`}>
            {/* Tab Navigation */}
            <div className={`flex border-b ${themeStyles.border}`}>
              <button
                className={`flex-1 px-4 py-3 text-base font-semibold transition-colors duration-200 ${
                  activeTab === "problem"
                    ? `${themeStyles.tabActiveText} border-b-2 ${themeStyles.tabActiveBorder}`
                    : `${themeStyles.tabInactiveText} hover:${themeStyles.hover}`
                }`}
                onClick={() => setActiveTab("problem")}
              >
                Description
              </button>
              <button
                className={`flex-1 px-4 py-3 text-base font-semibold transition-colors duration-200 ${
                  activeTab === "submissions"
                    ? `${themeStyles.tabActiveText} border-b-2 ${themeStyles.tabActiveBorder}`
                    : `${themeStyles.tabInactiveText} hover:${themeStyles.hover}`
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                Submissions
              </button>
              <button
                className={`flex-1 px-4 py-3 text-base font-semibold transition-colors duration-200 ${
                  activeTab === "run-code"
                    ? `${themeStyles.tabActiveText} border-b-2 ${themeStyles.tabActiveBorder}`
                    : `${themeStyles.tabInactiveText} hover:${themeStyles.hover}`
                }`}
                onClick={() => setActiveTab("run-code")}
              >
                Run Code
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === "problem" && (
                <div className="space-y-8">
                  {/* Problem Statement */}
                  <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${themeStyles.text}`}>Problem Statement</h2>
                    <div className={`${themeStyles.secondaryText} text-lg leading-relaxed prose prose-invert max-w-none`}>
                      <MathjaxRenderer html={problem.statement} />
                    </div>
                  </section>

                  {/* Input/Output Sections */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h2 className={`text-xl font-bold ${themeStyles.text}`}>Input Format</h2>
                      <div className={`p-4 rounded-lg font-mono text-base ${themeStyles.codeBg} ${themeStyles.text} border ${themeStyles.codeBorder}`}>
                        <MathjaxRenderer html={problem.inputFormat} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h2 className={`text-xl font-bold ${themeStyles.text}`}>Output Format</h2>
                      <div className={`p-4 rounded-lg font-mono text-base ${themeStyles.codeBg} ${themeStyles.text} border ${themeStyles.codeBorder}`}>
                        <MathjaxRenderer html={problem.outputFormat} />
                      </div>
                    </div>
                  </section>

                  {/* Sample Test Cases */}
                  {problem.testCases.filter(tc => tc.visible).length > 0 && (
                    <section className="space-y-6">
                      <h2 className={`text-2xl font-bold ${themeStyles.text}`}>Sample Test Cases</h2>
                      {problem.testCases.filter(tc => tc.visible).map((testCase, index) => (
                        <div key={index} className={`rounded-xl overflow-hidden shadow-sm ${themeStyles.card} border ${themeStyles.border}`}>
                          <div className={`px-5 py-3 ${themeStyles.codeBg} border-b ${themeStyles.border}`}>
                            <h3 className={`font-semibold text-lg ${themeStyles.text}`}>Sample {index + 1}</h3>
                            {testCase.explanation && (
                              <p className={`text-sm mt-1 ${themeStyles.secondaryText}`}>
                                {testCase.explanation}
                              </p>
                            )}
                          </div>
                          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <h4 className={`text-base font-medium mb-2 ${themeStyles.text}`}>Input</h4>
                              <pre className={`p-3 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto ${themeStyles.codeBg} ${themeStyles.text} border ${themeStyles.codeBorder}`}>
                                {testCase.input || "No input provided"}
                              </pre>
                            </div>
                            <div>
                              <h4 className={`text-base font-medium mb-2 ${themeStyles.text}`}>Output</h4>
                              <pre className={`p-3 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto ${themeStyles.codeBg} ${themeStyles.text} border ${themeStyles.codeBorder}`}>
                                {testCase.output?.stdout || "No expected output"}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Notes */}
                  {problem.notes && (
                    <section className="space-y-4">
                      <h2 className={`text-2xl font-bold ${themeStyles.text}`}>Notes</h2>
                      <div className={`p-4 rounded-lg ${themeStyles.codeBg} ${themeStyles.text} border ${themeStyles.codeBorder}`}>
                        <MathjaxRenderer html={problem.notes} />
                      </div>
                    </section>
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
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className={`text-lg font-medium ${themeStyles.text}`}>Custom Input</label>
                      <button
                        onClick={handleRunCustomInput}
                        disabled={isRunning}
                        className={`px-5 py-2 text-sm rounded-lg font-semibold flex items-center transition-all duration-200 ${
                          themeStyles.buttonPrimaryBg
                        } ${themeStyles.buttonPrimaryText} ${isRunning ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`}
                      >
                        {isRunning ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Running...
                          </>
                        ) : "Run Code"}
                      </button>
                    </div>
                    <div className={`rounded-lg overflow-hidden border ${themeStyles.codeBorder}`}>
                      <textarea
                        rows={8}
                        className={`w-full p-4 font-mono text-base resize-none focus:outline-none ${themeStyles.codeBg} ${themeStyles.text}`}
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter your custom test case input here..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`text-lg font-medium block mb-3 ${themeStyles.text}`}>Your Output</label>
                      <div className={`rounded-lg overflow-hidden border ${themeStyles.codeBorder} ${themeStyles.codeBg}`}>
                        <pre className={`p-4 font-mono text-base min-h-[150px] max-h-[300px] overflow-auto ${themeStyles.text}`}>
                          {customOutput?.userOutput
                            ? customOutput.userOutput
                            : "Run code to see your output"}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <label className={`text-lg font-medium block mb-3 ${themeStyles.text}`}>Expected Output</label>
                      <div className={`rounded-lg overflow-hidden border ${themeStyles.codeBorder} ${themeStyles.codeBg}`}>
                        <pre className={`p-4 font-mono text-base min-h-[150px] max-h-[300px] overflow-auto ${themeStyles.text}`}>
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
        <div className="lg:w-1/2 flex flex-col gap-6 h-full">
          {/* Code Editor */}
          <div className={`flex-1 rounded-xl border overflow-hidden flex flex-col shadow-lg ${themeStyles.card} ${themeStyles.border}`}>
            <div className={`px-5 py-3 border-b ${themeStyles.border} ${themeStyles.tableHeaderBg}`}>
              <div className="flex justify-between items-center">
                <h2 className={`font-semibold text-lg ${themeStyles.text}`}>Code Editor</h2>
                <div className="flex gap-3">
                  <button className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${themeStyles.buttonSecondaryBg} ${themeStyles.buttonSecondaryText}`}>
                    C++
                  </button>
                  <button className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${themeStyles.buttonSecondaryBg} ${themeStyles.buttonSecondaryText}`}>
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
          <div className={`rounded-xl border overflow-hidden shadow-lg ${themeStyles.card} ${themeStyles.border}`}>
            <div className={`px-5 py-3 border-b flex justify-between items-center ${themeStyles.border} ${themeStyles.tableHeaderBg}`}>
              <h2 className={`font-semibold text-lg ${themeStyles.text}`}>Submit Solution</h2>
              <button
                onClick={() => handleCodeSubmit(code)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  themeStyles.buttonPrimaryBg
                } ${themeStyles.buttonPrimaryText} hover:scale-105`}
              >
                Submit
              </button>
            </div>
            <div className={`p-5 font-mono text-sm min-h-32 flex items-center justify-center ${themeStyles.background}`}>
              {verdict ? (
                <div className={`p-4 rounded-lg w-full text-center font-medium text-base ${
                  verdict === "Accepted"
                    ? themeStyles.successBg + " " + themeStyles.successText
                    : (verdict.includes("Error") || verdict.includes("Wrong") || verdict.includes("Limit Exceeded"))
                      ? themeStyles.dangerBg + " " + themeStyles.dangerText
                      : themeStyles.codeBg + " " + themeStyles.secondaryText
                }`}>
                  {verdict}
                </div>
              ) : (
                <div className={`flex items-center justify-center h-full ${themeStyles.secondaryText}`}>
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

// --- Submissions Tab Component ---
function ContestSubmissionsTab({ submissions, isLoading, isDark, onSelectSubmission, selectedSubmission }) {
  const themeStyles = themes[isDark ? "dark" : "light"];

  if (isLoading) {
    return (
      <div className={`py-8 flex flex-col items-center justify-center ${themeStyles.background}`}>
        <div className={`w-10 h-10 border-4 ${isDark ? "border-orange-500" : "border-indigo-600"} border-t-transparent rounded-full animate-spin mb-4`}></div>
        <p className={`${themeStyles.secondaryText}`}>Loading submissions...</p>
      </div>
    );
  }

  if (selectedSubmission) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${themeStyles.text}`}>Submission Details</h3>
          <button
            onClick={() => onSelectSubmission(null)}
            className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors duration-200 ${themeStyles.buttonSecondaryBg} ${themeStyles.buttonSecondaryText}`}
          >
            Back to list
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${themeStyles.codeBg} border ${themeStyles.codeBorder}`}>
            <div className={`text-xs font-medium ${themeStyles.secondaryText} mb-1`}>Status</div>
            <div className={`font-bold text-lg ${
              selectedSubmission.verdict === "Accepted" ? themeStyles.successText : themeStyles.dangerText
            }`}>
              {selectedSubmission.verdict}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${themeStyles.codeBg} border ${themeStyles.codeBorder}`}>
            <div className={`text-xs font-medium ${themeStyles.secondaryText} mb-1`}>Runtime</div>
            <div className={`font-bold text-lg ${themeStyles.text}`}>
              {selectedSubmission.timeTaken ? `${selectedSubmission.timeTaken} ms` : "N/A"}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${themeStyles.codeBg} border ${themeStyles.codeBorder}`}>
            <div className={`text-xs font-medium ${themeStyles.secondaryText} mb-1`}>Memory</div>
            <div className={`font-bold text-lg ${themeStyles.text}`}>
              {selectedSubmission.memoryTaken ? `${selectedSubmission.memoryTaken} KB` : "N/A"}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className={`text-lg font-medium mb-3 ${themeStyles.text}`}>Submitted Code</div>
          <pre className={`p-5 rounded-lg overflow-x-auto text-sm ${themeStyles.codeBg} ${themeStyles.text} border ${themeStyles.codeBorder}`}>
            {selectedSubmission.code}
          </pre>
        </div>

        <div className={`text-xs ${themeStyles.secondaryText} text-right`}>
          Submitted at: {new Date(selectedSubmission.submissionTime).toLocaleString()}
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className={`py-12 text-center ${themeStyles.background}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${themeStyles.codeBg} border ${themeStyles.codeBorder}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 ${themeStyles.secondaryText}`}
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
        <h3 className={`text-xl font-semibold ${themeStyles.text}`}>No Submissions Yet</h3>
        <p className={`text-base mt-2 ${themeStyles.secondaryText}`}>
          Submit your solution to see it here and track your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(100vh - 250px)" }}>
      <table className={`w-full text-sm ${themeStyles.text}`}>
        <thead className={`${themeStyles.tableHeaderBg} sticky top-0 z-10`}>
          <tr className={`border-b ${themeStyles.border}`}>
            <th className="text-left py-3 px-5 font-semibold">Time</th>
            <th className="text-left py-3 px-5 font-semibold">Status</th>
            <th className="text-left py-3 px-5 font-semibold">Runtime</th>
            <th className="text-left py-3 px-5 font-semibold">Memory</th>
            <th className="text-left py-3 px-5 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, index) => (
            <tr
              key={index}
              className={`border-b ${themeStyles.border} ${themeStyles.tableRowHover} transition-colors duration-150`}
            >
              <td className="py-4 px-5">
                {sub.submissionTime
                  ? formatDuration(sub.timeFromStart)
                  : "N/A"}
              </td>
              <td className="py-4 px-5">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  sub.verdict === "Accepted"
                    ? themeStyles.successBg + " " + themeStyles.successText
                    : themeStyles.dangerBg + " " + themeStyles.dangerText
                }`}>
                  {sub.verdict || "Error"}
                </span>
              </td>
              <td className={`py-4 px-5 ${themeStyles.secondaryText}`}>
                {sub.timeTaken ? `${sub.timeTaken} ms` : "N/A"}
              </td>
              <td className={`py-4 px-5 ${themeStyles.secondaryText}`}>
                {sub.memoryTaken ? `${sub.memoryTaken} KB` : "N/A"}
              </td>
              <td className="py-4 px-5">
                <button
                  onClick={() => onSelectSubmission(sub)}
                  className={`px-4 py-2 text-xs rounded-lg font-medium transition-colors duration-200 ${themeStyles.buttonSecondaryBg} ${themeStyles.buttonSecondaryText}`}
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