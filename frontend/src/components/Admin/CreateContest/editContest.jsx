import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiEdit, FiPlus, FiClock, FiLock, FiUnlock, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Data Fetching ---
import { getAdminContestBySlug } from "../../Tasks/getAdminContestBySlug.jsx";
import { getProblemById } from "../../Tasks/getProblemById.jsx";

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

// ================
// MAIN COMPONENT
// ================
export default function ContestEditSection() {
    const { contestSlug } = useParams();
    const [activeSection, setActiveSection] = useState("general");
    const [contestId, setContestId] = useState(null);
    const [contest, setContest] = useState({ title: "", description: "", startTime: "", endTime: "", duration: 120, isPrivate: false, contestType: "ICPC" });
    const [problems, setProblems] = useState([]);
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [problemIdInput, setProblemIdInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- LOGIC (Functionality Unchanged) ---
    const formatForDatetimeLocalInput = (utcDateString) => {
        if (!utcDateString) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            return now.toISOString().slice(0, 16);
        }
        const date = new Date(utcDateString);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16);
    };

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const data = await getAdminContestBySlug(contestSlug);
                setContestId(data._id);
                setContest({
                    title: data.title || "",
                    description: data.description || "",
                    startTime: formatForDatetimeLocalInput(data.startTime),
                    endTime: formatForDatetimeLocalInput(data.endTime),
                    duration: data.duration || 120,
                    isPrivate: data.isPrivate || false,
                    contestType: data.contestType || "ICPC",
                });
                setProblems(data.Problems || []);
            } catch (err) { setError(err.message); } 
            finally { setLoading(false); }
        };
        fetchContest();
    }, [contestSlug]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setContest((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSaveChanges = async () => {
        try {
            const updatedContest = { ...contest, startTime: new Date(contest.startTime).toISOString(), endTime: new Date(new Date(contest.startTime).getTime() + contest.duration * 60000).toISOString() };
            const response = await fetch(`http://localhost:3000/admin/edit-contest/${contestId}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedContest), credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to update contest");
            toast.success("Contest updated successfully");
        } catch (error) { toast.error(error.message); }
    };

    const setProblemsForContest = async (problemIds) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/edit-contest/${contestId}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Problems: problemIds }), credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to update contest problems");
        } catch (error) { toast.error(error.message); }
    };

    const handleAddProblem = async () => {
        if (!problemIdInput.trim()) return toast.error("Please enter a problem ID");
        try {
            const problem = await getProblemById(problemIdInput.trim());
            if (!problem) return toast.error("Problem not found");
            if (problems.some(p => p._id === problem._id)) return toast.error("Problem already in contest");
            
            const updatedProblems = [...problems, { _id: problem._id, title: problem.title, difficulty: problem.difficulty }];
            setProblems(updatedProblems);
            await setProblemsForContest(updatedProblems.map(p => p._id));
            setProblemIdInput("");
            setShowProblemModal(false);
            toast.success("Problem added!");
        } catch (error) { toast.error("Failed to add problem."); }
    };

    const handleRemoveProblem = (problemId) => {
        const updatedProblems = problems.filter(p => p._id !== problemId);
        setProblems(updatedProblems);
        setProblemsForContest(updatedProblems.map(p => p._id));
        toast.info("Problem removed from contest");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-retro text-2xl">Loading Contest Editor...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center font-retro text-2xl text-rose-500">{error}</div>;

    return (
        <div className={`min-h-screen flex ${retroThemeColors.bgPrimary} font-retro`}>
            {/* Left Sidebar */}
            <aside className={`w-64 p-6 border-r-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg}`}>
                <h2 className="text-2xl font-bold mb-6">Edit Contest</h2>
                <div className="space-y-4">
                    <Button onClick={() => setActiveSection("general")} type={activeSection === 'general' ? 'primary' : 'secondary'} className="w-full justify-start"><FiEdit className="mr-2" /> General Info</Button>
                    <Button onClick={() => setActiveSection("problems")} type={activeSection === 'problems' ? 'primary' : 'secondary'} className="w-full justify-start"><FiPlus className="mr-2" /> Problems</Button>
                </div>
            </aside>

            {/* Right Content Area */}
            <main className="flex-1 p-8">
                {activeSection === "general" && (
                    <RetroCard className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">General Information</h2>
                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2"><FormInput label="Title*" name="title" value={contest.title} onChange={handleInputChange} required /></div>
                            <div className="md:col-span-2"><FormTextarea label="Description" name="description" value={contest.description} onChange={handleInputChange} rows={4} /></div>
                            <FormInput label="Start Time" name="startTime" type="datetime-local" value={contest.startTime} onChange={handleInputChange} />
                            <FormInput label="Duration (minutes)" name="duration" type="number" value={contest.duration} onChange={handleInputChange} />
                            <div>
                                <label className="block text-base mb-1.5 font-bold">Contest Type</label>
                                <select name="contestType" value={contest.contestType} onChange={handleInputChange} className={`w-full p-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`}>
                                    <option value="ICPC">ICPC</option>
                                    <option value="IOI">IOI</option>
                                    <option value="CF">Codeforces</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" name="isPrivate" checked={contest.isPrivate} onChange={handleInputChange} id="isPrivateCheckbox" className="w-5 h-5" />
                                <label htmlFor="isPrivateCheckbox" className="ml-2 flex items-center gap-2">{contest.isPrivate ? <FiLock /> : <FiUnlock />} Private Contest</label>
                            </div>
                        </div>
                    </RetroCard>
                )}
                
                {activeSection === "problems" && (
                    <RetroCard className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Contest Problems</h2>
                            <Button onClick={() => setShowProblemModal(true)}><FiPlus /> Add Problem</Button>
                        </div>
                        {problems.length === 0 ? (
                            <div className="text-center py-8 text-stone-500">No problems added yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-stone-200">
                                        <tr>
                                            <th className={`p-3 text-left border-b-2 border-r-2 ${retroThemeColors.panelBorder}`}>ID</th>
                                            <th className={`p-3 text-left border-b-2 border-r-2 ${retroThemeColors.panelBorder}`}>Title</th>
                                            <th className={`p-3 text-right border-b-2 ${retroThemeColors.panelBorder}`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {problems.map(p => (
                                            <tr key={p._id} className={`border-b ${retroThemeColors.panelBorder} last:border-b-0`}>
                                                <td className={`p-3 border-r-2 ${retroThemeColors.panelBorder}`}>{p._id}</td>
                                                <td className={`p-3 font-bold border-r-2 ${retroThemeColors.panelBorder}`}>{p.title}</td>
                                                <td className="p-3 text-right"><Button onClick={() => handleRemoveProblem(p._id)} small type="danger" className={retroThemeColors.buttonDangerBg}><FiTrash2 /></Button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </RetroCard>
                )}
            </main>

            {/* Add Problem Modal */}
            {showProblemModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <RetroCard className="p-6 w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4">Add Problem to Contest</h3>
                        <FormInput label="Problem ID" value={problemIdInput} onChange={(e) => setProblemIdInput(e.target.value)} placeholder="Enter problem ID..." autoFocus />
                        <div className="flex justify-end gap-3 mt-6">
                            <Button onClick={() => setShowProblemModal(false)} type="secondary">Cancel</Button>
                            <Button onClick={handleAddProblem}>Add Problem</Button>
                        </div>
                    </RetroCard>
                </div>
            )}
        </div>
    );
}
