import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../Navbar/navbar.jsx";
import { getAllGlobalProblems } from "../Tasks/getAllGlobalProblems.jsx";
import { Search, ChevronRight, FileText, CheckCircle, User, Clock, Flame, Trophy } from "lucide-react";

// Custom hook for theme management
const useTheme = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }, []);

    return theme;
};

// Mock hook for Problem of the Day
const useProblemOfTheDay = () => {
    const [problemOfTheDay, setProblemOfTheDay] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call for Problem of the Day
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
        }, 800); // Slightly longer for perceived loading

        return () => clearTimeout(timer);
    }, []);

    return { problemOfTheDay, loading };
};

// --- Theme Color Definitions ---
// Using more vibrant and harmonious colors
const themePalettes = {
    light: {
        // General Backgrounds
        backgroundPrimary: "bg-gradient-to-br from-blue-50 to-indigo-50", // Soft, inviting gradient
        backgroundSecondary: "bg-white",
        backgroundCardHover: "hover:bg-blue-100", // Soft hover for cards

        // Text Colors
        textPrimary: "text-gray-900",
        textSecondary: "text-gray-600",
        textAccent: "text-indigo-700", // Main accent text

        // Borders & Shadows
        borderLight: "border-gray-200",
        shadowCard: "shadow-md hover:shadow-lg",

        // Buttons
        buttonPrimaryBg: "bg-indigo-600",
        buttonPrimaryHover: "hover:bg-indigo-700",
        buttonText: "text-white",
        buttonSecondaryBg: "bg-indigo-100", // Lighter button variant
        buttonSecondaryHover: "hover:bg-indigo-200",
        buttonSecondaryText: "text-indigo-700",

        // Search Bar
        searchBg: "bg-white",
        searchBorder: "border-gray-300",
        searchInputText: "text-gray-800",
        searchPlaceholder: "placeholder-gray-400",
        searchFocusRing: "focus:ring-indigo-400",
        searchFocusBorder: "focus:border-indigo-400",
        searchIcon: "text-gray-400",

        // Difficulty Badges
        difficultyEasyBg: "bg-emerald-100",
        difficultyEasyText: "text-emerald-700",
        difficultyMediumBg: "bg-amber-100",
        difficultyMediumText: "text-amber-700",
        difficultyHardBg: "bg-red-100",
        difficultyHardText: "text-red-700",
        difficultyNotSpecifiedBg: "bg-gray-100",
        difficultyNotSpecifiedText: "text-gray-700",

        // Problem of the Day Card
        potdCardBg: "bg-gradient-to-br from-indigo-500 to-purple-600", // Strong, inviting gradient
        potdTitle: "text-white",
        potdText: "text-indigo-100",
        potdHighlightBg: "bg-white/20", // Semi-transparent highlight
        potdHighlightText: "text-white",
        potdButtonBg: "bg-white",
        potdButtonHover: "hover:bg-indigo-50",
        potdButtonText: "text-indigo-700",
        potdIcon: "text-white",

        // Empty State
        emptyStateIcon: "text-gray-400",
    },
    dark: {
        // General Backgrounds
        backgroundPrimary: "bg-gradient-to-br from-gray-950 to-gray-900", // Deep, rich dark gradient
        backgroundSecondary: "bg-gray-800",
        backgroundCardHover: "hover:bg-gray-700", // Subtle hover for cards

        // Text Colors
        textPrimary: "text-gray-50",
        textSecondary: "text-gray-400",
        textAccent: "text-teal-400", // Main accent text

        // Borders & Shadows
        borderLight: "border-gray-700",
        shadowCard: "shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30",

        // Buttons
        buttonPrimaryBg: "bg-teal-600",
        buttonPrimaryHover: "hover:bg-teal-700",
        buttonText: "text-white",
        buttonSecondaryBg: "bg-gray-700",
        buttonSecondaryHover: "hover:bg-gray-600",
        buttonSecondaryText: "text-teal-400",

        // Search Bar
        searchBg: "bg-gray-800",
        searchBorder: "border-gray-700",
        searchInputText: "text-gray-100",
        searchPlaceholder: "placeholder-gray-500",
        searchFocusRing: "focus:ring-teal-500",
        searchFocusBorder: "focus:border-teal-500",
        searchIcon: "text-gray-500",

        // Difficulty Badges
        difficultyEasyBg: "bg-emerald-900/30",
        difficultyEasyText: "text-emerald-400",
        difficultyMediumBg: "bg-amber-900/30",
        difficultyMediumText: "text-amber-400",
        difficultyHardBg: "bg-red-900/30",
        difficultyHardText: "text-red-400",
        difficultyNotSpecifiedBg: "bg-gray-700/50",
        difficultyNotSpecifiedText: "text-gray-400",

        // Problem of the Day Card
        potdCardBg: "bg-gradient-to-br from-gray-700 to-gray-800", // Subtle dark gradient
        potdTitle: "text-white",
        potdText: "text-gray-300",
        potdHighlightBg: "bg-gray-900/50", // Darker highlight
        potdHighlightText: "text-teal-400",
        potdButtonBg: "bg-teal-500",
        potdButtonHover: "hover:bg-teal-600",
        potdButtonText: "text-white",
        potdIcon: "text-teal-400",

        // Empty State
        emptyStateIcon: "text-gray-600",
    }
};


// Enhanced Difficulty Badge component
const DifficultyBadge = ({ difficulty, theme }) => {
    const colors = themePalettes[theme];
    let selectedColorClass = colors.difficultyNotSpecifiedBg + " " + colors.difficultyNotSpecifiedText;

    switch (difficulty) {
        case "Easy":
            selectedColorClass = colors.difficultyEasyBg + " " + colors.difficultyEasyText;
            break;
        case "Medium":
            selectedColorClass = colors.difficultyMediumBg + " " + colors.difficultyMediumText;
            break;
        case "Hard":
            selectedColorClass = colors.difficultyHardBg + " " + colors.difficultyHardText;
            break;
        default:
            break;
    }

    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full min-w-[70px] text-center ${selectedColorClass}`}>
            {difficulty}
        </span>
    );
};

// ProblemCard component for better reusability and enhanced UI
const ProblemCard = ({ problem, theme, onClick }) => {
    const colors = themePalettes[theme];
    const isDark = theme === 'dark';

    return (
        <Card
            className={`transition-all duration-200 ease-in-out cursor-pointer rounded-xl border ${colors.borderLight} ${colors.backgroundSecondary} ${colors.shadowCard} ${colors.backgroundCardHover}`}
            onClick={() => onClick(problem.slug)} // Ensure card itself is clickable
        >
            <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-3 flex-1 min-w-0">
                    <h3 className={`text-xl font-bold ${colors.textAccent}`}>
                        {problem.title}
                    </h3>
                    <p className={`text-base ${colors.textSecondary} line-clamp-2`}>
                        {problem.statement || 'A compelling problem awaits your brilliant solution.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-3">
                        <DifficultyBadge difficulty={problem.difficulty} theme={theme} />
                        <span className={`flex items-center gap-1 ${colors.textSecondary}`}>
                            <User className="h-4 w-4" />
                            {problem.user?.username || "Community"}
                        </span>
                        <span className={`flex items-center gap-1 ${colors.textSecondary}`}>
                            <CheckCircle className={`h-4 w-4 ${isDark ? "text-emerald-500" : "text-emerald-600"}`} />
                            <span className="font-semibold">{problem.solvedCount || 0}</span> solved
                        </span>
                        <span className={`flex items-center gap-1 ${colors.textSecondary}`}>
                            <Clock className="h-4 w-4" />
                            {new Date(problem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
                <Button
                    variant="default"
                    size="lg"
                    className={`${colors.buttonPrimaryBg} ${colors.buttonPrimaryHover} ${colors.buttonText} flex items-center gap-2 px-6 py-3 rounded-lg`}
                    onClick={(e) => { e.stopPropagation(); onClick(problem.slug); }} // Prevent card click propagation, ensure button click also navigates
                >
                    Solve Challenge <ChevronRight className="h-5 w-5" />
                </Button>
            </CardContent>
        </Card>
    );
};

// Problem of the Day Card - Highly emphasized UI
const ProblemOfTheDayCard = ({ problem, theme, loading, onClick }) => {
    const colors = themePalettes[theme];

    if (loading) {
        return (
            <Card className={`${colors.backgroundSecondary} ${colors.shadowCard} border ${colors.borderLight} p-8 rounded-xl animate-pulse mb-10`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div> {/* POTD label */}
                        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div> {/* Title */}
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div> {/* Description line 1 */}
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div> {/* Description line 2 */}
                        <div className="flex gap-2 mt-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div> {/* Tag 1 */}
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div> {/* Tag 2 */}
                        </div>
                    </div>
                    <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div> {/* Button */}
                </div>
            </Card>
        );
    }

    return (
        <Card
            className={`transition-all duration-300 ease-in-out cursor-pointer rounded-xl border-none p-0 overflow-hidden relative group ${colors.potdCardBg} ${colors.shadowCard} mb-10`}
            onClick={onClick}
        >
            <div className={`p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10`}>
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <Flame className={`h-6 w-6 ${colors.potdIcon} group-hover:scale-110 transition-transform`} />
                        <span className={`text-sm font-bold tracking-wide px-3 py-1 rounded-full ${colors.potdHighlightBg} ${colors.potdHighlightText}`}>
                            PROBLEM OF THE DAY
                        </span>
                        {problem.reward && (
                            <span className={`flex items-center gap-1 text-sm font-bold ${colors.potdHighlightBg} ${colors.potdHighlightText} px-3 py-1 rounded-full`}>
                                <Trophy className="h-4 w-4" /> +{problem.reward} XP
                            </span>
                        )}
                    </div>
                    <h3 className={`text-3xl font-extrabold leading-tight ${colors.potdTitle} group-hover:text-amber-200 transition-colors`}>
                        {problem.title}
                    </h3>
                    <p className={`text-base ${colors.potdText} max-w-lg`}>
                        {problem.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {problem.tags?.map(tag => (
                            <span key={tag} className={`text-xs px-3 py-1 rounded-full font-medium ${colors.potdHighlightBg} ${colors.potdHighlightText}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <Button
                    variant="default"
                    size="lg"
                    className={`min-w-[180px] h-14 rounded-full text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${colors.potdButtonBg} ${colors.potdButtonHover} ${colors.potdButtonText}`}
                    onClick={(e) => { e.stopPropagation(); onClick(problem.slug); }} // Prevent card click propagation
                >
                    Start Challenge <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
            {/* Visual flair for POTD card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400 opacity-20 blur-xl rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400 opacity-20 blur-xl rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>
        </Card>
    );
};


export default function ProblemDashboard() {
    const theme = useTheme();
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { problemOfTheDay, loading: potdLoading } = useProblemOfTheDay();

    const filteredProblems = useMemo(() => {
        return problems.filter(problem =>
            problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.statement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.difficulty?.toLowerCase().includes(searchQuery.toLowerCase()) || // Allow searching by difficulty
            problem.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) // Allow searching by tags
        );
    }, [problems, searchQuery]);

    useEffect(() => {
        let isMounted = true;

        async function loadProblems() {
            try {
                setIsLoading(true);
                const data = await getAllGlobalProblems();
                if (isMounted) {
                    setProblems(data);
                }
            } catch (error) {
                console.error("Error fetching problems:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProblems();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleProblemClick = useCallback((problemSlug) => {
        window.location.href = `/problems/${problemSlug}`;
    }, []);

    const handlePotdClick = useCallback(() => {
        if (problemOfTheDay && problemOfTheDay.slug) {
            window.location.href = `/problems/${problemOfTheDay.slug}`;
        }
    }, [problemOfTheDay]);

    const colors = themePalettes[theme];

    return (
        <>
            <Navbar activePage={"Problems"} />
            <div className={`min-h-screen ${colors.backgroundPrimary} px-4 py-10 ${colors.textPrimary}`}>
                <div className="max-w-7xl mx-auto">
                    {/* Page Title */}
                    <h1 className={`text-4xl font-extrabold text-center mb-10 ${colors.textAccent} drop-shadow-md`}>
                        Explore Coding Challenges
                    </h1>

                    {/* Search Bar */}
                    <div className="relative mb-12 max-w-2xl mx-auto">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 ${colors.searchIcon}`} />
                        <input
                            type="text"
                            placeholder="Search problems by title, description, difficulty, or tags..."
                            className={`w-full pl-12 pr-6 py-4 border rounded-xl focus:ring-2 focus:outline-none ${colors.searchBg} ${colors.searchBorder} ${colors.searchInputText} ${colors.searchPlaceholder} ${colors.searchFocusRing} ${colors.searchFocusBorder} transition-all duration-200`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Problem of the Day Section */}
                    {problemOfTheDay && (
                        <ProblemOfTheDayCard
                            problem={problemOfTheDay}
                            theme={theme}
                            loading={potdLoading}
                            onClick={handlePotdClick}
                        />
                    )}

                    {/* Problems List Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className={`text-3xl font-bold ${colors.textPrimary}`}>
                            All Problems
                        </h2>
                        <span className={`text-lg font-medium ${colors.textSecondary}`}>
                            {filteredProblems.length} challenges available
                        </span>
                    </div>

                    {/* Problems List */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="grid gap-6">
                                {[...Array(4)].map((_, i) => ( // Show more loading cards
                                    <Card key={i} className={`${colors.backgroundSecondary} ${colors.shadowCard} border ${colors.borderLight} p-8 rounded-xl animate-pulse`}>
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-5/6 mb-4"></div>
                                        <div className="flex gap-2">
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredProblems.length > 0 ? (
                            <div className="grid gap-6">
                                {filteredProblems.map((problem) => (
                                    <ProblemCard
                                        key={problem._id}
                                        problem={problem}
                                        theme={theme}
                                        onClick={handleProblemClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                <FileText className={`mx-auto h-16 w-16 ${colors.emptyStateIcon} mb-6`} />
                                <h3 className={`text-2xl font-semibold mb-3 ${colors.textPrimary}`}>
                                    No challenges found
                                </h3>
                                <p className={`${colors.textSecondary} text-lg`}>
                                    {searchQuery ? "Your search didn't match any problems. Try a different term!" : "It looks a little empty here. New challenges are coming soon!"}
                                </p>
                                {searchQuery && (
                                    <Button
                                        onClick={() => setSearchQuery("")}
                                        className={`mt-6 ${colors.buttonSecondaryBg} ${colors.buttonSecondaryHover} ${colors.buttonSecondaryText}`}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}