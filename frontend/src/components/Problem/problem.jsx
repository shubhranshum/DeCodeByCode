import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import SubmissionCodeEditor from "../Tasks/submissionCodeEditor.jsx";
import codeOutput from "../Tasks/output.jsx";
import MathjaxRenderer from "../MathjaxRenderer";
import { getProblemBySlug } from '../Tasks/getProblemBySlug';

// --- ENHANCED RETRO COLOR PALETTE ---
const pastelRetroColors = {
    // Backgrounds and Text
    bgPrimary: "bg-[#f7f4ed]",
    textPrimary: "text-[#2d2a26]",
    textSecondary: "text-[#5a534a]",
    textTitle: "text-[#e63946]",

    // Panels and Containers
    panelBg: "bg-[#fffcf5]",
    panelBorder: "border-[#3a3530]",

    // Tabs and Interactive Elements
    tabActiveBg: "bg-[#fffcf5]",
    tabActiveText: "text-[#e63946]",
    tabInactiveBg: "bg-[#e9e3d5]",
    tabInactiveText: "text-[#5a534a]",
    tabHoverBg: "hover:bg-[#d6d0c3]",

    // Buttons
    buttonPrimaryBg: "bg-[#a8dadc] hover:bg-[#8ecacc]",
    buttonSecondaryBg: "bg-[#e9e3d5] hover:bg-[#d6d0c3]",
    buttonText: "text-[#2d2a26]",

    // Status Indicators
    acceptedBg: "bg-[#c7f9cc]",
    acceptedText: "text-[#2a9d8f]",
    attemptedBg: "bg-[#ffd6a5]",
    attemptedText: "text-[#e76f51]",
    errorBg: "bg-[#ffafcc]",
    errorText: "text-[#e63946]",
    unattemptedBg: "bg-[#e9e3d5]",
    unattemptedText: "text-[#5a534a]",

    // Code and IO Blocks
    codeBg: "bg-[#3a3530]",
    codeText: "text-[#f1faee]",
    inputBg: "bg-[#f1faee]",
    sectionHeaderBg: "bg-[#caf0f8]",
};

// --- Reusable Components ---
const Button = ({ children, onClick, disabled, className = '', type = 'primary', small = false }) => {
    const colors = pastelRetroColors;
    const sizeStyle = small ? 'px-4 py-1 text-sm' : 'px-5 py-2.5 text-base';
    const baseStyle = `border-2 ${colors.panelBorder} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 font-bold`;
    const typeStyle = type === 'primary' ? `${colors.buttonPrimaryBg} ${colors.buttonText}` : `${colors.buttonSecondaryBg} ${colors.buttonText}`;

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${typeStyle} ${sizeStyle} ${className}`}>
            {children}
        </button>
    );
};

// --- Loading and Error Components ---
const LoadingSpinner = () => {
    const colors = pastelRetroColors;
    return (
        <div className={`flex items-center justify-center min-h-screen ${colors.bgPrimary} ${colors.textPrimary} font-retro`}>
            <div className="flex flex-col items-center">
                <div className={`w-16 h-16 border-4 ${colors.panelBorder} border-t-transparent rounded-full animate-spin`}></div>
                <p className={`mt-4 text-2xl animate-pulse`}>LOADING...</p>
            </div>
        </div>
    );
};

const ProblemNotFound = () => {
    const colors = pastelRetroColors;
    return (
        <div className={`flex items-center justify-center min-h-screen ${colors.bgPrimary} ${colors.textPrimary} font-retro`}>
            <div className={`p-10 border-4 ${colors.panelBorder} shadow-chunky text-center ${colors.panelBg}`}>
                <h2 className={`text-3xl font-bold mb-4 ${colors.errorText}`}>ERROR 404</h2>
                <p>PROBLEM NOT FOUND</p>
            </div>
        </div>
    );
};

// --- Utility Functions ---
function formatToDDMMYYYY(isoDateStr) {
    const date = new Date(isoDateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// --- Constants ---
const STATUS_RANK = { Unattempted: 0, Attempted: 1, Accepted: 2 };

// --- Main GlobalProblem Component ---
export default function GlobalProblem() {
    const { problemSlug } = useParams();
    const location = useLocation();
    
    // State management hooks
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
    const colors = pastelRetroColors;
    
    // Callback and effect hooks
    const updateStatus = useCallback((newStatus) => {
        if (!problemId || !STORAGE_KEY.current) return;
        const prev = localStorage.getItem(STORAGE_KEY.current) || "Unattempted";
        if (STATUS_RANK[newStatus] > STATUS_RANK[prev]) {
            localStorage.setItem(STORAGE_KEY.current, newStatus);
            setStatus(newStatus);
        }
    }, [problemId]);

    const fetchSubmissions = useCallback(async () => {
        if (!problemId) return;
        setIsSubmissionsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/problems/${problemId}/submissions`, { credentials: "include" });
            const data = await res.json();
            if (!data.length) updateStatus("Unattempted");
            else if (data.some(s => s.verdict === "Accepted")) updateStatus("Accepted");
            else updateStatus("Attempted");
            setSubmissions(data);
        } catch (err) { console.error("Failed to load submissions:", err); setSubmissions([]); }
        finally { setIsSubmissionsLoading(false); }
    }, [problemId, updateStatus]);

    const fetchAllSolutions = useCallback(async () => {
        if (!problemId) return;
        setIsSolutionsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/problems/${problemId}/solutions`, { method: "GET", credentials: "include" });
            const data = await res.json();
            setSolutions(data);
        } catch (err) { console.error("Failed to load solutions:", err); setSolutions([]); }
        finally { setIsSolutionsLoading(false); }
    }, [problemId]);

    useEffect(() => {
        const fetchProblemData = async () => {
            setIsLoading(true);
            try {
                const problemData = await getProblemBySlug(problemSlug);
                if (!problemData || !problemData._id) throw new Error("Problem not found.");
                setProblemId(problemData._id); setProblem(problemData);
            } catch (err) { console.error("Error loading problem:", err); setProblem(null); setIsLoading(false); }
        };
        fetchProblemData();
    }, [problemSlug]);

    useEffect(() => {
        if (problemId) {
            STORAGE_KEY.current = `status-${problemId}`;
            const savedStatus = localStorage.getItem(STORAGE_KEY.current) || "Unattempted";
            setStatus(savedStatus);
            if (initialVerdict.current) {
                if (STATUS_RANK[initialVerdict.current] > STATUS_RANK[savedStatus]) {
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
        if (!problemId || !problem) return;
        let isCorrect = true, finalVerdict = "Accepted", maxTime = 0, maxMem = 0;
        setVerdict("Running...");
        for (let i = 0; i < problem.testCases.length; i++) {
            const tc = problem.testCases[i];
            const out = await codeOutput(codeToSubmit, tc.input, tc.output.stdout);
            maxTime = Math.max(maxTime, Number(out.time || 0)); maxMem = Math.max(maxMem, Number(out.memory || 0));
            if (out.status_id !== 3) {
                isCorrect = false;
                finalVerdict = out.stderr ? `Runtime Error` : out.compile_output ? `Compilation Error` : `${out.status?.description || "Wrong Answer"}`;
                break;
            }
        }
        updateStatus(isCorrect ? "Accepted" : "Attempted");
        setVerdict(finalVerdict);
        try {
            await fetch(`http://localhost:3000/problems/${problemId}/submit`, {
                method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
                body: JSON.stringify({ code: codeToSubmit, language: 52, verdict: finalVerdict, timeTaken: maxTime, memoryTaken: maxMem })
            });
            fetchSubmissions();
        } catch (error) { console.error("Failed to submit code:", error); setVerdict("Submission network error."); }
    }, [problemId, problem, updateStatus, fetchSubmissions]);

    const handleRunCustomInput = async () => {
        if (!problem) return;
        setIsRunning(true);
        try {
            const userOut = await codeOutput(code, customInput);
            const expectedOut = await codeOutput(problem.codeSolution, customInput);
            setCustomOutput({
                userOutput: userOut.stdout || userOut.stderr || userOut.compile_output || "No output",
                expectedOutput: expectedOut.stdout || expectedOut.stderr || expectedOut.compile_output || "No expected output"
            });
        } catch (error) { setCustomOutput({ userOutput: "Error running code.", expectedOutput: "Error running solution." }); }
        finally { setIsRunning(false); }
    };
    
    if (isLoading) return <LoadingSpinner />;
    if (!problem) return <ProblemNotFound />;

    const getStatusColors = (v) => {
        if (v === "Accepted") return `${colors.acceptedBg} ${colors.acceptedText}`;
        if (v === "Attempted" || v?.includes("Error") || v?.includes("Wrong")) return `${colors.errorBg} ${colors.errorText}`;
        return `${colors.unattemptedBg} ${colors.unattemptedText}`;
    };

    return (
        <div className={`min-h-screen ${colors.bgPrimary} ${colors.textPrimary} font-retro`}>
            {/* Enhanced Page Header */}
            <div className={`${colors.panelBg} border-b-4 ${colors.panelBorder} px-6 py-3`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center max-w-8xl mx-auto gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 border-2 ${colors.panelBorder} ${colors.unattemptedBg}`}>
                            <h1 className={`text-2xl md:text-3xl ${colors.textTitle} font-bold tracking-wide`}>{problem.title}</h1>
                        </div>
                        <span className={`text-base md:text-lg px-3 py-1 border-2 ${colors.panelBorder} ${getStatusColors(status)}`}>
                            {status.toUpperCase()}
                        </span>
                    </div>
                    <div className={`text-base md:text-lg px-4 py-2 border-2 ${colors.panelBorder} ${colors.unattemptedBg}`}>
                        DIFFICULTY:{" "}
                        <span className={`font-bold ${problem.difficulty === "Easy" ? "text-green-700" : problem.difficulty === "Medium" ? "text-amber-700" : "text-red-700"}`}>
                            {problem.difficulty?.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Enhanced Main Content */}
            <div className="flex flex-col lg:flex-row p-4 gap-4 max-w-8xl mx-auto min-h-[calc(100vh-112px)]">
                {/* Left Panel */}
                <div className={`lg:w-1/2 flex flex-col border-4 ${colors.panelBorder} shadow-chunky ${colors.panelBg} relative`}>
                    <div className={`flex flex-wrap border-b-4 ${colors.panelBorder}`}>
                        {["problem", "submissions", "solutions", "run code"].map(tabName => (
                            <button
                                key={tabName}
                                className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border-r-4 last:border-r-0 ${colors.panelBorder} transition-colors relative
                                    ${activeTab === tabName.replace(' ', '-') 
                                        ? `${colors.tabActiveBg} ${colors.tabActiveText} font-bold border-b-4 border-transparent` 
                                        : `${colors.tabInactiveBg} ${colors.tabInactiveText} ${colors.tabHoverBg}`}`}
                                onClick={() => {
                                    const formattedTabName = tabName.replace(' ', '-');
                                    setActiveTab(formattedTabName);
                                    if (formattedTabName === "solutions" && solutions.length === 0 && !isSolutionsLoading) fetchAllSolutions();
                                }}
                            >
                                {tabName.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-stone-200">
                        {activeTab === "problem" && <ProblemDescriptionTab problem={problem} />}
                        {activeTab === "submissions" && <ProblemSubmissionsTab submissions={submissions} isLoading={isSubmissionsLoading} onSelectSubmission={setSelectedSubmission} selectedSubmission={selectedSubmission} />}
                        {activeTab === "solutions" && <ProblemSolutionsTab solutions={solutions} isLoading={isSolutionsLoading} onSelectSolution={setSelectedSolution} selectedSolution={selectedSolution} />}
                        {activeTab === "run-code" && <RunCodeTab customInput={customInput} setCustomInput={setCustomInput} customOutput={customOutput} handleRun={handleRunCustomInput} isRunning={isRunning} />}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="lg:w-1/2 flex flex-col gap-4 h-full">
                    <div className={`flex-1 border-4 ${colors.panelBorder} shadow-chunky overflow-hidden flex flex-col ${colors.panelBg}`}>
                        <div className={`p-3 border-b-4 ${colors.panelBorder} flex justify-between items-center`}>
                            <h2 className="text-xl font-bold">CODE EDITOR</h2>
                            <div className={`text-sm px-2 py-1 border ${colors.panelBorder} ${colors.unattemptedBg}`}>C++</div>
                        </div>
                        <div className="flex-1 min-h-[300px]">
                            <SubmissionCodeEditor 
                                initialCode={code} 
                                language="cpp" 
                                onCodeChange={setCode} 
                                theme={"light"}
                                editorStyle={{
                                    fontFamily: '"Fira Code", monospace',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}
                            />
                        </div>
                    </div>
                    <div className={`border-4 ${colors.panelBorder} shadow-chunky flex flex-col sm:flex-row items-center justify-between p-3 gap-3 ${colors.panelBg}`}>
                        <div className={`w-full sm:w-2/3 text-center p-2 border-2 ${colors.panelBorder} ${verdict ? getStatusColors(verdict) : colors.unattemptedBg}`}>
                            <span className="font-bold">VERDICT: </span>
                            {verdict ? verdict.toUpperCase() : "AWAITING SUBMISSION"}
                        </div>
                        <Button onClick={() => handleCodeSubmit(code)} className="w-full sm:w-auto">SUBMIT</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Tab Components ---

function ProblemDescriptionTab({ problem }) {
    const colors = pastelRetroColors;
    const SectionHeader = ({ children }) => (
        <h3 className={`p-2 border-y-2 ${colors.panelBorder} ${colors.sectionHeaderBg} font-bold text-lg`}>{children}</h3>
    );
    
    return (
        <div className="space-y-5">
            <div className="prose prose-stone max-w-none text-justify">
                <MathjaxRenderer html={problem.statement} />
            </div>
            
            <div className={`border-2 ${colors.panelBorder}`}>
                <SectionHeader>INPUT / OUTPUT FORMAT</SectionHeader>
                <div className="p-3 grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-bold mb-1">Input</h4>
                        <div className={`p-3 border-2 ${colors.panelBorder} ${colors.inputBg} text-sm`}>
                            <MathjaxRenderer html={problem.inputFormat} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Output</h4>
                        <div className={`p-3 border-2 ${colors.panelBorder} ${colors.inputBg} text-sm`}>
                            <MathjaxRenderer html={problem.outputFormat} />
                        </div>
                    </div>
                </div>
            </div>
            
            {problem.testCases.filter(tc => tc.visible).map((testCase, index) => (
                <div key={index} className={`border-2 ${colors.panelBorder}`}>
                    <SectionHeader>SAMPLE {index + 1}</SectionHeader>
                    <div className="p-3">
                        {testCase.explanation && (
                            <p className="mb-3 italic text-sm bg-amber-50 p-2 border-l-4 border-amber-300">
                                {testCase.explanation}
                            </p>
                        )}
                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <h4 className="font-bold mb-1">Input</h4>
                                <pre className={`p-3 text-sm whitespace-pre-wrap ${colors.codeBg} ${colors.codeText} border-2 ${colors.panelBorder}`}>
                                    {testCase.input}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-bold mb-1">Output</h4>
                                <pre className={`p-3 text-sm whitespace-pre-wrap ${colors.codeBg} ${colors.codeText} border-2 ${colors.panelBorder}`}>
                                    {testCase.output?.stdout}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function RunCodeTab({ customInput, setCustomInput, customOutput, handleRun, isRunning }) {
    const colors = pastelRetroColors;
    return (
        <div className="space-y-4">
            <div>
                <label className="block mb-2 font-bold">CUSTOM INPUT</label>
                <textarea 
                    rows={4}
                    className={`w-full p-3 border-2 ${colors.panelBorder} resize-none focus:outline-none ${colors.inputBg} text-sm font-mono`} 
                    value={customInput} 
                    onChange={(e) => setCustomInput(e.target.value)} 
                    placeholder="Enter custom input here..." 
                />
            </div>
            <div className="flex justify-end">
                <Button 
                    onClick={handleRun} 
                    disabled={isRunning} 
                    type="secondary"
                    className="w-full md:w-auto"
                >
                    {isRunning ? "RUNNING..." : "RUN CODE"}
                </Button>
            </div>
            {customOutput && (
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-bold">YOUR OUTPUT</label>
                        <pre className={`p-3 min-h-[100px] border-2 ${colors.panelBorder} ${colors.codeBg} ${colors.codeText} text-sm font-mono overflow-auto`}>
                            {customOutput.userOutput}
                        </pre>
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">EXPECTED OUTPUT</label>
                        <pre className={`p-3 min-h-[100px] border-2 ${colors.panelBorder} ${colors.codeBg} ${colors.codeText} text-sm font-mono overflow-auto`}>
                            {customOutput.expectedOutput}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProblemSubmissionsTab({ submissions, isLoading, onSelectSubmission, selectedSubmission }) {
    const colors = pastelRetroColors;
    const getStatusColors = (v) => v === "Accepted" ? `${colors.acceptedBg} ${colors.acceptedText}` : `${colors.errorBg} ${colors.errorText}`;

    if (isLoading) return <div className="text-center p-6 text-xl">LOADING...</div>;
    if (selectedSubmission) {
        return (
            <div className="space-y-6">
                <Button onClick={() => onSelectSubmission(null)} type="secondary" small>BACK TO LIST</Button>
                <div className={`p-4 border-2 ${colors.panelBorder} ${getStatusColors(selectedSubmission.verdict)}`}>STATUS: {selectedSubmission.verdict.toUpperCase()}</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 border-2 ${colors.panelBorder} ${colors.inputBg}`}>RUNTIME: {selectedSubmission.timeTaken} MS</div>
                    <div className={`p-4 border-2 ${colors.panelBorder} ${colors.inputBg}`}>MEMORY: {selectedSubmission.memoryTaken} KB</div>
                </div>
                <h3 className="font-bold text-lg">SUBMITTED CODE</h3>
                <pre className={`p-4 overflow-x-auto border-2 ${colors.panelBorder} ${colors.codeBg} ${colors.codeText} text-sm`}>{selectedSubmission.code}</pre>
            </div>
        );
    }
    if (submissions.length === 0) return <div className="text-center p-6 text-xl">NO SUBMISSIONS YET</div>;

    return (
        <table className="w-full text-left">
            <thead className={`${colors.tabInactiveBg}`}>
                <tr className={`border-b-2 ${colors.panelBorder}`}>
                    <th className="p-3">TIME</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">RUNTIME</th>
                    <th className="p-3">ACTION</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((sub, i) => (
                    <tr key={i} className={`border-b ${colors.panelBorder} last:border-b-0 hover:bg-amber-100`}>
                        <td className="p-3 text-sm">{formatToDDMMYYYY(sub.submissionTime)}</td>
                        <td className="p-3">
                            <span className={`px-3 py-1 text-xs border ${colors.panelBorder} ${getStatusColors(sub.verdict)}`}>
                                {sub.verdict.toUpperCase()}
                            </span>
                        </td>
                        <td className="p-3 text-sm">{sub.timeTaken} MS</td>
                        <td className="p-3">
                            <Button onClick={() => onSelectSubmission(sub)} type="secondary" small>VIEW</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ProblemSolutionsTab({ solutions, isLoading, onSelectSolution, selectedSolution }) {
    const colors = pastelRetroColors;
    if (isLoading) return <div className="text-center p-6 text-xl">LOADING...</div>;
    if (selectedSolution) {
        return (
            <div className="space-y-6">
                <Button onClick={() => onSelectSolution(null)} type="secondary" small>BACK TO LIST</Button>
                <div className={`p-4 border-2 ${colors.panelBorder} ${colors.inputBg}`}>USER: {selectedSolution.userId?.username}</div>
                <h3 className="font-bold text-lg">SOLUTION CODE</h3>
                <pre className={`p-4 overflow-x-auto border-2 ${colors.panelBorder} ${colors.codeBg} ${colors.codeText} text-sm`}>{selectedSolution.code}</pre>
            </div>
        );
    }
    if (solutions.length === 0) return <div className="text-center p-6 text-xl">NO COMMUNITY SOLUTIONS</div>;

    return (
        <table className="w-full text-left">
            <thead className={`${colors.tabInactiveBg}`}>
                <tr className={`border-b-2 ${colors.panelBorder}`}>
                    <th className="p-3">USER</th>
                    <th className="p-3">LANGUAGE</th>
                    <th className="p-3">RUNTIME</th>
                    <th className="p-3">ACTION</th>
                </tr>
            </thead>
            <tbody>
                {solutions.map((sol, i) => (
                    <tr key={i} className={`border-b ${colors.panelBorder} last:border-b-0 hover:bg-amber-100`}>
                        <td className="p-3 text-sm">{sol.userId?.username || 'Anonymous'}</td>
                        <td className="p-3 text-sm">{sol.language?.toUpperCase()}</td>
                        <td className="p-3 text-sm">{sol.timeTaken} MS</td>
                        <td className="p-3">
                            <Button onClick={() => onSelectSolution(sol)} type="secondary" small>VIEW</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}