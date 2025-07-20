import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    CheckBadgeIcon, 
    ChevronRightIcon, 
    LightBulbIcon,
    ArrowTopRightOnSquareIcon,
    ChartBarIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/solid';
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

// --- Theme Management Hook ---
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme ? savedTheme : 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return { theme, toggleTheme };
};

// --- Chart Data Processing Hook ---
const useChartData = (problems) => {
    return React.useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const solvedThisMonth = problems.filter(problem => {
            const solvedDate = new Date(problem.solvedAt);
            return solvedDate >= startOfMonth && solvedDate <= endOfMonth;
        });

        const dailyCounts = solvedThisMonth.reduce((acc, problem) => {
            const day = new Date(problem.solvedAt).getDate();
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});
        
        const data = [];
        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            data.push({
                day: i.toString(),
                solved: dailyCounts[i] || 0,
            });
        }
        return data;
    }, [problems]);
};

// --- Reusable Chart Component ---
const SolvedProblemsChart = ({ data, theme }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{`Day ${label}`}</p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400">{`Solved: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme === 'dark' ? '#22d3ee' : '#0891b2'} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={theme === 'dark' ? '#22d3ee' : '#0891b2'} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} />
                <XAxis dataKey="day" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                <Area type="monotone" dataKey="solved" stroke={theme === 'dark' ? '#22d3ee' : '#0891b2'} fillOpacity={1} fill="url(#chartGradient)" />
                <Line type="monotone" dataKey="solved" stroke={theme === 'dark' ? '#67e8f9' : '#0e7490'} strokeWidth={2} dot={false} activeDot={{ r: 6, className: "stroke-cyan-300 fill-cyan-500" }}/>
            </LineChart>
        </ResponsiveContainer>
    );
};

// --- Redesigned RecentSolvedProblems Component ---
const RecentSolvedProblems = ({ problems, theme }) => {
    const chartData = useChartData(problems);

    const formatTimeAgo = (timestamp) => {
        const time = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now - time) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-500/10 text-green-600 dark:text-green-400';
            case 'Medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
            case 'Hard': return 'bg-red-500/10 text-red-600 dark:text-red-400';
            default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
                        <CheckBadgeIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recently Solved</h2>
                </div>
                <Link to="/problems" className="flex items-center gap-1 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
                    View all
                    <ChevronRightIcon className="w-4 h-4" />
                </Link>
            </div>

            {/* Chart Section */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">This Month's Progress</h3>
                <SolvedProblemsChart data={chartData} theme={theme} />
            </div>

            {/* List Section */}
            <div className="space-y-3">
                {problems.length > 0 ? (
                    problems.slice(0, 5).map(problem => (
                        <motion.div
                            key={problem.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                            <Link to={`/problem/${problem._id}`} className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{problem.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatTimeAgo(problem.solvedAt)}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyClass(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LightBulbIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No solved problems yet</h3>
                        <p className="mt-1 text-slate-500">Solve some problems to see your progress!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentSolvedProblems;