import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import SubmissionCodeEditor from "../Tasks/submissionCodeEditor.jsx";
import codeOutput from "../Tasks/output.jsx";
import MathjaxRenderer from "../MathjaxRenderer";
import { getContestBySlug } from '../Tasks/getContestBySlug';
import { getProblemBySlug } from '../Tasks/getProblemBySlug';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-purple-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-purple-400 hover:bg-purple-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
    codeBg: "bg-stone-800",
    codeText: "text-stone-100",
    success: "text-emerald-600",
    successBg: "bg-emerald-200",
    danger: "text-rose-600",
    dangerBg: "bg-rose-200",
    attempted: "text-amber-600",
    attemptedBg: "bg-amber-200",
    unattemptedBg: "bg-stone-200",
    tabActiveBg: "bg-white",
    difficulty: {
        Easy: "bg-emerald-200 text-emerald-800",
        Medium: "bg-amber-200 text-amber-800",
        Hard: "bg-rose-200 text-rose-800",
    },
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2`;
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>{children}</button>;
};

const RetroCard = ({ children, className = '' }) => <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>{children}</div>;
const TabButton = ({ children, isActive, onClick }) => <button onClick={onClick} className={`flex-1 p-3 text-lg border-r-2 last:border-r-0 ${retroThemeColors.panelBorder} transition-colors ${isActive ? `${retroThemeColors.tabActiveBg} ${retroThemeColors.textAccent}` : `${retroThemeColors.buttonSecondaryBg} ${retroThemeColors.textPrimary} hover:bg-stone-300`}`}>{children}</button>;

// --- Page Specific Components ---
const LoadingState = () => <div className={`flex items-center justify-center min-h-screen font-retro ${retroThemeColors.bgPrimary}`}><div className="text-center"><div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${retroThemeColors.panelBorder} mx-auto`}></div><p className={`mt-5 text-xl font-bold ${retroThemeColors.textPrimary}`}>Loading Problem...</p></div></div>;
const ErrorState = ({ message }) => <div className={`flex items-center justify-center min-h-screen font-retro ${retroThemeColors.bgPrimary}`}><RetroCard className="text-center p-8"><p className={`text-xl font-bold ${retroThemeColors.danger} mb-4`}>{message}</p><Link to="/contests" className="text-lg text-purple-600 hover:underline">&larr; Back to Contests</Link></RetroCard></div>;
const formatDuration = (ms) => new Date(ms).toISOString().substr(11, 8);

// --- Submissions Tab Component ---
const ContestSubmissionsTab = ({ submissions, isLoading, onSelectSubmission, selectedSubmission }) => {
    if (isLoading) {
        return <div className="text-center p-6 text-lg">Loading Submissions...</div>;
    }

    if (selectedSubmission) {
        return (
            <div className="space-y-4 text-sm">
                <Button onClick={() => onSelectSubmission(null)} type="secondary" small> &larr; Back to List</Button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className={`p-3 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg}`}>
                        <p className="text-xs text-stone-500 mb-1">Status</p>
                        <p className={`font-bold text-base ${selectedSubmission.verdict === "Accepted" ? retroThemeColors.success : retroThemeColors.danger}`}>{selectedSubmission.verdict}</p>
                    </div>
                    <div className={`p-3 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg}`}>
                        <p className="text-xs text-stone-500 mb-1">Runtime</p>
                        <p className="font-bold text-base">{selectedSubmission.timeTaken || 'N/A'} ms</p>
                    </div>
                    <div className={`p-3 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg}`}>
                        <p className="text-xs text-stone-500 mb-1">Memory</p>
                        <p className="font-bold text-base">{selectedSubmission.memoryTaken || 'N/A'} KB</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Submitted Code</h3>
                    <pre className={`p-3 text-xs whitespace-pre-wrap ${retroThemeColors.codeBg} ${retroThemeColors.codeText}`}>{selectedSubmission.code}</pre>
                </div>
            </div>
        );
    }
    
    if (submissions.length === 0) {
        return <div className="text-center p-6 text-lg">No submissions yet.</div>;
    }

    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-stone-200">
                <tr>
                    <th className={`p-2 border-b-2 border-r-2 ${retroThemeColors.panelBorder}`}>Time</th>
                    <th className={`p-2 border-b-2 border-r-2 ${retroThemeColors.panelBorder}`}>Status</th>
                    <th className={`p-2 border-b-2 border-r-2 ${retroThemeColors.panelBorder}`}>Runtime</th>
                    <th className={`p-2 border-b-2 ${retroThemeColors.panelBorder}`}>Action</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((sub, i) => (
                    <tr key={i} className={`border-b ${retroThemeColors.panelBorder} last:border-b-0`}>
                        <td className="p-2 border-r-2 border-stone-800">{formatDuration(sub.timeFromStart)}</td>
                        <td className="p-2 border-r-2 border-stone-800">
                            <span className={`px-2 py-0.5 text-xs border ${retroThemeColors.panelBorder} ${sub.verdict === "Accepted" ? retroThemeColors.successBg + ' ' + retroThemeColors.success : retroThemeColors.dangerBg + ' ' + retroThemeColors.danger}`}>
                                {sub.verdict}
                            </span>
                        </td>
                        <td className="p-2 border-r-2 border-stone-800">{sub.timeTaken} ms</td>
                        <td className="p-2"><Button onClick={() => onSelectSubmission(sub)} small type="secondary">View</Button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


// ================
// MAIN COMPONENT
// ================
export default function ContestProblem() {
    const { contestSlug, problemSlug } = useParams();
    const [problem, setProblem] = useState(null);
    const [contestId, setContestId] = useState(null);
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
    const problemId = problem?._id;
    const STATUS_RANK = { Unattempted: 0, Attempted: 1, Accepted: 2 };

    // --- Core Logic Hooks (Functionality Unchanged) ---
    useEffect(() => {
        const fetchContestAndProblemData = async () => {
            setIsLoading(true);
            try {
                const contestData = await getContestBySlug(contestSlug);
                if (!contestData) throw new Error("Contest not found.");
                setContestId(contestData._id);

                const problemData = await getProblemBySlug(problemSlug);
                if (!problemData) throw new Error("Problem not found.");
                
                if (!contestData.Problems.some(p => p._id === problemData._id)) {
                    throw new Error("Problem does not belong to this contest.");
                }
                setProblem(problemData);
            } catch (err) { 
                console.error(err);
                setProblem(null); 
            } 
            finally { setIsLoading(false); }
        };
        fetchContestAndProblemData();
    }, [contestSlug, problemSlug]);

    const updateStatus = useCallback((newStatus) => {
        if (!problemId) return;
        const key = `status-${problemId}`;
        const prev = localStorage.getItem(key) || "Unattempted";
        if (STATUS_RANK[newStatus] > STATUS_RANK[prev]) {
            localStorage.setItem(key, newStatus);
            setStatus(newStatus);
        }
    }, [problemId, STATUS_RANK]);

    const fetchSubmissions = useCallback(async () => {
        if (!contestId || !problemId) return;
        setIsSubmissionsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/contests/${contestId}/submissions/${problemId}`, { credentials: "include" });
            const data = await res.json();
            setSubmissions(data);
        } catch (err) {
            console.error("Failed to load submissions:", err);
            setSubmissions([]);
        } finally {
            setIsSubmissionsLoading(false);
        }
    }, [contestId, problemId]);

    useEffect(() => {
        if (contestId && problemId) {
            fetchSubmissions();
            const savedStatus = localStorage.getItem(`status-${problemId}`) || "Unattempted";
            setStatus(savedStatus);
        }
    }, [contestId, problemId, fetchSubmissions]);

    useEffect(() => {
        if (isSubmissionsLoading) return;
        if (!submissions.length) updateStatus("Unattempted");
        else if (submissions.some(s => s.verdict === "Accepted")) updateStatus("Accepted");
        else updateStatus("Attempted");
    }, [submissions, isSubmissionsLoading, updateStatus]);
    
    const handleCodeSubmit = useCallback(async (codeToSubmit) => {
        if (!contestId || !problemId || !problem) return;
        setVerdict("Running...");
        let isCorrect = true, finalVerdict = "Accepted", maxTime = 0, maxMem = 0;
        for (let i = 0; i < problem.testCases.length; i++) {
            const tc = problem.testCases[i];
            const out = await codeOutput(codeToSubmit, tc.input, tc.output.stdout);
            maxTime = Math.max(maxTime, Number(out.time || 0));
            maxMem = Math.max(maxMem, Number(out.memory || 0));
            if (out.status_id !== 3 || out.stderr || out.compile_output) {
                isCorrect = false;
                finalVerdict = out.stderr ? `Runtime Error` : out.compile_output ? `Compilation Error` : `${out.status?.description || "Wrong Answer"}`;
                break;
            }
        }
        updateStatus(isCorrect ? "Accepted" : "Attempted");
        setVerdict(finalVerdict);
        try {
            await fetch(`http://localhost:3000/contests/${contestId}/problems/${problemId}/submit`, {
                method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
                body: JSON.stringify({ code: codeToSubmit, language: 52, verdict: finalVerdict, timeTaken: maxTime, memoryTaken: maxMem })
            });
            fetchSubmissions();
        } catch (error) { setVerdict("Submission network error."); }
    }, [contestId, problemId, problem, updateStatus, fetchSubmissions]);

    const handleRunCustomInput = async () => {
        if (!problem) return;
        setIsRunning(true);
        setCustomOutput(null);
        try {
            const userOut = await codeOutput(code, customInput);
            const expectedOut = await codeOutput(problem.codeSolution, customInput);
            setCustomOutput({
                userOutput: userOut.stdout || userOut.stderr || userOut.compile_output || "No output",
                expectedOutput: expectedOut.stdout || expectedOut.stderr || expectedOut.compile_output || "No expected output"
            });
        } catch (error) {
            setCustomOutput({ userOutput: "Error running code.", expectedOutput: "Error running solution." });
        } finally {
            setIsRunning(false);
        }
    };
    
    if (isLoading) return <LoadingState />;
    if (!problem) return <ErrorState message="Problem Not Found" />;

    const getStatusStyle = (s) => {
        if (s === "Accepted") return `${retroThemeColors.successBg} ${retroThemeColors.success}`;
        if (s === "Attempted") return `${retroThemeColors.attemptedBg} ${retroThemeColors.attempted}`;
        return `${retroThemeColors.unattemptedBg} ${retroThemeColors.textSecondary}`;
    };

    return (
        <div className={`min-h-screen ${retroThemeColors.bgPrimary} font-retro`}>
            <div className={`p-4 border-b-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{problem.title}</h1>
                        <div className="flex items-center mt-2 gap-4">
                            <span className={`px-3 py-1 text-sm border-2 ${retroThemeColors.panelBorder} ${getStatusStyle(status)}`}>{status}</span>
                            <span className={`px-3 py-1 text-sm border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.difficulty[problem.difficulty] || ''}`}>{problem.difficulty}</span>
                        </div>
                    </div>
                     <Link to={`/contests/${contestSlug}`} className="text-lg hover:underline">&larr; Back to Contest</Link>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row p-4 gap-6 max-w-7xl mx-auto">
                {/* Left Panel */}
                <div className="lg:w-1/2 flex flex-col h-[calc(100vh-120px)]">
                    <RetroCard className="flex-1 flex flex-col">
                        <div className="flex border-b-4 border-stone-800">
                            <TabButton isActive={activeTab === "problem"} onClick={() => setActiveTab("problem")}>Description</TabButton>
                            <TabButton isActive={activeTab === "submissions"} onClick={() => setActiveTab("submissions")}>Submissions</TabButton>
                            <TabButton isActive={activeTab === "run-code"} onClick={() => setActiveTab("run-code")}>Run Code</TabButton>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                           {activeTab === "problem" && (
                               <div className="space-y-6 text-sm">
                                   <section>
                                       <h2 className="text-xl font-bold mb-2">Problem Statement</h2>
                                       <div className="prose prose-sm max-w-none"><MathjaxRenderer html={problem.statement} /></div>
                                   </section>
                                   <section>
                                       <h2 className="text-xl font-bold mb-2">Input Format</h2>
                                       <div className={`p-3 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg}`}><MathjaxRenderer html={problem.inputFormat} /></div>
                                   </section>
                                   <section>
                                       <h2 className="text-xl font-bold mb-2">Output Format</h2>
                                       <div className={`p-3 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg}`}><MathjaxRenderer html={problem.outputFormat} /></div>
                                   </section>
                                   {problem.testCases.filter(tc => tc.visible).map((tc, i) => (
                                       <section key={i}>
                                            <h2 className="text-xl font-bold mb-2">Sample {i + 1}</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="font-bold mb-1">Input</h3>
                                                    <pre className={`p-3 text-xs whitespace-pre-wrap ${retroThemeColors.codeBg} ${retroThemeColors.codeText}`}>{tc.input}</pre>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold mb-1">Output</h3>
                                                    <pre className={`p-3 text-xs whitespace-pre-wrap ${retroThemeColors.codeBg} ${retroThemeColors.codeText}`}>{tc.output?.stdout}</pre>
                                                </div>
                                            </div>
                                       </section>
                                   ))}
                               </div>
                           )}
                           {activeTab === 'submissions' && (
                                <ContestSubmissionsTab
                                    submissions={submissions}
                                    isLoading={isSubmissionsLoading}
                                    onSelectSubmission={setSelectedSubmission}
                                    selectedSubmission={selectedSubmission}
                                />
                           )}
                            {activeTab === 'run-code' && (
                                <div className="space-y-4">
                                    <label className="text-lg font-bold">Custom Input</label>
                                    <textarea rows={5} value={customInput} onChange={(e) => setCustomInput(e.target.value)} className={`w-full p-2 text-sm border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg}`} />
                                    <Button onClick={handleRunCustomInput} disabled={isRunning} type="secondary" small>{isRunning ? "Running..." : "Run Code"}</Button>
                                    {customOutput && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-bold mb-1">Your Output</h3>
                                                <pre className={`p-3 text-xs min-h-[100px] ${retroThemeColors.codeBg} ${retroThemeColors.codeText}`}>{customOutput.userOutput}</pre>
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">Expected Output</h3>
                                                <pre className={`p-3 text-xs min-h-[100px] ${retroThemeColors.codeBg} ${retroThemeColors.codeText}`}>{customOutput.expectedOutput}</pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                           )}
                        </div>
                    </RetroCard>
                </div>

                {/* Right Panel */}
                <div className="lg:w-1/2 flex flex-col gap-4 h-[calc(100vh-120px)]">
                    <RetroCard className="flex-1 flex flex-col">
                        <div className={`p-3 border-b-4 ${retroThemeColors.panelBorder}`}><h2 className="text-xl font-bold">Code Editor</h2></div>
                        <div className="flex-1 p-2">
                             <SubmissionCodeEditor language="cpp" onCodeChange={setCode} problemId={problemId} />
                        </div>
                    </RetroCard>
                    <RetroCard className="flex-shrink-0">
                         <div className={`p-3 border-b-4 ${retroThemeColors.panelBorder} flex justify-between items-center`}>
                            <h2 className="text-xl font-bold">Verdict</h2>
                            <Button onClick={() => handleCodeSubmit(code)} type="primary" small>Submit</Button>
                        </div>
                         <div className="p-4 font-mono text-center min-h-[6rem] flex items-center justify-center text-sm">
                            {verdict || "Submit your code to see the verdict."}
                         </div>
                    </RetroCard>
                </div>
            </div>
        </div>
    );
}
