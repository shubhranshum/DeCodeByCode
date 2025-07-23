import React, { useEffect, useState, useMemo, useCallback } from "react";
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
    },
};

// --- Mock hook for Problem of the Day (Unchanged) ---
const useProblemOfTheDay = () => {
    const [problemOfTheDay, setProblemOfTheDay] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProblemOfTheDay({
                id: 'potd-123',
                slug: 'array-rotation-challenge',
                title: 'Array Rotation Challenge',
                difficulty: 'Medium',
                description: 'Implement a function to rotate an array to the right by k steps, optimizing for time and space complexity.',
                tags: ['Arrays', 'Algorithms', 'Data Structures'],
                reward: 75
            });
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return { problemOfTheDay, loading };
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
            <RetroCard className="p-8 mb-12 animate-pulse">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 space-y-4 w-full">
                        <div className="h-6 bg-stone-200 rounded w-48"></div>
                        <div className="h-10 bg-stone-300 rounded w-3/4"></div>
                        <div className="h-5 bg-stone-200 rounded w-full"></div>
                    </div>
                    <div className="h-14 w-full md:w-52 bg-stone-300"></div>
                </div>
            </RetroCard>
        );
    }

    return (
        <RetroCard className={`mb-12 transition-transform hover:-translate-y-1 ${retroThemeColors.potdBg}`}>
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                        <Flame className={`h-7 w-7 ${retroThemeColors.textAccent}`} />
                        <span className="text-lg font-bold tracking-wide">PROBLEM OF THE DAY</span>
                    </div>
                    <h3 className="text-4xl font-bold">{problem.title}</h3>
                    <p className={`text-lg ${retroThemeColors.textSecondary}`}>{problem.description}</p>
                    <div className="flex items-center gap-4 text-sm mt-3">
                         <DifficultyBadge difficulty={problem.difficulty} />
                         <span className="flex items-center gap-1 font-bold text-amber-700"><Trophy className="h-5 w-5" /> +{problem.reward} XP</span>
                    </div>
                </div>
                <Button onClick={() => onClick(problem.slug)} type="primary" className={`${retroThemeColors.buttonPrimaryBg}`}>
                    Start Challenge <ChevronRight className="inline h-6 w-6" />
                </Button>
            </div>
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
    const { problemOfTheDay, loading: potdLoading } = useProblemOfTheDay();

    const filteredProblems = useMemo(() => {
        if (!searchQuery) return problems;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return problems.filter(p =>
            p.title?.toLowerCase().includes(lowerCaseQuery) ||
            p.difficulty?.toLowerCase().includes(lowerCaseQuery) ||
            p.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
    }, [problems, searchQuery]);

    useEffect(() => {
        getAllGlobalProblems().then(data => {
            setProblems(data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching problems:", error);
            setIsLoading(false);
        });
    }, []);
    
    const handleProblemClick = useCallback((slug) => { window.location.href = `/problems/${slug}`; }, []);

    return (
        <>
            <Navbar activePage={"Problems"} />
            <div className={`min-h-screen ${retroThemeColors.bgPrimary} px-4 py-16 font-retro`}>
                <div className="max-w-7xl mx-auto">
                    <h1 className={`text-6xl font-bold text-center mb-4 ${retroThemeColors.textPrimary}`}>Coding Challenges</h1>
                    <p className={`text-xl text-center mb-10 ${retroThemeColors.textSecondary}`}>Sharpen your skills, one problem at a time.</p>

                    <div className="relative mb-12 max-w-2xl mx-auto">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 ${retroThemeColors.textSecondary}`} />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            className={`w-full pl-14 pr-6 py-4 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <ProblemOfTheDayCard problem={problemOfTheDay} loading={potdLoading} onClick={handleProblemClick} />

                    <div className="flex items-center justify-between mb-8">
                        <h2 className={`text-4xl font-bold ${retroThemeColors.textPrimary}`}>All Problems</h2>
                        <span className={`text-lg font-medium ${retroThemeColors.textSecondary}`}>{filteredProblems.length} challenges</span>
                    </div>

                    <div className="space-y-6">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => <RetroCard key={i} className="p-6 animate-pulse"><div className="h-24 bg-stone-200"></div></RetroCard>)
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
            </div>
        </>
    );
}