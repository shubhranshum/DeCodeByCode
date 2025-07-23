import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiUser, FiCheckCircle, FiXCircle, FiClock, FiBarChart2, FiAward, FiStar, FiTarget } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

// Assuming these are correctly implemented
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
    accentBg: "bg-amber-100",
    success: "text-emerald-600",
    successBg: "bg-emerald-200",
    danger: "text-rose-600",
    dangerBg: "bg-rose-200",
    warning: "text-amber-600",
    warningBg: "bg-amber-200",
    rank: {
        gold: "bg-amber-300 text-amber-800",
        silver: "bg-slate-300 text-slate-800",
        bronze: "bg-yellow-600 text-yellow-100",
    }
};

// --- Reusable UI Components ---
const RetroCard = ({ children, className = '', ...props }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`} {...props}>
        {children}
    </div>
);

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

// --- Page Specific Components ---
const LoadingState = () => ( <div className={`flex flex-col items-center justify-center min-h-screen ${retroThemeColors.bgPrimary} font-retro`}> <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${retroThemeColors.panelBorder} mb-6`}></div> <p className={`mt-4 text-2xl font-bold ${retroThemeColors.textPrimary}`}>Loading Standings...</p> </div> );
const ErrorState = ({ message }) => ( <div className={`flex items-center justify-center min-h-screen ${retroThemeColors.bgPrimary} font-retro`}> <RetroCard className="text-center p-8"> <p className={`text-2xl font-bold ${retroThemeColors.danger} mb-4`}>{message}</p> <Link to="/contests" className="text-lg text-purple-600 hover:underline">&larr; Back to All Contests</Link> </RetroCard> </div> );

const TimeRemaining = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.floor((new Date(endTime) - Date.now()) / 1000);
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

const RankBadge = ({ rank }) => {
    const rankColor = rank === 1 ? retroThemeColors.rank.gold : rank === 2 ? retroThemeColors.rank.silver : rank === 3 ? retroThemeColors.rank.bronze : 'bg-stone-200';
    const iconColor = rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-500' : 'text-yellow-700';
    return (
        <div className="flex items-center justify-center gap-2">
            <span className={`w-8 h-8 flex items-center justify-center text-lg border-2 border-stone-800 font-bold ${rankColor}`}>
                {rank}
            </span>
            {rank <= 3 && <FaCrown className={`w-6 h-6 ${iconColor}`} />}
        </div>
    );
};

// ================
// MAIN COMPONENT
// ================
export default function Standings() {
    const { contestSlug } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser] = useState(localStorage.getItem('username'));
    const [problems, setProblems] = useState([]);
    const [problemStats, setProblemStats] = useState({});

    // --- LOGIC (Functionality Preserved) ---
    const calculateProblemStats = useCallback((standingsData, problemObjects) => {
        const stats = {};
        problemObjects.forEach(problem => {
            stats[problem._id] = { attempts: 0, accepted: 0, firstSolve: null, slug: problem.slug };
            standingsData.forEach(user => {
                const result = user.problemResults.find(p => p.problemId === problem._id);
                if (!result) return;
                stats[problem._id].attempts += result.attempts;
                if (result.verdict === "Accepted") {
                    stats[problem._id].accepted++;
                    if (!stats[problem._id].firstSolve || result.timeFromStart < stats[problem._id].firstSolve.time) {
                        stats[problem._id].firstSolve = { username: user.userId.username, time: result.timeFromStart };
                    }
                }
            });
        });
        setProblemStats(stats);
    }, []);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const contestData = await getContestBySlug(contestSlug);
                if (!contestData) throw new Error('Contest not found.');
                setContest(contestData);
                setProblems(contestData.Problems || []);

                const standingsResponse = await fetch(`http://localhost:3000/contests/${contestData._id}/standings`, { credentials: 'include' });
                if (!standingsResponse.ok) throw new Error('Failed to load standings.');
                const standingsData = await standingsResponse.json();
                setStandings(standingsData);
                calculateProblemStats(standingsData, contestData.Problems);

            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        };
        loadAllData();
    }, [contestSlug, calculateProblemStats]);

    // **FIX: Re-introduced the navigation handler.**
    const handleProblemClick = useCallback((problemSlug) => {
        navigate(`/contests/${contestSlug}/problems/${problemSlug}`);
    }, [navigate, contestSlug]);

    const formatTime = (totalMinutes) => {
        if (totalMinutes == null) return '--';
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!contest) return <ErrorState message="Contest not found" />;

    const currentUserStanding = standings.find(user => user.userId.username === currentUser);

    return (
        <div className={`min-h-screen p-4 sm:p-6 ${retroThemeColors.bgPrimary} font-retro`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold">{contest.title}</h1>
                    <p className={`text-2xl mt-2 ${retroThemeColors.textAccent}`}>Standings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={<FiTarget size={32} />} title="Total Problems" value={problems.length} />
                    <StatCard icon={<FiUser size={32} />} title="Participants" value={standings.length} />
                    <StatCard icon={<FiClock size={32} className={retroThemeColors.danger} />} title="Time Remaining" value={<TimeRemaining endTime={contest.endTime} />} />
                </div>
                
                {currentUserStanding && (
                    <RetroCard className="mb-8 p-6">
                         <h2 className="text-3xl font-bold mb-4">Your Performance</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                             <div className="p-4 border-2 border-stone-800 bg-stone-100"> <p className="text-lg text-stone-500">Rank</p> <p className="text-4xl font-bold">{currentUserStanding.rank}</p> </div>
                             <div className="p-4 border-2 border-stone-800 bg-stone-100"> <p className="text-lg text-stone-500">Solved</p> <p className={`text-4xl font-bold ${retroThemeColors.success}`}>{currentUserStanding.totalSolved}</p> </div>
                             <div className="p-4 border-2 border-stone-800 bg-stone-100"> <p className="text-lg text-stone-500">Penalty</p> <p className="text-4xl font-bold">{currentUserStanding.totalPenalty}</p> </div>
                             <div className="p-4 border-2 border-stone-800 bg-stone-100"> <p className="text-lg text-stone-500">Score</p> <p className="text-4xl font-bold">{currentUserStanding.totalScore}</p> </div>
                         </div>
                    </RetroCard>
                )}

                <RetroCard className="overflow-x-auto">
                    <table className="min-w-full text-lg">
                        <thead className="bg-stone-200">
                            <tr>
                                <th className="p-4 text-left border-b-4 border-r-2 border-stone-800">Rank</th>
                                <th className="p-4 text-left border-b-4 border-r-2 border-stone-800">Participant</th>
                                {problems.map((p, i) => (
                                    <th key={p._id} className={`p-4 text-center border-b-4 border-r-2 border-stone-800 cursor-pointer hover:bg-sky-100`} onClick={() => handleProblemClick(p.slug)}>
                                        <p>{String.fromCharCode(65 + i)}</p>
                                        <p className="text-xs font-normal">({problemStats[p._id]?.accepted || 0}/{problemStats[p._id]?.attempts || 0})</p>
                                    </th>
                                ))}
                                <th className="p-4 text-center border-b-4 border-r-2 border-stone-800">Solved</th>
                                <th className="p-4 text-center border-b-4 border-stone-800">Penalty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((user) => (
                                <tr key={user.userId._id} className={`border-b-2 ${retroThemeColors.panelBorder} ${user.userId.username === currentUser ? '!bg-amber-100' : 'bg-white'}`}>
                                    <td className="p-4 font-bold border-r-2 border-stone-800"><RankBadge rank={user.rank} /></td>
                                    <td className={`p-4 font-bold border-r-2 border-stone-800 ${retroThemeColors.textAccent} hover:underline cursor-pointer`} onClick={() => navigate(`/profile/${user.userId.username}`)}>{user.userId.username}</td>
                                    {problems.map(p => {
                                        const result = user.problemResults.find(r => r.problemId === p._id);
                                        const isFirst = problemStats[p._id]?.firstSolve?.username === user.userId.username;
                                        return (
                                            <td key={p._id} className={`p-4 text-center border-r-2 border-stone-800 cursor-pointer hover:bg-sky-100 ${result?.verdict === "Accepted" ? retroThemeColors.successBg : result ? retroThemeColors.dangerBg : ''}`} onClick={() => handleProblemClick(p.slug)}>
                                                {result?.verdict === "Accepted" && (
                                                    <div className="font-bold relative">
                                                        {isFirst && <FiStar className="absolute top-1 right-1 text-amber-500" />}
                                                        <p>{formatTime(result.timeFromStart)}</p>
                                                        {result.attempts > 1 && <p className="text-sm text-rose-600">(-{result.attempts - 1})</p>}
                                                    </div>
                                                )}
                                                {result && result.verdict !== "Accepted" && <p className="font-bold text-rose-600">-{result.attempts}</p>}
                                            </td>
                                        );
                                    })}
                                    <td className="p-4 font-bold border-r-2 border-stone-800 text-center">{user.totalSolved}</td>
                                    <td className="p-4 font-bold text-center">{user.totalPenalty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </RetroCard>

                <div className="mt-12">
                    <h2 className="text-3xl font-bold mb-6">Problem Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {problems.map((problem, idx) => {
                            const stats = problemStats[problem._id] || {};
                            const acceptanceRate = stats.attempts > 0 ? Math.round((stats.accepted / stats.attempts) * 100) : 0;
                            return (
                                <RetroCard key={problem._id} className="p-5 cursor-pointer transition-transform hover:-translate-y-1" onClick={() => handleProblemClick(problem.slug)}>
                                    <h3 className="text-2xl font-bold mb-3">{String.fromCharCode(65 + idx)} - {problem.title}</h3>
                                    <div className="space-y-3 text-lg">
                                        <div className="flex justify-between"><span>Acceptance Rate</span> <span className="font-bold">{acceptanceRate}%</span></div>
                                        <div className="w-full bg-stone-200 border-2 border-stone-800"><div className="bg-emerald-400 h-2" style={{width: `${acceptanceRate}%`}}></div></div>
                                        <div className="flex justify-between"><span>Attempts</span> <span className="font-bold">{stats.attempts || 0}</span></div>
                                        <div className="flex justify-between"><span>Accepted</span> <span className={`font-bold ${retroThemeColors.success}`}>{stats.accepted || 0}</span></div>
                                        <div className="flex justify-between items-center">
                                            <span>First Solve By</span>
                                            {stats.firstSolve ? <span className={`font-bold ${retroThemeColors.textAccent}`}>{stats.firstSolve.username}</span> : <span>--</span>}
                                        </div>
                                    </div>
                                </RetroCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}