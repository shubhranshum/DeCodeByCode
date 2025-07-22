import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, Outlet } from 'react-router-dom';
import {
    FiClock,
    FiBarChart2,
    FiLock,
    FiCalendar,
    FiChevronRight,
    FiCheckCircle,
    FiXCircle,
    FiZap, // Added for competitive vibe
    FiAward, // Re-introduced for potential "Solved" icon if needed
    FiTarget, // Added for competitive vibe
 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Assuming these utility functions are correctly implemented to use IDs internally
// and that getContestBySlug returns problems with their slugs and _ids.
import { getContestBySlug } from '../Tasks/getContestBySlug'; // Ensure this fetches by slug and returns problem slugs
import { getContestSolvedProblems } from '../Tasks/getContestSolvedProblems';
import { getContestAttemptedProblems } from '../Tasks/getContestAttemptedProblems';

// --- Theme Configuration ---
const themes = {
    light: {
        background: 'bg-gradient-to-br from-gray-50 to-blue-50', // Soft, cool gradient
        card: 'bg-white',
        border: 'border-gray-200',
        text: 'text-gray-800',
        secondaryText: 'text-gray-500',
        hover: 'hover:bg-blue-50', // Light blue hover
        primary: 'text-blue-700', // Stronger primary text
        primaryBg: 'bg-blue-100', // Lighter primary background
        success: 'text-emerald-600', // More vibrant green
        successBg: 'bg-emerald-100',
        danger: 'text-red-600', // Standard red
        dangerBg: 'bg-red-100',
        warning: 'text-amber-600', // For attempted
        warningBg: 'bg-amber-100',
        accent: 'text-indigo-600', // New accent color for badges, etc.
        accentBg: 'bg-indigo-100',
        tableHeader: 'bg-gray-50',
        tableRow: 'bg-white',
        tableRowHighlight: 'bg-blue-50',
        problemCard: 'bg-white',
        firstSolveBadge: 'bg-yellow-100 text-yellow-800', // Yellow for first solve
        tabActive: 'bg-blue-600 text-white shadow-md', // Solid active tab
        tabInactive: 'text-gray-600 hover:bg-blue-50', // Soft hover for inactive
        buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
        buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    },
    dark: {
        background: 'bg-gradient-to-br from-gray-900 to-gray-950', // Deep dark gradient
        card: 'bg-gray-800',
        border: 'border-gray-700',
        text: 'text-gray-100',
        secondaryText: 'text-gray-400',
        hover: 'hover:bg-gray-700', // Darker hover
        primary: 'text-purple-400', // Purple primary text
        primaryBg: 'bg-purple-900/50', // Transparent purple background
        success: 'text-emerald-400', // Green for dark
        successBg: 'bg-emerald-900/50',
        danger: 'text-red-400', // Red for dark
        dangerBg: 'bg-red-900/50',
        warning: 'text-amber-400', // For attempted dark
        warningBg: 'bg-amber-900/50',
        accent: 'text-teal-400', // New accent for dark theme
        accentBg: 'bg-teal-900/50',
        tableHeader: 'bg-gray-800',
        tableRow: 'bg-gray-800',
        tableRowHighlight: 'bg-gray-700',
        problemCard: 'bg-gray-700',
        firstSolveBadge: 'bg-amber-800 text-amber-100', // Amber for dark first solve
        tabActive: 'bg-purple-600 text-white shadow-md', // Solid active tab
        tabInactive: 'text-gray-300 hover:bg-gray-700', // Dark hover for inactive
        buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
        buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200'
    }
};

// --- ContestStats Component ---
const ContestStats = ({ contest, solvedProblemsCount, attemptedProblemsCount, currentTheme }) => {
    const themeStyles = themes[currentTheme];

    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                icon={
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                }
                iconBg={themeStyles.primary}
                title="Total Problems"
                value={contest.Problems.length}
                currentTheme={currentTheme}
            />
            <StatCard
                icon={<FiCheckCircle className="h-6 w-6 text-white" />}
                iconBg={themeStyles.success}
                title="Problems Solved"
                value={solvedProblemsCount}
                currentTheme={currentTheme}
            />
            <StatCard
                icon={<FiClock className="h-6 w-6 text-white" />}
                iconBg={themeStyles.danger}
                title="Time Remaining"
                value={<TimeRemaining endTime={contest.endTime} currentTheme={currentTheme} />}
                currentTheme={currentTheme}
            />
        </div>
    );
};

// --- StatCard Component ---
const StatCard = ({ icon, iconBg, title, value, currentTheme }) => {
    const themeStyles = themes[currentTheme];

    return (
        <div className={`${themeStyles.card} overflow-hidden shadow-lg rounded-xl border ${themeStyles.border} transition-transform transform hover:scale-103`}>
            <div className="px-6 py-6">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 ${iconBg} rounded-xl p-3 shadow-md`}>
                        {icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dt className={`text-sm font-medium ${themeStyles.secondaryText} truncate`}>{title}</dt>
                        <dd className="flex items-baseline">
                            <div className={`text-3xl font-extrabold ${themeStyles.text}`}>
                                {value}
                            </div>
                        </dd>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- TimeRemaining Component ---
const TimeRemaining = ({ endTime, currentTheme }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const themeStyles = themes[currentTheme];

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const end = new Date(endTime);
            const diffInSeconds = Math.floor((end - now) / 1000);

            if (diffInSeconds <= 0) {
                setTimeLeft("Contest Ended");
                return;
            }

            const days = Math.floor(diffInSeconds / (3600 * 24));
            const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;

            let timeParts = [];
            if (days > 0) timeParts.push(`${days}d`);
            if (hours > 0) timeParts.push(`${hours}h`);
            if (minutes > 0) timeParts.push(`${minutes}m`);
            if (days === 0 && hours === 0 && minutes < 5) { // Show seconds only for the last 5 minutes if no days/hours
                timeParts.push(`${seconds}s`);
            } else if (days === 0 && hours === 0 && minutes > 0) { // For remaining minutes, show only minutes
                // No need to push seconds if minutes > 0 unless very close to end
            } else if (timeParts.length === 0) {
                timeParts.push(`${seconds}s`); // Fallback if very short contest
            }


            setTimeLeft(timeParts.join(' ') || "0s");
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return <span className={themeStyles.text}>{timeLeft}</span>;
};


// --- ProblemCard Component ---
const ProblemCard = ({ problem, index, contestSlug, isSolved, isAttempted, startTime, currentTheme }) => {
    const themeStyles = themes[currentTheme];
    const problemLetter = String.fromCharCode(65 + index);

    return (
        <Link
            to={`/contests/${contestSlug}/problems/${problem.slug}`}
            state={{ startTime }} // Pass startTime for problem context
            className={`block rounded-xl overflow-hidden shadow-sm ${themeStyles.card} border ${themeStyles.border} transition-all duration-200 ease-in-out ${themeStyles.hover} hover:shadow-lg`}
        >
            <div className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div
                        className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-lg font-bold
                            ${isSolved
                                ? themeStyles.successBg + ' ' + themeStyles.success
                                : isAttempted
                                ? themeStyles.warningBg + ' ' + themeStyles.warning
                                : themeStyles.primaryBg + ' ' + themeStyles.primary
                            }`}
                    >
                        {problemLetter}
                    </div>
                    <div>
                        <h3 className={`text-xl font-semibold ${themeStyles.text}`}>{problem.title}</h3>
                        <div className="flex items-center space-x-3 mt-2">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                    ${problem.difficulty === "Easy"
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                                        : problem.difficulty === "Medium"
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                    }`}
                            >
                                {problem.difficulty}
                            </span>
                            <span className={`text-sm ${themeStyles.secondaryText}`}>
                                {problem.points} points
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {isSolved ? (
                        <FiCheckCircle className={`text-3xl ${themeStyles.success}`} />
                    ) : isAttempted ? (
                        <FiXCircle className={`text-3xl ${themeStyles.warning}`} />
                    ) : (
                        <div className="w-8 h-8"></div> // Placeholder for consistent spacing with larger icons
                    )}
                    <FiChevronRight className={`ml-4 text-2xl ${themeStyles.secondaryText}`} />
                </div>
            </div>
        </Link>
    );
};

// --- AnnouncementCard Component ---
const AnnouncementCard = ({ announcement, currentTheme }) => {
    const themeStyles = themes[currentTheme];

    return (
        <div className={`rounded-xl overflow-hidden shadow-sm ${themeStyles.card} border ${themeStyles.border} p-6`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-lg font-medium ${themeStyles.text}`}>{announcement.title}</h3>
                    <p className={`mt-2 text-sm ${themeStyles.secondaryText}`}>{announcement.content}</p>
                </div>
                <span className={`text-xs font-semibold ${themeStyles.secondaryText} whitespace-nowrap ml-4`}>{announcement.time}</span>
            </div>
        </div>
    );
};

// --- ContestHeader Component ---
const ContestHeader = ({ contest, currentTheme }) => {
    const themeStyles = themes[currentTheme];

    return (
        <div className={`${themeStyles.card} shadow-lg py-8`}> {/* Increased padding */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className={`text-4xl font-extrabold ${themeStyles.text} leading-tight mb-2`}>{contest.title}</h1> {/* Larger title */}
                        <p className={`mt-2 text-lg ${themeStyles.secondaryText}`}>{contest.description}</p>
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-wrap gap-4 items-center"> {/* Larger gap */}
                        <div className={`flex items-center text-sm px-4 py-2 rounded-full font-medium ${themeStyles.accentBg}`}>
                            <FiCalendar className={`mr-2 text-lg ${themeStyles.accent}`} />
                            <span className={themeStyles.text}>
                                {new Date(contest.startTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        </div>
                        <div className={`flex items-center text-sm px-4 py-2 rounded-full font-medium ${themeStyles.accentBg}`}>
                            <FiClock className={`mr-2 text-lg ${themeStyles.accent}`} />
                            <span className={themeStyles.text}>
                                {contest.duration} minutes
                            </span>
                        </div>
                        <div className={`flex items-center text-sm px-4 py-2 rounded-full font-medium ${
                            contest.isPrivate
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                        }`}>
                            {contest.isPrivate ? (
                                <FiLock className="mr-2 text-lg" />
                            ) : null}
                            {contest.isPrivate ? 'Private Contest' : 'Public Contest'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main ContestView Component ---
export default function ContestView() {
    const { contestSlug } = useParams();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [solvedProblemIds, setSolvedProblemIds] = useState([]); // Stores _ids of solved problems
    const [attemptedProblemIds, setAttemptedProblemIds] = useState([]); // Stores _ids of attempted problems
    const [activeTab, setActiveTab] = useState('problems'); // Default to 'problems'
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Contest has started!',
            content: 'Good luck to all participants! The contest has officially begun. Remember to read all problems carefully and manage your time wisely.',
            time: '10 minutes ago',
        },
        {
            id: 2,
            title: 'Clarification on Problem B',
            content: 'The output for Problem B should be case-insensitive. We apologize for any confusion this may have caused.',
            time: '25 minutes ago',
        },
        {
            id: 3,
            title: 'Important: Server Maintenance Update',
            content: 'Scheduled server maintenance from 2 AM to 4 AM IST on July 22, 2025. Expect brief interruptions.',
            time: '2 hours ago',
        }
    ]);

    // Read theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    const themeStyles = themes[currentTheme];
    const navigate = useNavigate();

    // --- Effect: Fetch Contest Data and Problem Status ---
    useEffect(() => {
        const fetchContestData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch contest data by slug
                const contestData = await getContestBySlug(contestSlug);
                if (!contestData) {
                    throw new Error('Contest not found.');
                }

                setContest(contestData);

                // 2. Fetch solved/attempted problems for the current user in this contest
                // These functions should return arrays of problem _ids
                // Assuming getContestSolvedProblems and getContestAttemptedProblems are available
                const solvedResponse = await getContestSolvedProblems(contestData._id);
                const attemptedResponse = await getContestAttemptedProblems(contestData._id);

                setSolvedProblemIds(solvedResponse.map(p => p._id));
                setAttemptedProblemIds(attemptedResponse.map(p => p._id));

            } catch (err) {
                console.error("Error fetching contest data:", err);
                setError(err.message || 'Failed to load contest details.');
                toast.error(`Error: ${err.message || 'Failed to load contest.'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchContestData();
    }, [contestSlug]); // Re-run when the contest slug changes

    // Update active tab based on URL path
    useEffect(() => {
        if (location.pathname.includes('/standings')) {
            setActiveTab('standings');
        } else {
            setActiveTab('problems');
        }
    }, [location.pathname]); // Listen to URL changes


    // --- Render Loading State ---
    if (loading) return (
        <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
            <div className="text-center">
                <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${currentTheme === 'light' ? 'border-blue-500' : 'border-purple-500'} mx-auto`}></div>
                <p className={`mt-5 text-xl font-medium ${themeStyles.text}`}>Loading contest details...</p>
            </div>
        </div>
    );

    // --- Render Error State ---
    if (error) return (
        <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
            <div className={`text-center p-8 rounded-xl ${themeStyles.card} shadow-lg border ${themeStyles.border}`}>
                <p className={`text-xl font-semibold ${themeStyles.danger} mb-4`}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className={`px-6 py-3 rounded-lg ${themeStyles.buttonPrimary} font-medium transition-colors`}
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // --- Render Contest Not Found State ---
    if (!contest) return (
        <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
            <div className={`text-center p-8 rounded-xl ${themeStyles.card} shadow-lg border ${themeStyles.border}`}>
                <p className={`text-xl font-semibold ${themeStyles.text} mb-4`}>Contest not found</p>
                <Link
                    to="/contests"
                    className={`inline-block px-6 py-3 rounded-lg ${themeStyles.buttonPrimary} font-medium transition-colors`}
                >
                    Back to All Contests
                </Link>
            </div>
        </div>
    );

    // --- Main Render for Contest View ---
    const solvedProblemsCount = solvedProblemIds.length;
    const attemptedProblemsCount = attemptedProblemIds.length; // You can add this to ContestStats if needed

    return (
        <div className={`min-h-screen pt-16 ${themeStyles.background}`}> {/* Added pt-16 for potential fixed Navbar */}
            <ContestHeader contest={contest} currentTheme={currentTheme} />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"> {/* Increased vertical padding */}
                {/* Navigation Tabs */}
                <div className="mb-8"> {/* Increased margin-bottom */}
                    <nav className="flex space-x-3 sm:space-x-4" aria-label="Tabs"> {/* Slightly larger gap */}
                        <button
                            onClick={() => {
                                setActiveTab('problems');
                                navigate(`/contests/${contestSlug}`); // Navigate to base contest route for problems
                            }}
                            className={`px-5 py-2.5 text-lg font-semibold rounded-lg flex items-center transition-all duration-200 ease-in-out ${
                                activeTab === 'problems'
                                    ? `${themeStyles.tabActive}`
                                    : `${themeStyles.tabInactive}`
                            }`}
                        >
                            <FiTarget className="mr-2 text-xl" /> Problems
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('standings');
                                navigate(`/contests/${contestSlug}/standings`);
                            }}
                            className={`px-5 py-2.5 text-lg font-semibold rounded-lg flex items-center transition-all duration-200 ease-in-out ${
                                activeTab === 'standings'
                                    ? `${themeStyles.tabActive}`
                                    : `${themeStyles.tabInactive}`
                            }`}
                        >
                            <FiBarChart2 className="mr-2 text-xl" /> Standings
                        </button>
                    </nav>
                </div>

                {/* Problems Tab Content */}
                {activeTab === 'problems' && (
                    <div className="space-y-10"> {/* Increased vertical spacing between sections */}
                        <ContestStats
                            contest={contest}
                            solvedProblemsCount={solvedProblemsCount}
                            attemptedProblemsCount={attemptedProblemsCount}
                            currentTheme={currentTheme}
                        />

                        <section className="space-y-6"> {/* Use <section> for semantic grouping */}
                            <h2 className={`text-2xl font-bold ${themeStyles.text}`}>Contest Problems</h2>
                            <div className="grid grid-cols-1 gap-5"> {/* Consistent gap */}
                                {contest.Problems.map((problem, index) => (
                                    <ProblemCard
                                        key={problem.slug}
                                        problem={problem}
                                        index={index}
                                        contestSlug={contestSlug}
                                        isSolved={solvedProblemIds.includes(problem._id)}
                                        isAttempted={attemptedProblemIds.includes(problem._id)}
                                        startTime={contest.startTime}
                                        currentTheme={currentTheme}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Announcements Section */}
                        <section className="space-y-6">
                            <h2 className={`text-2xl font-bold ${themeStyles.text}`}>Latest Announcements</h2>
                            <div className="grid grid-cols-1 gap-5">
                                {announcements.map((announcement) => (
                                    <AnnouncementCard
                                        key={announcement.id}
                                        announcement={announcement}
                                        currentTheme={currentTheme}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Standings Tab Content - Rendered by React Router's Outlet */}
                {/* This will render the component for /contests/:contestSlug/standings when that route is active */}
                {activeTab === 'standings' && (
                    <Outlet />
                )}
            </main>
        </div>
    );
}