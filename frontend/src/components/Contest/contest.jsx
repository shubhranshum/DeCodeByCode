import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FiClock, FiBarChart2, FiLock, FiCalendar, FiChevronRight, FiCheckCircle, FiXCircle, FiTarget } from 'react-icons/fi';

// --- Data Fetching (Assuming these are correctly implemented) ---
import { getContestBySlug } from '../Tasks/getContestBySlug';
import { getContestSolvedProblems } from '../Tasks/getContestSolvedProblems';
import { getContestAttemptedProblems } from '../Tasks/getContestAttemptedProblems';


// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-purple-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-purple-400 hover:bg-purple-500",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
    success: "text-emerald-600",
    successBg: "bg-emerald-200",
    warning: "text-amber-600",
    warningBg: "bg-amber-200",
    danger: "text-rose-600",
    dangerBg: "bg-rose-200",
    difficulty: {
        Easy: "bg-emerald-200 text-emerald-800",
        Medium: "bg-amber-200 text-amber-800",
        Hard: "bg-rose-200 text-rose-800",
    },
};

// --- Reusable UI Components ---
const RetroCard = ({ children, className = '', ...props }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`} {...props}>
        {children}
    </div>
);

const TabButton = ({ children, isActive, onClick }) => (
    <button onClick={onClick} className={`px-6 py-3 text-xl border-2 ${retroThemeColors.panelBorder} font-bold transition-all flex items-center gap-2 ${isActive ? `bg-purple-400 text-white shadow-chunky` : `bg-stone-200 text-stone-800 shadow-chunky hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`}`}>
        {children}
    </button>
);

// --- Page Specific Components ---
const LoadingState = () => (
    <div className={`flex items-center justify-center min-h-screen font-retro ${retroThemeColors.bgPrimary}`}>
        <div className="text-center">
            <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${retroThemeColors.panelBorder} mx-auto`}></div>
            <p className={`mt-5 text-2xl font-bold ${retroThemeColors.textPrimary}`}>Loading Contest...</p>
        </div>
    </div>
);

const ErrorState = ({ message }) => (
    <div className={`flex items-center justify-center min-h-screen font-retro ${retroThemeColors.bgPrimary}`}>
        <RetroCard className="text-center p-8">
            <p className={`text-2xl font-bold ${retroThemeColors.danger} mb-4`}>{message}</p>
            <Link to="/contests" className="text-lg text-purple-600 hover:underline">&larr; Back to All Contests</Link>
        </RetroCard>
    </div>
);

const TimeRemaining = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(endTime);
            const diff = Math.floor((end - now) / 1000);
            if (diff <= 0) { setTimeLeft("Ended"); clearInterval(interval); return; }
            const d = Math.floor(diff / 86400);
            const h = Math.floor((diff % 86400) / 3600);
            const m = Math.floor((diff % 3600) / 60);
            setTimeLeft(`${d}d ${h}h ${m}m`);
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);
    return <>{timeLeft}</>;
};

const StatCard = ({ icon, title, value }) => (
    <RetroCard className="p-5 flex items-center gap-4">
        <div className={`flex-shrink-0 w-14 h-14 flex items-center justify-center border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
            {icon}
        </div>
        <div>
            <p className={`text-lg font-bold ${retroThemeColors.textSecondary}`}>{title}</p>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    </RetroCard>
);

const ProblemCard = ({ problem, index, contestSlug, isSolved, isAttempted }) => {
    const problemLetter = String.fromCharCode(65 + index);
    const statusBg = isSolved ? retroThemeColors.successBg : isAttempted ? retroThemeColors.warningBg : retroThemeColors.buttonSecondaryBg;
    const statusText = isSolved ? retroThemeColors.success : isAttempted ? retroThemeColors.warning : retroThemeColors.textPrimary;

    return (
        <Link to={`/contests/${contestSlug}/problems/${problem.slug}`} state={{ startTime: problem.startTime }} className={`block border-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`}>
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 text-2xl font-bold flex-shrink-0 flex items-center justify-center border-2 ${retroThemeColors.panelBorder} ${statusBg} ${statusText}`}>
                        {problemLetter}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{problem.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-3 py-1 text-sm border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.difficulty[problem.difficulty] || 'bg-stone-200 text-stone-800'}`}>{problem.difficulty}</span>
                            <span className={`text-base ${retroThemeColors.textSecondary}`}>{problem.points} points</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {isSolved ? <FiCheckCircle className={`text-4xl ${retroThemeColors.success}`} /> : isAttempted ? <FiXCircle className={`text-4xl ${retroThemeColors.warning}`} /> : <div className="w-10" />}
                    <FiChevronRight className={`ml-4 text-3xl ${retroThemeColors.textSecondary}`} />
                </div>
            </div>
        </Link>
    );
};

// --- Main Contest View Component ---
export default function ContestView() {
    const { contestSlug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [solvedProblemIds, setSolvedProblemIds] = useState([]);
    const [attemptedProblemIds, setAttemptedProblemIds] = useState([]);
    const [activeTab, setActiveTab] = useState('problems');

    useEffect(() => {
        const fetchContestData = async () => {
            try {
                setLoading(true);
                const contestData = await getContestBySlug(contestSlug);
                if (!contestData) throw new Error('Contest not found.');
                setContest(contestData);
                
                const [solved, attempted] = await Promise.all([
                    getContestSolvedProblems(contestData._id),
                    getContestAttemptedProblems(contestData._id)
                ]);
                setSolvedProblemIds(solved.map(p => p._id));
                setAttemptedProblemIds(attempted.map(p => p._id));
            } catch (err) {
                setError(err.message || 'Failed to load contest.');
            } finally {
                setLoading(false);
            }
        };
        fetchContestData();
    }, [contestSlug]);

    useEffect(() => {
        setActiveTab(location.pathname.includes('/standings') ? 'standings' : 'problems');
    }, [location.pathname]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!contest) return <ErrorState message="Contest not found" />;

    return (
        <div className={`min-h-screen pt-16 ${retroThemeColors.bgPrimary} font-retro`}>
            <RetroCard className="max-w-7xl mx-auto p-8">
                <h1 className="text-5xl font-bold mb-2">{contest.title}</h1>
                <p className={`text-xl ${retroThemeColors.textSecondary}`}>{contest.description}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-lg">
                    <span className="flex items-center gap-2"><FiCalendar />{new Date(contest.startTime).toLocaleString()}</span>
                    <span className="flex items-center gap-2"><FiClock />{contest.duration} minutes</span>
                    {contest.isPrivate && <span className="flex items-center gap-2"><FiLock />Private Contest</span>}
                </div>
            </RetroCard>

            <main className="max-w-7xl mx-auto py-8">
                <div className="mb-8 flex gap-4">
                    <TabButton isActive={activeTab === 'problems'} onClick={() => navigate(`/contests/${contestSlug}`)}>
                        <FiTarget /> Problems
                    </TabButton>
                    <TabButton isActive={activeTab === 'standings'} onClick={() => navigate(`/contests/${contestSlug}/standings`)}>
                        <FiBarChart2 /> Standings
                    </TabButton>
                </div>
                
                {activeTab === 'problems' && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard icon={<FiTarget size={32} />} title="Total Problems" value={contest.Problems.length} />
                            <StatCard icon={<FiCheckCircle size={32} className={retroThemeColors.success} />} title="Problems Solved" value={solvedProblemIds.length} />
                            <StatCard icon={<FiClock size={32} className={retroThemeColors.danger} />} title="Time Remaining" value={<TimeRemaining endTime={contest.endTime} />} />
                        </div>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-bold">Contest Problems</h2>
                            <div className="space-y-4">
                                {contest.Problems.map((problem, index) => (
                                    <ProblemCard
                                        key={problem._id}
                                        problem={problem}
                                        index={index}
                                        contestSlug={contestSlug}
                                        isSolved={solvedProblemIds.includes(problem._id)}
                                        isAttempted={attemptedProblemIds.includes(problem._id)}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                )}
                
                {activeTab === 'standings' && <Outlet />}
            </main>
        </div>
    );
}