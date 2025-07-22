import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FireIcon, BookOpenIcon, ChatBubbleLeftRightIcon, UserPlusIcon, PencilSquareIcon, CalendarDaysIcon, ChartBarIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/solid';



const StatCard = ({ icon, label, value, color }) => (
    <div className="flex items-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <div className={`p-3 rounded-full mr-4 ${color.bg} ${color.text}`}>
            {icon}
        </div>
        <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{value}</div>
        </div>
    </div>
);

const ContributionGraph = ({ data = [], stats: profileStats, theme = 'dark' }) => {
    const [componentStats, setComponentStats] = useState({
        totalContributions: 0,
        longestStreak: 0,
        currentStreak: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [tooltipInfo, setTooltipInfo] = useState({ pos: { x: 0, y: 0 }, visible: false, data: null });

    const contributionsByDay = useMemo(() => {
        const map = new Map();
        if (!data || data.length === 0) return map;

        data.forEach(activity => {
            const date = new Date(activity.createdAt).toISOString().split('T')[0];
            if (!map.has(date)) {
                map.set(date, { count: 0, types: {} });
            }
            const dayData = map.get(date);
            dayData.count += 1;
            dayData.types[activity.type] = (dayData.types[activity.type] || 0) + 1;
        });
        return map;
    }, [data]);

    useEffect(() => {
        if (data.length > 0) {
            setIsLoading(false);
        }
        
        // Calculate Streaks and total contributions from the map
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        for (let i = 365; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            if (contributionsByDay.has(dateString)) {
                tempStreak++;
            } else {
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
                tempStreak = 0;
            }
        }
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }

        let currentStreak = 0;
        if (contributionsByDay.has(todayString)) {
            for (let i = 0; i < 365; i++) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                if (contributionsByDay.has(dateString)) {
                    currentStreak++;
                } else {
                    break; 
                }
            }
        }

        setComponentStats({
            totalContributions: data.length,
            longestStreak,
            currentStreak,
        });

    }, [data, contributionsByDay]);

    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setDate(today.getDate() - 364);
    
    const startDate = new Date(yearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const totalDays = 371; // 53 weeks * 7 days

    const days = useMemo(() => {
        const dayArray = [];
        for (let i = 0; i < totalDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            dayArray.push({
                date: dateString,
                data: contributionsByDay.get(dateString) || { count: 0, types: {} }
            });
        }
        return dayArray;
    }, [contributionsByDay, startDate]);

    const getColor = (count) => {
        if (count === 0) return 'bg-slate-200 dark:bg-slate-800';
        if (count < 2) return 'bg-cyan-200 dark:bg-cyan-900';
        if (count < 4) return 'bg-cyan-400 dark:bg-cyan-700';
        if (count < 6) return 'bg-cyan-500 dark:bg-cyan-600';
        if(count < 8) return 'bg-cyan-600 dark:bg-cyan-500';
        if(count < 10) return 'bg-cyan-700 dark:bg-cyan-400';

        return 'bg-cyan-800 dark:bg-cyan-300';
    };
    
    const activityIcons = {
        'PROBLEM_SOLVED': { icon: FireIcon, color: 'text-orange-500' },
        'BLOG_POSTED': { icon: BookOpenIcon, color: 'text-blue-500' },
        'COMMENT_ADDED': { icon: ChatBubbleLeftRightIcon, color: 'text-green-500' },
        'FOLLOWED': { icon: UserPlusIcon, color: 'text-purple-500' },
        'PROFILE_UPDATED': { icon: PencilSquareIcon, color: 'text-yellow-500' },
    };

    const handleDayHover = (day, e) => {
        if (day.data.count > 0) {
            const rect = e.target.getBoundingClientRect();
            setTooltipInfo({
                pos: { x: rect.left + window.scrollX + rect.width / 2, y: rect.top + window.scrollY },
                visible: true,
                data: day
            });
        }
    };
    
    const handleMouseLeave = () => {
        setTooltipInfo(prev => ({ ...prev, visible: false }));
    };

    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        for (let i = 0; i < 53; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i * 7);
            const month = date.getMonth();
            if (month !== lastMonth) {
                labels.push({
                    month: date.toLocaleString('default', { month: 'short' }),
                    weekIndex: i
                });
            }
            lastMonth = month;
        }
        return labels;
    }, [startDate]);

    if (isLoading && data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full mx-auto flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full mx-auto" onMouseLeave={handleMouseLeave}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard 
                    icon={<ChartBarIcon className="w-6 h-6"/>}
                    label="Problems Solved"
                    value={profileStats.problemsSolved || 0}
                    color={{bg: "bg-blue-100 dark:bg-blue-900/50", text: "text-blue-600 dark:text-blue-300"}}
                />
                 <StatCard 
                    icon={<UsersIcon className="w-6 h-6"/>}
                    label="Followers"
                    value={profileStats.followers || 0}
                    color={{bg: "bg-purple-100 dark:bg-purple-900/50", text: "text-purple-600 dark:text-purple-300"}}
                />
                 <StatCard 
                    icon={<UserGroupIcon className="w-6 h-6"/>}
                    label="Following"
                    value={profileStats.following || 0}
                    color={{bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-600 dark:text-green-300"}}
                />
            </div>
            
            <div className="flex justify-between items-center mb-2">
                 <h2 className="text-lg font-bold text-gray-800 dark:text-white">{componentStats.totalContributions} contributions in the last year</h2>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>Less</span>
                    <div className="flex gap-1">
                        {[0, 1, 3, 5].map(count => <div key={count} className={`w-3 h-3 rounded-sm ${getColor(count)}`}/>)}
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="relative overflow-x-auto pb-4">
                <div className="relative inline-block mt-6">
                    <div className="flex absolute -top-5 left-0 w-full">
                        {monthLabels.map(({ month, weekIndex }) => (
                            <div key={month} className="absolute text-xs text-gray-500 dark:text-gray-400" style={{ left: `calc(${weekIndex} * (0.875rem + 4px))` }}>
                               {month}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        <div className="grid grid-rows-7 gap-1 mr-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="h-3.5"></div>
                            <div className="h-3.5 flex items-center">M</div>
                            <div className="h-3.5"></div>
                            <div className="h-3.5 flex items-center">W</div>
                            <div className="h-3.5"></div>
                            <div className="h-3.5 flex items-center">F</div>
                            <div className="h-3.5"></div>
                        </div>
                        <div className="grid grid-flow-col grid-rows-7 gap-1">
                            {days.map((day, index) => (
                                <div
                                    key={index}
                                    className={`w-3.5 h-3.5 rounded-sm ${getColor(day.data.count)} transition-all duration-200 hover:ring-2 hover:ring-cyan-500/50`}
                                    onMouseEnter={(e) => handleDayHover(day, e)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {tooltipInfo.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 w-auto min-w-[200px]"
                        style={{
                            left: `${tooltipInfo.pos.x}px`,
                            top: `${tooltipInfo.pos.y + 25}px`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <div className="font-semibold text-gray-800 dark:text-white text-sm mb-2">
                            {new Date(tooltipInfo.data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-3 font-bold">
                            {tooltipInfo.data.data.count} {tooltipInfo.data.data.count === 1 ? 'contribution' : 'contributions'}
                        </div>
                        <div className="space-y-1">
                            {Object.entries(tooltipInfo.data.data.types).map(([type, count]) => {
                                const { icon: Icon, color } = activityIcons[type] || {};
                                return (
                                    <div key={type} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                                        {Icon && <Icon className={`w-4 h-4 ${color}`} />}
                                        <span>{type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}: <strong>{count}</strong></span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContributionGraph;
