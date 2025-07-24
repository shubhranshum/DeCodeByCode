import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiEdit, FiPlus, FiCode, FiFileText, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// --- Data Fetching ---
import { getProblemBySlug } from "../../Tasks/getProblemBySlug.jsx";
import SubmissionCodeEditor from "../../Tasks/submissionCodeEditor.jsx";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonDangerBg: "bg-rose-400 hover:bg-rose-500",
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary', isSubmit = false }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : type === 'danger' ? retroThemeColors.buttonDangerBg : retroThemeColors.buttonSecondaryBg;
    return <button type={isSubmit ? "submit" : "button"} onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>{children}</button>;
};

const RetroCard = ({ children, className = '' }) => <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>{children}</div>;
const FormInput = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label className="block text-base mb-1.5 font-bold">{label}</label>
        <input name={name} value={value} onChange={onChange} className={`w-full p-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`} {...props} />
    </div>
);
const FormTextarea = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label className="block text-base mb-1.5 font-bold">{label}</label>
        <textarea name={name} value={value} onChange={onChange} className={`w-full p-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none resize-none`} {...props} />
    </div>
);

// --- Section Components ---
const GeneralInfoSection = ({ generalInfo, setGeneralInfo, onSave }) => (
    <RetroCard className="p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">General Information</h2>
            <Button onClick={onSave}>Save Changes</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Time Limit (s)" name="timeLimit" type="number" value={generalInfo.timeLimit} onChange={(e) => setGeneralInfo(p => ({...p, timeLimit: e.target.value}))} />
            <FormInput label="Memory Limit (MB)" name="memoryLimit" type="number" value={generalInfo.memoryLimit} onChange={(e) => setGeneralInfo(p => ({...p, memoryLimit: e.target.value}))} />
            <FormInput label="Difficulty" name="difficulty" value={generalInfo.difficulty} onChange={(e) => setGeneralInfo(p => ({...p, difficulty: e.target.value}))} />
        </div>
    </RetroCard>
);

const StatementSection = ({ statement, setStatement, onSave }) => {
    const [preview, setPreview] = useState(statement);

    useEffect(() => {
        const handler = setTimeout(() => {
            setPreview(statement);
            if (window.MathJax) {
                window.MathJax.typesetPromise();
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [statement]);
    
    const handleStatementChange = (e) => {
        const { name, value } = e.target;
        setStatement(p => ({...p, [name]: value}));
    };

    const renderPreview = (htmlContent) => (
        <div className={`p-3 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} min-h-[6rem] prose prose-sm max-w-none`}>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );

    return (
        <RetroCard className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Problem Statement</h2>
                <Button onClick={onSave}>Save Statement</Button>
            </div>
            <div className="space-y-6">
                <FormInput label="Title*" name="title" value={statement.title} onChange={handleStatementChange} required />
                
                <div className="space-y-2">
                    <label className="block text-base font-bold">Statement*</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextarea name="statement" value={statement.statement} onChange={handleStatementChange} rows={10} placeholder="Use $$...$$ for block and $...$ for inline math."/>
                        {renderPreview(preview.statement)}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-base font-bold">Input Format</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextarea name="inputFormat" value={statement.inputFormat} onChange={handleStatementChange} rows={6} />
                        {renderPreview(preview.inputFormat)}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-base font-bold">Output Format</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextarea name="outputFormat" value={statement.outputFormat} onChange={handleStatementChange} rows={6} />
                        {renderPreview(preview.outputFormat)}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-base font-bold">Notes</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextarea name="notes" value={statement.notes} onChange={handleStatementChange} rows={4} />
                        {renderPreview(preview.notes)}
                    </div>
                </div>
            </div>
        </RetroCard>
    );
};

const TestCaseSection = ({ testCases, setTestCases, onSave }) => {
    // FIX: Initialize output as an object to match the schema
    const [newTestCase, setNewTestCase] = useState({ input: '', output: { stdout: '' }, visible: true, explanation: '' });

    const handleAddTestCase = () => {
        // FIX: Check the stdout property of the output object
        if (!newTestCase.input.trim() || !newTestCase.output.stdout.trim()) {
            toast.error("Input and Output fields cannot be empty.");
            return;
        }
        setTestCases([...testCases, newTestCase]);
        // FIX: Reset with the correct object structure
        setNewTestCase({ input: '', output: { stdout: '' }, visible: true, explanation: '' });
    };

    const handleRemoveTestCase = (index) => {
        setTestCases(testCases.filter((_, i) => i !== index));
    };

    return (
        <RetroCard className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Test Cases</h2>
                <Button onClick={onSave}>Save All Test Cases</Button>
            </div>
            <div className="space-y-6">
                {testCases.map((tc, index) => (
                    <div key={index} className={`p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50 relative`}>
                        <h3 className="font-bold mb-2">Test Case {index + 1} {tc.visible && "(Sample)"}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* FIX: Display tc.output.stdout for existing cases */}
                            <FormTextarea label="Input" value={tc.input} readOnly rows={4} />
                            <FormTextarea label="Output" value={tc.output?.stdout || tc.output} readOnly rows={4} />
                        </div>
                        <Button onClick={() => handleRemoveTestCase(index)} type="danger" small className="absolute top-2 right-2"><FiTrash2 /></Button>
                    </div>
                ))}
                <div className={`p-4 border-2 border-dashed ${retroThemeColors.panelBorder}`}>
                    <h3 className="text-xl font-bold mb-4">Add New Test Case</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormTextarea label="Input*" name="input" value={newTestCase.input} onChange={(e) => setNewTestCase({...newTestCase, input: e.target.value})} rows={4} />
                        {/* FIX: Bind to newTestCase.output.stdout */}
                        <FormTextarea label="Output*" name="output" value={newTestCase.output.stdout} onChange={(e) => setNewTestCase({...newTestCase, output: { stdout: e.target.value }})} rows={4} />
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={newTestCase.visible} onChange={(e) => setNewTestCase({...newTestCase, visible: e.target.checked})} className="w-5 h-5" /> Is Sample Case?</label>
                        <Button onClick={handleAddTestCase} type="secondary">Add Test Case</Button>
                    </div>
                </div>
            </div>
        </RetroCard>
    );
};

const CodeSolutionSection = ({ codeSolution, setCodeSolution, onSave }) => (
    <RetroCard className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Code Solution</h2>
            <Button onClick={onSave}>Save Solution</Button>
        </div>
        <div className="flex-grow border-2 border-stone-800">
            <SubmissionCodeEditor language="cpp" initialCode={codeSolution} onCodeChange={setCodeSolution} />
        </div>
    </RetroCard>
);


// ================
// MAIN COMPONENT
// ================
export default function EditProblemSection() {
    const { problemSlug } = useParams();
    const [activeSection, setActiveSection] = useState("statement");
    const [problemId, setProblemId] = useState(null);
    const [generalInfo, setGeneralInfo] = useState({ timeLimit: 1, memoryLimit: 256 });
    const [statement, setStatement] = useState({ title: "", statement: "", inputFormat: "", outputFormat: "", notes: "" });
    const [testCases, setTestCases] = useState([]);
    const [codeSolution, setCodeSolution] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- LOGIC (Functionality Unchanged) ---
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
        script.async = true;
        document.head.appendChild(script);
        window.MathJax = { tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] } };
        return () => { document.head.removeChild(script); };
    }, []);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const data = await getProblemBySlug(problemSlug);
                setProblemId(data._id);
                setGeneralInfo({ timeLimit: data.timeLimit || 1, memoryLimit: data.memoryLimit || 256, difficulty: data.difficulty || "" });
                setStatement({ title: data.title || "", statement: data.statement || "", inputFormat: data.inputFormat || "", outputFormat: data.outputFormat || "", notes: data.notes || "" });
                setTestCases(data.testCases || []);
                setCodeSolution(data.codeSolution || "");
            } catch (err) { setError(err.message); } 
            finally { setLoading(false); }
        };
        fetchProblem();
    }, [problemSlug]);

    const handleSave = async (sectionData) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/edit-problem/${problemId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sectionData),
                credentials: "include",
            });
            if (!response.ok) throw new Error(`Failed to save ${activeSection}`);
            toast.success(`${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} saved successfully!`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-retro text-2xl">Loading Problem Editor...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center font-retro text-2xl text-rose-500">{error}</div>;

    return (
        <div className={`min-h-screen flex ${retroThemeColors.bgPrimary} font-retro`}>
            <aside className={`w-64 p-6 border-r-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg}`}>
                <h2 className="text-2xl font-bold mb-6">Edit Sections</h2>
                <div className="space-y-4">
                    <Button onClick={() => setActiveSection("general")} type={activeSection === 'general' ? 'primary' : 'secondary'} className="w-full justify-start"><FiEdit className="mr-2" /> General</Button>
                    <Button onClick={() => setActiveSection("statement")} type={activeSection === 'statement' ? 'primary' : 'secondary'} className="w-full justify-start"><FiFileText className="mr-2" /> Statement</Button>
                    <Button onClick={() => setActiveSection("code")} type={activeSection === 'code' ? 'primary' : 'secondary'} className="w-full justify-start"><FiCode className="mr-2" /> Solution</Button>
                    <Button onClick={() => setActiveSection("testcase")} type={activeSection === 'testcase' ? 'primary' : 'secondary'} className="w-full justify-start"><FiPlus className="mr-2" /> Test Cases</Button>
                </div>
            </aside>

            <main className="flex-1 p-8">
                {activeSection === "general" && <GeneralInfoSection generalInfo={generalInfo} setGeneralInfo={setGeneralInfo} onSave={() => handleSave(generalInfo)} />}
                {activeSection === "statement" && <StatementSection statement={statement} setStatement={setStatement} onSave={() => handleSave(statement)} />}
                {activeSection === "code" && <CodeSolutionSection codeSolution={codeSolution} setCodeSolution={setCodeSolution} onSave={() => handleSave({ codeSolution })} />}
                {activeSection === "testcase" && <TestCaseSection testCases={testCases} setTestCases={setTestCases} onSave={() => handleSave({ testCases: testCases })} />}
            </main>
        </div>
    );
}
