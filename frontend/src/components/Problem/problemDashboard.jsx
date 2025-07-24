import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/navbar.jsx";
import { getAllGlobalProblems } from "../Tasks/getAllGlobalProblems.jsx";
import { Search, ChevronRight, FileText, CheckCircle, User, Clock, Flame, Trophy } from "lucide-react";

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
    potdBg: "bg-gradient-to-br from-amber-200 to-rose-300",
    difficulty: {
        Easy: "bg-emerald-200 text-emerald-800",
        Medium: "bg-amber-200 text-amber-800",
        Hard: "bg-rose-200 text-rose-800",
        "Veteran Decoder": "bg-purple-300 text-purple-900",
    },
};

// --- Reusable Retro UI Components ---
const Button = ({ children, onClick, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-5 py-2.5 text-lg';
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return (
        <button onClick={onClick} className={`border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] ${sizeStyle} ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const RetroCard = ({ children, className = '', ...props }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`} {...props}>
        {children}
    </div>
);

const DifficultyBadge = ({ difficulty }) => (
    <span className={`px-3 py-1 text-sm border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.difficulty[difficulty] || 'bg-stone-200 text-stone-800'}`}>
        {difficulty}
    </span>
);

// --- Page Specific Components ---
const ProblemOfTheDayCard = ({ problem, loading, onClick }) => {
    if (loading) {
        return (
            <RetroCard className="p-6 animate-pulse space-y-4">
                <div className="h-6 bg-stone-200 rounded w-3/4"></div>
                <div className="h-8 bg-stone-300 rounded w-full"></div>
                <div className="h-12 bg-stone-200 rounded w-full"></div>
            </RetroCard>
        );
    }

    if (!problem) {
        return (
             <RetroCard className="p-6 text-center">
                <Flame className={`h-12 w-12 mx-auto mb-4 ${retroThemeColors.textSecondary}`} />
                <h3 className="text-2xl font-bold">No Problem of the Day</h3>
                <p className={`mt-2 ${retroThemeColors.textSecondary}`}>Check back tomorrow for a new challenge!</p>
            </RetroCard>
        )
    }

    return (
        <RetroCard className={`p-6 ${retroThemeColors.potdBg}`}>
            <div className="flex items-center gap-3 mb-3">
                <Flame className={`h-7 w-7 ${retroThemeColors.textAccent}`} />
                <span className="text-lg font-bold tracking-wide">PROBLEM OF THE DAY</span>
            </div>
            <h3 className="text-3xl font-bold">{problem.title}</h3>
            <div className="flex items-center gap-4 text-sm my-3">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="flex items-center gap-1 font-bold text-amber-700"><Trophy className="h-5 w-5" /> +{problem.reward || 50} XP</span>
            </div>
            <Button onClick={() => onClick(problem.slug)} type="primary" className={`${retroThemeColors.buttonPrimaryBg} w-full`}>
                Solve Now <ChevronRight className="inline h-6 w-6" />
            </Button>
        </RetroCard>
    );
};

const ProblemCard = ({ problem, onClick }) => (
    <RetroCard className="p-6 transition-all hover:bg-amber-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
                <h3 className={`text-2xl font-bold ${retroThemeColors.textAccent}`}>{problem.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    <span className={`flex items-center gap-1.5 ${retroThemeColors.textSecondary}`}><User className="h-4 w-4" /> {problem.user?.username || "Community"}</span>
                    <span className={`flex items-center gap-1.5 ${retroThemeColors.textSecondary}`}><CheckCircle className="h-4 w-4 text-emerald-600" /> {problem.solvedCount || 0} Solved</span>
                </div>
            </div>
            <Button onClick={() => onClick(problem.slug)} type="secondary">
                Solve <ChevronRight className="inline h-5 w-5" />
            </Button>
        </div>
    </RetroCard>
);

export default function ProblemDashboard() {
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const navigate = useNavigate();

    // --- LOGIC UPDATED TO USE REAL DATA ---
    const problemOfTheDay = useMemo(() => problems.find(p => p.isPotd), [problems]);

    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
            // Exclude the POTD from the main list so it doesn't appear twice
            if (problemOfTheDay && p._id === problemOfTheDay._id) {
                return false;
            }
            const lowerCaseQuery = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery || p.title?.toLowerCase().includes(lowerCaseQuery) || p.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
            const matchesDifficulty = !selectedDifficulty || p.difficulty === selectedDifficulty;
            return matchesSearch && matchesDifficulty;
        });
    }, [problems, searchQuery, selectedDifficulty, problemOfTheDay]);

    useEffect(() => {
        getAllGlobalProblems().then(data => {
            setProblems(data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching problems:", error);
            setIsLoading(false);
        });
    }, []);
    
    const handleProblemClick = useCallback((slug) => { navigate(`/problems/${slug}`); }, [navigate]);

    return (
        <>
            <Navbar activePage={"Problems"} />
            <div className={`min-h-screen ${retroThemeColors.bgPrimary} px-4 py-24 font-retro`}>
                <div className="max-w-7xl mx-auto">
                    <h1 className={`text-6xl font-bold text-center mb-4 ${retroThemeColors.textPrimary}`}>Coding Challenges</h1>
                    <p className={`text-xl text-center mb-12 ${retroThemeColors.textSecondary}`}>Sharpen your skills, one problem at a time.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Filters and Problem List */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="relative">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 ${retroThemeColors.textSecondary}`} />
                                <input type="text" placeholder="Search challenges by title or tag..." className={`w-full pl-14 pr-6 py-4 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold mr-2">Filter by:</span>
                                {["Easy", "Medium", "Hard", "Veteran Decoder"].map(diff => (
                                    <button key={diff} onClick={() => setSelectedDifficulty(diff === selectedDifficulty ? "" : diff)} className={`px-3 py-1 text-sm border-2 ${retroThemeColors.panelBorder} ${selectedDifficulty === diff ? retroThemeColors.difficulty[diff] + ' shadow-inner' : 'bg-white'}`}>
                                        {diff}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="space-y-6">
                                {isLoading ? (
                                    [...Array(3)].map((_, i) => <RetroCard key={i} className="p-6 animate-pulse"><div className="h-24 bg-stone-200"></div></RetroCard>)
                                ) : filteredProblems.length > 0 ? (
                                    filteredProblems.map((problem) => (
                                        <ProblemCard key={problem._id} problem={problem} onClick={handleProblemClick} />
                                    ))
                                ) : (
                                    <RetroCard className="text-center py-20">
                                        <FileText className={`mx-auto h-16 w-16 ${retroThemeColors.textSecondary} mb-6`} />
                                        <h3 className={`text-2xl font-semibold mb-3 ${retroThemeColors.textPrimary}`}>No Challenges Found</h3>
                                        <p className={`${retroThemeColors.textSecondary} text-lg`}>Your search didn't match any problems. Try another term!</p>
                                    </RetroCard>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Problem of the Day */}
                        <div className="lg:col-span-1">
                            <ProblemOfTheDayCard problem={problemOfTheDay} loading={isLoading} onClick={handleProblemClick} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
