import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckBadgeIcon, ChevronRightIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import { 
    ResponsiveContainer, 
    LineChart, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Line, 
    Area,
    CartesianGrid
} from 'recharts';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    accentBg: "bg-amber-100",
    // Chart Colors
    chartLine: "#0d9488", // teal-600
    chartFill: "#14b8a6", // teal-500
    // Difficulty Badge Colors
    difficulty: {
        Easy: "bg-emerald-200 text-emerald-800",
        Medium: "bg-amber-200 text-amber-800",
        Hard: "bg-rose-200 text-rose-800",
    },
};

// --- Reusable UI Components ---
const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

// --- Chart Component ---
const SolvedProblemsChart = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-2 border-2 ${retroThemeColors.panelBorder} bg-white shadow-chunky`}>
                    <p className="text-sm font-bold">{`Day ${label}`}</p>
                    <p className={`text-xs ${retroThemeColors.textAccent}`}>{`Solved: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="chartGradientRetro" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={retroThemeColors.chartFill} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={retroThemeColors.chartFill} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
                <XAxis dataKey="day" tick={{ fill: retroThemeColors.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: retroThemeColors.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                <Area type="monotone" dataKey="solved" stroke={retroThemeColors.chartLine} fillOpacity={1} fill="url(#chartGradientRetro)" />
                <Line type="monotone" dataKey="solved" stroke={retroThemeColors.chartLine} strokeWidth={3} dot={false} activeDot={{ r: 6, stroke: retroThemeColors.panelBorder, fill: retroThemeColors.chartFill, strokeWidth: 2 }}/>
            </LineChart>
        </ResponsiveContainer>
    );
};

// ================
// MAIN COMPONENT
// ================
const RecentSolvedProblems = ({ problems }) => {
    // --- LOGIC (Functionality Unchanged) ---
    const chartData = React.useMemo(() => {
        if (!problems) return [];
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const solvedThisMonth = problems.filter(p => {
            const solvedDate = new Date(p.solvedAt);
            return solvedDate >= startOfMonth && solvedDate <= endOfMonth;
        });
        const dailyCounts = solvedThisMonth.reduce((acc, p) => {
            const day = new Date(p.solvedAt).getDate();
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});
        const data = [];
        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            data.push({ day: i.toString(), solved: dailyCounts[i] || 0 });
        }
        return data;
    }, [problems]);

    const formatTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold">Recently Solved</h2>
                {/* --- NEW FEATURE: Total Solved Count --- */}
                <div className={`text-lg font-bold px-4 py-2 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                    Total Solved: {problems?.length || 0}
                </div>
                <Link to="/problems" className={`text-lg font-bold ${retroThemeColors.textAccent} hover:underline`}>
                    View all &rarr;
                </Link>
            </div>

            {/* Chart Section */}
            <RetroCard className="mb-6 p-4">
                <h3 className="text-lg font-bold text-stone-600 mb-2">This Month's Progress</h3>
                <SolvedProblemsChart data={chartData} />
            </RetroCard>

            {/* List Section */}
            <div className="space-y-3">
                {(problems && problems.length > 0) ? (
                    problems.slice(0, 5).map(problem => (
                        <motion.div
                            key={problem.slug}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Link to={`/problems/${problem.slug}`} className={`block p-3 border-2 ${retroThemeColors.panelBorder} bg-stone-50 hover:bg-teal-50 transition-colors`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg text-stone-800 truncate">{problem.title}</p>
                                        <p className="text-sm text-stone-500 mt-1">{formatTimeAgo(problem.solvedAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <span className={`text-xs px-2 py-1 border-2 ${retroThemeColors.panelBorder} font-bold ${retroThemeColors.difficulty[problem.difficulty]}`}>
                                            {problem.difficulty}
                                        </span>
                                        <ChevronRightIcon className="w-6 h-6 text-stone-400" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className={`text-center p-12 border-2 border-dashed ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                        <LightBulbIcon className={`mx-auto h-16 w-16 mb-4 ${retroThemeColors.textSecondary}`} />
                        <h3 className="text-xl font-bold">No solved problems yet</h3>
                        <p className={`${retroThemeColors.textSecondary} mt-1`}>Solve some problems to see your progress!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentSolvedProblems;
