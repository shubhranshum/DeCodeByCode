import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import SubmissionCodeEditor from "../Tasks/submissionCodeEditor.jsx";
import codeOutput from "../Tasks/output.jsx"; // Assuming this is an external utility for running code
import MathjaxRenderer from "../MathjaxRenderer"; // Assuming this is an external utility for rendering MathJax
import { getProblemBySlug } from '../Tasks/getProblemBySlug'; // Utility to fetch problem by slug

// --- Theme Colors (Defined outside to easily reference) ---
const lightColors = {
    bgPrimary: "bg-gray-50",
    bgSecondary: "bg-white",
    bgAccent: "bg-blue-50",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-700",
    textAccent: "text-blue-700",
    border: "border-gray-200",
    buttonPrimaryBg: "bg-blue-600",
    buttonPrimaryHover: "hover:bg-blue-700",
    buttonSecondaryBg: "bg-gray-200",
    buttonSecondaryHover: "hover:bg-gray-300",
    acceptedBg: "bg-emerald-100",
    acceptedText: "text-emerald-700",
    attemptedBg: "bg-amber-100",
    attemptedText: "text-amber-700",
    errorBg: "bg-red-100",
    errorText: "text-red-700",
    codeBg: "bg-gray-100",
    codeBorder: "border-gray-300",
    inputBg: "bg-gray-100" // For textareas, etc.
};

const darkColors = {
    bgPrimary: "bg-gray-900",
    bgSecondary: "bg-gray-800",
    bgAccent: "bg-gray-700",
    textPrimary: "text-gray-50",
    textSecondary: "text-gray-300",
    textAccent: "text-teal-400",
    border: "border-gray-700",
    buttonPrimaryBg: "bg-teal-600",
    buttonPrimaryHover: "hover:bg-teal-700",
    buttonSecondaryBg: "bg-gray-700",
    buttonSecondaryHover: "hover:bg-gray-600",
    acceptedBg: "bg-emerald-900/30",
    acceptedText: "text-emerald-400",
    attemptedBg: "bg-amber-900/30",
    attemptedText: "text-amber-400",
    errorBg: "bg-red-900/30",
    errorText: "text-red-400",
    codeBg: "bg-gray-950",
    codeBorder: "border-gray-600",
    inputBg: "bg-gray-700" // For textareas, etc.
};


// --- Loading and Error Components ---
const LoadingSpinner = ({ isDark }) => {
    const colors = isDark ? darkColors : lightColors;
    return (
        <div className={`flex items-center justify-center min-h-screen ${colors.bgPrimary}`}>
            <div className="flex flex-col items-center">
                <div className={`w-16 h-16 border-4 ${isDark ? "border-teal-500" : "border-blue-600"} border-t-transparent rounded-full animate-spin`}></div>
                <p className={`mt-4 text-lg ${colors.textSecondary}`}>
                    Loading problem...
                </p>
            </div>
        </div>
    );
};

const ProblemNotFound = ({ isDark }) => {
    const colors = isDark ? darkColors : lightColors;
    return (
        <div className={`flex items-center justify-center min-h-screen ${colors.bgPrimary}`}>
            <div className={`p-8 rounded-xl shadow-lg text-center ${colors.bgSecondary} ${colors.border}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}>
                    Problem Not Found
                </h2>
                <p className={colors.textSecondary}>
                    The requested problem could not be loaded. Please check the URL.
                </p>
            </div>
        </div>
    );
};

// --- Utility Function ---
function formatDuration(ms) {
    const totalSeconds = Math.max(0, ms);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Move STATUS_RANK outside the component to make it a true constant
const STATUS_RANK = { Unattempted: 0, Attempted: 1, Accepted: 2 };

// --- Main GlobalProblem Component ---
export default function GlobalProblem() {
    const { problemSlug } = useParams();
    const location = useLocation();

    const [problemId, setProblemId] = useState(null);
    const STORAGE_KEY = useRef(null);
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("");
    const [verdict, setVerdict] = useState(null);
    const [activeTab, setActiveTab] = useState("problem");
    const [isLoading, setIsLoading] = useState(true);

    const [submissions, setSubmissions] = useState([]);
    const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const [solutions, setSolutions] = useState([]);
    const [isSolutionsLoading, setIsSolutionsLoading] = useState(false);
    const [selectedSolution, setSelectedSolution] = useState(null);

    const [customInput, setCustomInput] = useState("");
    const [customOutput, setCustomOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const [status, setStatus] = useState("Unattempted");
    const initialVerdict = useRef(location.state?.verdict);

    const theme = "dark"; // This could be dynamic based on user preference
    const isDark = theme === "dark";
    const colors = isDark ? darkColors : lightColors;

    const updateStatus = useCallback((newStatus) => {
        if (!problemId || !STORAGE_KEY.current) return;

        const prev = localStorage.getItem(STORAGE_KEY.current) || "Unattempted";
        if (STATUS_RANK[newStatus] > STATUS_RANK[prev]) {
            localStorage.setItem(STORAGE_KEY.current, newStatus);
            setStatus(newStatus);
        }
    }, [problemId]);

    const fetchSubmissions = useCallback(async () => {
        if (!problemId) {
            console.warn("Cannot fetch submissions: problemId not available.");
            return;
        }

        setIsSubmissionsLoading(true);
        try {
            const res = await fetch(
                `http://localhost:3000/problems/${problemId}/submissions`,
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
            setSubmissions([]);
        } finally {
            setIsSubmissionsLoading(false);
        }
    }, [problemId, updateStatus]);

    const fetchAllSolutions = useCallback(async () => {
        if (!problemId) {
            console.warn("Cannot fetch solutions: problemId not available.");
            return;
        }

        setIsSolutionsLoading(true);
        try {
            const res = await fetch(
                `http://localhost:3000/problems/${problemId}/solutions`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const data = await res.json();
            setSolutions(data);
        } catch (err) {
            console.error("Failed to load solutions:", err);
            setSolutions([]);
        } finally {
            setIsSolutionsLoading(false);
        }
    }, [problemId]);


    useEffect(() => {
        const fetchProblemData = async () => {
            setIsLoading(true);
            setProblem(null);
            setProblemId(null);
            setStatus("Unattempted");
            STORAGE_KEY.current = null;

            try {
                const problemData = await getProblemBySlug(problemSlug);

                if (!problemData || !problemData._id) {
                    throw new Error("Problem not found.");
                }

                setProblemId(problemData._id);
                setProblem(problemData);

            } catch (err) {
                console.error("Error loading problem:", err);
                setProblem(null);
                setIsLoading(false);
            }
        };

        fetchProblemData();
    }, [problemSlug]);

    useEffect(() => {
        if (problemId) {
            STORAGE_KEY.current = `status-${problemId}`;

            const savedStatus = localStorage.getItem(STORAGE_KEY.current) || "Unattempted";
            setStatus(savedStatus);

            if (initialVerdict.current) {
                const prevRank = STATUS_RANK[savedStatus];
                const newRank = STATUS_RANK[initialVerdict.current];

                if (newRank > prevRank) {
                    localStorage.setItem(STORAGE_KEY.current, initialVerdict.current);
                    setStatus(initialVerdict.current);
                }
                initialVerdict.current = null;
            }

            fetchSubmissions();
            setIsLoading(false);
        }
    }, [problemId, fetchSubmissions]);


    const handleCodeSubmit = useCallback(async (codeToSubmit) => {
        if (!problemId || !problem) {
            setVerdict("Error: Problem ID not available for submission.");
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

            if (out.status_id !== 3) {
                isCorrect = false;
                finalVerdict = out.stderr
                    ? `Runtime Error on Test ${i + 1}: ${out.stderr}`
                    : out.compile_output
                        ? `Compilation Error on Test ${i + 1}: ${out.compile_output}`
                        : `${out.status?.description || "Unknown Error"} on Test ${i + 1}`;
                break;
            }
        }

        updateStatus(isCorrect ? "Accepted" : "Attempted");
        setVerdict(finalVerdict);

        try {
            await fetch(
                `http://localhost:3000/problems/${problemId}/submit`,
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
    }, [problemId, problem, updateStatus, fetchSubmissions]);


    const handleRunCustomInput = async () => {
        if (!problem) {
            setCustomOutput({ userOutput: "Error: Problem data not loaded." });
            return;
        }

        setIsRunning(true);
        try {
            const userOut = await codeOutput(code, customInput);
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

    if (isLoading) {
        return <LoadingSpinner isDark={isDark} />;
    }
    if (!problem) {
        return <ProblemNotFound isDark={isDark} />;
    }

    return (
        <div className={`min-h-screen ${colors.bgPrimary} ${colors.textPrimary} font-sans`}>
            {/* Header */}
            <div className={`${colors.bgSecondary} ${colors.border} border-b px-6 py-4 shadow-md`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className={`text-3xl font-extrabold ${colors.textAccent}`}>
                            {problem.title}
                        </h1>
                        <div className="flex items-center mt-2 text-sm">
                            <span className={`mr-4 ${colors.textSecondary}`}>
                                Problem ID: {problemId}
                            </span>
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                                status === "Accepted"
                                    ? `${colors.acceptedBg} ${colors.acceptedText} border ${isDark ? "border-emerald-700" : "border-emerald-300"}`
                                    : status === "Attempted"
                                        ? `${colors.attemptedBg} ${colors.attemptedText} border ${isDark ? "border-amber-700" : "border-amber-300"}`
                                        : `${colors.bgAccent} ${colors.textSecondary} border ${colors.border}`
                                }`}>
                                {status}
                            </span>
                        </div>
                    </div>
                    <div className={`text-sm px-4 py-2 rounded-full font-medium ${colors.bgAccent} ${colors.textSecondary}`}>
                        Difficulty:{" "}
                        <span className={`font-semibold ${
                            problem.difficulty === "Easy" ? "text-emerald-500"
                                : problem.difficulty === "Medium" ? "text-amber-500"
                                    : "text-red-500"
                            }`}>
                            {problem.difficulty || "Unknown"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row p-6 gap-6 max-w-8xl mx-auto h-[calc(100vh-130px)]">
                {/* Left Panel - Problem Content, Submissions, and Run Code */}
                <div className="lg:w-1/2 flex flex-col gap-6 h-full">
                    <div className={`flex-1 rounded-xl border overflow-hidden flex flex-col shadow-lg ${colors.bgSecondary} ${colors.border}`}>
                        {/* Tab Navigation */}
                        <div className={`flex border-b ${colors.border} justify-around`}>
                            <button
                                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === "problem"
                                        ? `${colors.textAccent} border-b-2 ${isDark ? "border-teal-500" : "border-blue-600"}`
                                        : `${colors.textSecondary} ${isDark ? "hover:text-gray-200" : "hover:text-gray-900"}`
                                    }`}
                                onClick={() => setActiveTab("problem")}
                            >
                                Description
                            </button>
                            <button
                                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === "submissions"
                                        ? `${colors.textAccent} border-b-2 ${isDark ? "border-teal-500" : "border-blue-600"}`
                                        : `${colors.textSecondary} ${isDark ? "hover:text-gray-200" : "hover:text-gray-900"}`
                                    }`}
                                onClick={() => setActiveTab("submissions")}
                            >
                                Submissions
                            </button>
                            <button
                                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === "solutions"
                                        ? `${colors.textAccent} border-b-2 ${isDark ? "border-teal-500" : "border-blue-600"}`
                                        : `${colors.textSecondary} ${isDark ? "hover:text-gray-200" : "hover:text-gray-900"}`
                                    }`}
                                onClick={() => {
                                    setActiveTab("solutions");
                                    if (solutions.length === 0 && !isSolutionsLoading) fetchAllSolutions();
                                }}
                            >
                                Solutions
                            </button>
                            <button
                                className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                                    activeTab === "run-code"
                                        ? `${colors.textAccent} border-b-2 ${isDark ? "border-teal-500" : "border-blue-600"}`
                                        : `${colors.textSecondary} ${isDark ? "hover:text-gray-200" : "hover:text-gray-900"}`
                                    }`}
                                onClick={() => setActiveTab("run-code")}
                            >
                                Run Code
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                            {activeTab === "problem" && (
                                <div className="space-y-8">
                                    {/* Problem Statement */}
                                    <section>
                                        <h2 className="text-2xl font-bold mb-4">Problem Statement</h2>
                                        <div className={`${colors.textSecondary} prose prose-lg max-w-none`}>
                                            <MathjaxRenderer html={problem.statement} />
                                        </div>
                                    </section>

                                    {/* Input/Output Sections */}
                                    <section className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h2 className="text-xl font-bold mb-3">Input Format</h2>
                                            <div className={`p-4 rounded-lg font-mono text-sm ${colors.inputBg} ${colors.textPrimary}`}>
                                                <MathjaxRenderer html={problem.inputFormat} />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold mb-3">Output Format</h2>
                                            <div className={`p-4 rounded-lg font-mono text-sm ${colors.inputBg} ${colors.textPrimary}`}>
                                                <MathjaxRenderer html={problem.outputFormat} />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Sample Test Cases */}
                                    {problem.testCases.filter(tc => tc.visible).length > 0 && (
                                        <section className="space-y-4">
                                            <h2 className="text-xl font-bold">Sample Test Cases</h2>
                                            {problem.testCases.filter(tc => tc.visible).map((testCase, index) => (
                                                <div key={index} className={`rounded-lg overflow-hidden ${colors.bgAccent}`}>
                                                    <div className={`px-5 py-3 ${colors.bgAccent} border-b ${colors.border}`}>
                                                        <h3 className="font-semibold">Sample {index + 1}</h3>
                                                        {testCase.explanation && (
                                                            <p className={`text-xs mt-1 ${colors.textSecondary}`}>
                                                                {testCase.explanation}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium mb-2">Input</h4>
                                                            <pre className={`p-3 rounded-md font-mono text-sm whitespace-pre-wrap ${colors.codeBg} ${colors.textPrimary} border ${colors.codeBorder}`}>
                                                                {testCase.input || "No input provided"}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium mb-2">Output</h4>
                                                            <pre className={`p-3 rounded-md font-mono text-sm whitespace-pre-wrap ${colors.codeBg} ${colors.textPrimary} border ${colors.codeBorder}`}>
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
                                        <section>
                                            <h2 className="text-xl font-bold mb-3">Notes</h2>
                                            <div className={`p-4 rounded-lg ${colors.inputBg} ${colors.textPrimary}`}>
                                                <MathjaxRenderer html={problem.notes} />
                                            </div>
                                        </section>
                                    )}
                                </div>
                            )}

                            {activeTab === "submissions" && (
                                <ProblemSubmissionsTab
                                    submissions={submissions}
                                    isLoading={isSubmissionsLoading}
                                    isDark={isDark}
                                    onSelectSubmission={setSelectedSubmission}
                                    selectedSubmission={selectedSubmission}
                                />
                            )}

                            {activeTab === "solutions" && (
                                <ProblemSolutionsTab
                                    solutions={solutions}
                                    isLoading={isSolutionsLoading}
                                    isDark={isDark}
                                    onSelectSolution={setSelectedSolution}
                                    selectedSolution={selectedSolution}
                                />
                            )}
                            {activeTab === "run-code" && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-base font-medium">Custom Input</label>
                                            <button
                                                onClick={handleRunCustomInput}
                                                disabled={isRunning}
                                                className={`px-4 py-2 text-sm rounded-lg font-medium flex items-center transition-colors ${colors.buttonPrimaryBg} ${colors.buttonPrimaryHover} text-white ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
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
                                        <div className={`rounded-lg overflow-hidden border ${colors.border}`}>
                                            <textarea
                                                rows={6}
                                                className={`w-full p-4 font-mono text-sm resize-none focus:outline-none ${colors.inputBg} ${colors.textPrimary}`}
                                                value={customInput}
                                                onChange={(e) => setCustomInput(e.target.value)}
                                                placeholder="Enter your custom test case input here..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-base font-medium block mb-3">Your Output</label>
                                            <div className={`rounded-lg overflow-hidden border ${colors.border} ${colors.inputBg}`}>
                                                <pre className={`p-4 font-mono text-sm min-h-[120px] max-h-[250px] overflow-auto ${colors.textPrimary}`}>
                                                    {customOutput?.userOutput
                                                        ? customOutput.userOutput
                                                        : "Run code to see your output"}
                                                </pre>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-base font-medium block mb-3">Expected Output</label>
                                            <div className={`rounded-lg overflow-hidden border ${colors.border} ${colors.inputBg}`}>
                                                <pre className={`p-4 font-mono text-sm min-h-[120px] max-h-[250px] overflow-auto ${colors.textPrimary}`}>
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
                    <div className={`flex-1 rounded-xl border overflow-hidden flex flex-col shadow-lg ${colors.bgSecondary} ${colors.border}`}>
                        <div className={`px-5 py-3 border-b ${colors.border} ${colors.bgSecondary}`}>
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-lg">Code Editor</h2>
                                <div className="flex gap-3">
                                    <button className={`px-3.5 py-1.5 text-xs rounded-md font-medium ${colors.buttonSecondaryBg} ${colors.buttonSecondaryHover} ${colors.textSecondary}`}>
                                        C++
                                    </button>
                                    <button className={`px-3.5 py-1.5 text-xs rounded-md font-medium ${colors.buttonSecondaryBg} ${colors.buttonSecondaryHover} ${colors.textSecondary}`}>
                                        Python
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <SubmissionCodeEditor
                                initialCode={code}
                                language="cpp"
                                onCodeChange={setCode}
                                theme={isDark ? "vs-dark" : "light"}
                            />
                        </div>
                    </div>

                    {/* Submit Panel */}
                    <div className={`rounded-xl border overflow-hidden shadow-lg ${colors.bgSecondary} ${colors.border}`}>
                        <div className={`px-5 py-3 border-b flex justify-between items-center ${colors.border} ${colors.bgSecondary}`}>
                            <h2 className="font-semibold text-lg">Submit Solution</h2>
                            <button
                                onClick={() => handleCodeSubmit(code)}
                                className={`px-5 py-2 rounded-lg font-semibold transition-all text-white ${colors.buttonPrimaryBg} ${colors.buttonPrimaryHover}`}
                            >
                                Submit
                            </button>
                        </div>
                        <div className={`p-5 font-mono text-sm min-h-28 flex items-center justify-center text-center ${colors.bgPrimary}`}>
                            {verdict ? (
                                <div className={`p-4 rounded-lg w-full ${
                                    verdict === "Accepted"
                                        ? `${colors.acceptedBg} ${colors.acceptedText}`
                                        : verdict.includes("Wrong") || verdict.includes("Error") || verdict.includes("Limit Exceeded")
                                            ? `${colors.errorBg} ${colors.errorText}`
                                            : `${colors.bgAccent} ${colors.textSecondary}`
                                    }`}>
                                    {verdict}
                                </div>
                            ) : (
                                <div className={`${colors.textSecondary} text-sm`}>
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
function ProblemSubmissionsTab({ submissions, isLoading, isDark, onSelectSubmission, selectedSubmission }) {
    const colors = isDark ? darkColors : lightColors;

    if (isLoading) {
        return <div className={`py-6 flex items-center justify-center ${colors.textSecondary}`}>Loading submissions...</div>;
    }

    if (selectedSubmission) {
        return (
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Submission Details</h3>
                    <button
                        onClick={() => onSelectSubmission(null)}
                        className={`text-sm px-4 py-1.5 rounded-md ${colors.buttonSecondaryBg} ${colors.buttonSecondaryHover} ${colors.textSecondary}`}
                    >
                        Back to list
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${colors.bgAccent}`}>
                        <div className={`text-xs ${colors.textSecondary} mb-1`}>Status</div>
                        <div className={`font-bold text-lg ${
                            selectedSubmission.verdict === "Accepted" ? "text-emerald-500" : "text-red-500"
                            }`}>
                            {selectedSubmission.verdict}
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg ${colors.bgAccent}`}>
                        <div className={`text-xs ${colors.textSecondary} mb-1`}>Runtime</div>
                        <div className="font-medium text-lg">
                            {selectedSubmission.timetaken} ms
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg ${colors.bgAccent}`}>
                        <div className={`text-xs ${colors.textSecondary} mb-1`}>Memory</div>
                        <div className="font-medium text-lg">
                            {selectedSubmission.memorytaken} KB
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-base font-medium">Submitted Code</div>
                    <pre className={`p-5 rounded-lg overflow-x-auto text-sm ${colors.codeBg} ${colors.textPrimary} border ${colors.codeBorder}`}>
                        {selectedSubmission.code}
                    </pre>
                </div>

                <div className={`text-xs ${colors.textSecondary}`}>
                    Submitted at: {new Date(selectedSubmission.submissionTime).toLocaleString()}
                </div>
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <div className={`py-8 text-center ${colors.bgAccent} rounded-lg`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${colors.bgSecondary} ${colors.border}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${colors.textSecondary}`}
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
                <h3 className="text-base font-semibold">No Submissions Yet</h3>
                <p className={`text-sm mt-1 ${colors.textSecondary}`}>
                    Submit your solution to see it here
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
            <table className="w-full text-sm">
                <thead>
                    <tr className={`border-b ${colors.border} ${colors.textSecondary}`}>
                        <th className="text-left py-3 px-4 font-semibold">Time</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Runtime</th>
                        <th className="text-left py-3 px-4 font-semibold">Memory</th>
                        <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((sub, index) => (
                        <tr
                            key={index}
                            className={`border-b ${colors.border} ${isDark ? "hover:bg-gray-700/40" : "hover:bg-gray-100"}`}
                        >
                            <td className="py-3 px-4">
                                {sub.submissionTime
                                    ? formatDuration(sub.timeFromStart)
                                    : "N/A"}
                            </td>
                            <td className="py-3 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    sub.verdict === "Accepted"
                                        ? `${colors.acceptedBg} ${colors.acceptedText}`
                                        : `${colors.errorBg} ${colors.errorText}`
                                    }`}>
                                    {sub.verdict || "Error"}
                                </span>
                            </td>
                            <td className={`py-3 px-4 ${colors.textSecondary}`}>
                                {sub.timetaken ? `${sub.timetaken} ms` : "N/A"}
                            </td>
                            <td className={`py-3 px-4 ${colors.textSecondary}`}>
                                {sub.memorytaken ? `${sub.memorytaken} KB` : "N/A"}
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => onSelectSubmission(sub)}
                                    className={`text-xs px-3.5 py-1.5 rounded-md ${colors.buttonSecondaryBg} ${colors.buttonSecondaryHover} ${colors.textSecondary}`}
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

// --- Solutions Tab Component ---
function ProblemSolutionsTab({ solutions, isLoading, isDark, onSelectSolution, selectedSolution }) {
    const colors = isDark ? darkColors : lightColors;

    if (isLoading) {
        return (
            <div className={`py-6 flex items-center justify-center ${colors.textSecondary}`}>
                <div className={`w-8 h-8 border-2 ${isDark ? "border-teal-500" : "border-blue-600"} border-t-transparent rounded-full animate-spin`}></div>
            </div>
        );
    }

    if (selectedSolution) {
        return (
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Solution Details</h3>
                    <button
                        onClick={() => onSelectSolution(null)}
                        className={`text-sm px-4 py-1.5 rounded-md ${colors.buttonSecondaryBg} ${colors.buttonSecondaryHover} ${colors.textSecondary}`}
                    >
                        Back to list
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${colors.bgAccent}`}>
                        <div className={`text-xs ${colors.textSecondary} mb-1`}>Status</div>
                        <div className={`font-bold text-lg ${
                            selectedSolution.verdict === "Accepted" ? "text-emerald-500" : "text-red-500"
                            }`}>
                            {selectedSolution.verdict}
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg ${colors.bgAccent}`}>
                        <div className={`text-xs ${colors.textSecondary} mb-1`}>Runtime</div>
                        <div className="font-medium text-lg">
                            {selectedSolution.timeTaken} ms
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg ${colors.bgAccent}`}>
                        <div className={`text-xs ${colors.textSecondary} mb-1`}>Memory</div>
                        <div className="font-medium text-lg">
                            {selectedSolution.memoryTaken} KB
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-base font-medium">Solution Code</div>
                    <pre className={`p-5 rounded-lg overflow-x-auto text-sm ${colors.codeBg} ${colors.textPrimary} border ${colors.codeBorder}`}>
                        {selectedSolution.code}
                    </pre>
                </div>

                <div className={`text-xs ${colors.textSecondary}`}>
                    Submitted at: {new Date(selectedSolution.submissionTime).toLocaleString()}
                </div>
            </div>
        );
    }

    if (solutions.length === 0) {
        return (
            <div className={`py-8 text-center ${colors.bgAccent} rounded-lg`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${colors.bgSecondary} ${colors.border}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${colors.textSecondary}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                </div>
                <h3 className="text-base font-semibold">No Solutions Available</h3>
                <p className={`text-sm mt-1 ${colors.textSecondary}`}>
                    Be the first to solve this problem!
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
            <table className="w-full text-sm">
                <thead>
                    <tr className={`border-b ${colors.border} ${colors.textSecondary}`}>
                        <th className="text-left py-3 px-4 font-semibold">User</th>
                        <th className="text-left py-3 px-4 font-semibold">Language</th>
                        <th className="text-left py-3 px-4 font-semibold">Runtime</th>
                        <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {solutions.map((solution, index) => (
                        <tr
                            key={index}
                            className={`border-b ${colors.border} ${isDark ? "hover:bg-gray-700/40" : "hover:bg-gray-100"}`}
                        >
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 ${colors.bgAccent} ${colors.textSecondary}`}>
                                        <span className="text-sm font-bold">
                                            {solution.userId?.username?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className={colors.textPrimary}>{solution.userId?.username || 'Unknown User'}</span>
                                </div>
                            </td>
                            <td className={`py-3 px-4 ${colors.textSecondary}`}>
                                {solution.language}
                            </td>
                            <td className={`py-3 px-4 ${colors.textSecondary}`}>
                                {solution.timeTaken} ms
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => onSelectSolution(solution)}
                                    className={`text-xs px-3.5 py-1.5 rounded-md ${colors.buttonSecondaryBg} ${colors.buttonSecondaryHover} ${colors.textSecondary}`}
                                >
                                    View Solution
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}