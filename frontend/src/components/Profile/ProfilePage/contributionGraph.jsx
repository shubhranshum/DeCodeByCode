import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Replaced missing icons with available solid icons for a consistent look.
import { FireIcon, BookOpenIcon, ChatBubbleLeftRightIcon, UserGroupIcon } from '@heroicons/react/24/solid';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    accentBg: "bg-amber-100",
    // Graph specific colors
    level0: "bg-stone-200",
    level1: "bg-teal-100",
    level2: "bg-teal-200",
    level3: "bg-teal-300",
    level4: "bg-teal-400",
};

// --- Reusable UI Components ---
const StatDisplay = ({ label, value, icon }) => (
    <div className={`p-4 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg} text-center`}>
        <div className={`text-3xl font-bold ${retroThemeColors.textPrimary} flex items-center justify-center gap-2`}>
            {icon}
            {value}
        </div>
        <p className={`text-base ${retroThemeColors.textSecondary}`}>{label}</p>
    </div>
);

// FIX: Added the missing activityIcons object required for the tooltip.
const activityIcons = {
    'PROBLEM_SOLVED': { icon: FireIcon, color: 'text-orange-500', label: 'Problems Solved' },
    'BLOG_POSTED': { icon: BookOpenIcon, color: 'text-blue-500', label: 'Blogs Posted' },
    'COMMENT_ADDED': { icon: ChatBubbleLeftRightIcon, color: 'text-green-500', label: 'Comments Added' },
    'FOLLOWED': { icon: UserGroupIcon, color: 'text-purple-500', label: 'Followed Users' },
};


// --- Main ContributionGraph Component ---
const ContributionGraph = ({ data = [] }) => {
    const [stats, setStats] = useState({ total: 0, longestStreak: 0, currentStreak: 0 });
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });

    // --- LOGIC (Functionality Unchanged) ---
    const contributionsByDay = useMemo(() => {
        const map = new Map();
        data.forEach(activity => {
            const date = new Date(activity.createdAt).toISOString().split('T')[0];
            if (!map.has(date)) map.set(date, { count: 0, types: {} });
            const dayData = map.get(date);
            dayData.count++;
            dayData.types[activity.type] = (dayData.types[activity.type] || 0) + 1;
        });
        return map;
    }, [data]);

    useEffect(() => {
        const today = new Date();
        let longestStreak = 0, currentStreak = 0, tempStreak = 0;
        
        for (let i = 365; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            if (contributionsByDay.has(dateString)) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 0;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        for (let i = 0; i < 365; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            if (contributionsByDay.has(dateString)) currentStreak++;
            else break;
        }

        setStats({ total: data.length, longestStreak, currentStreak });
    }, [data, contributionsByDay]);

    const days = useMemo(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); // Start from roughly a year ago
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Align to the closest Sunday
        
        const dayArray = [];
        for (let i = 0; i < 371; i++) { // 53 weeks
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            dayArray.push({ date: dateString, data: contributionsByDay.get(dateString) || { count: 0, types: {} } });
        }
        return dayArray;
    }, [contributionsByDay]);

    const getColor = (count) => {
        if (count === 0) return retroThemeColors.level0;
        if (count < 2) return retroThemeColors.level1;
        if (count < 4) return retroThemeColors.level2;
        if (count < 6) return retroThemeColors.level3;
        return retroThemeColors.level4;
    };

    const handleDayHover = (day, e) => {
        if (day.data.count > 0) {
            const rect = e.target.getBoundingClientRect();
            setTooltip({ visible: true, x: rect.left + window.scrollX, y: rect.top + window.scrollY, data: day });
        }
    };

    const handleMouseLeave = () => setTooltip(prev => ({ ...prev, visible: false }));

    return (
        <div className="font-retro" onMouseLeave={handleMouseLeave}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatDisplay label="Total Contributions" value={stats.total} icon={<BookOpenIcon className="w-6 h-6" />} />
                <StatDisplay label="Longest Streak" value={`${stats.longestStreak} days`} icon={<FireIcon className="w-6 h-6" />} />
                <StatDisplay label="Current Streak" value={`${stats.currentStreak} days`} icon={<FireIcon className="w-6 h-6" />} />
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 border ${retroThemeColors.panelBorder} ${getColor(day.data.count)}`}
                            onMouseEnter={(e) => handleDayHover(day, e)}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {tooltip.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 p-3 border-2 border-stone-800 bg-white shadow-chunky w-auto min-w-[200px]"
                        style={{ left: tooltip.x - 70, top: tooltip.y + 25 }}
                    >
                        <p className="font-bold text-sm mb-1">{new Date(tooltip.data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm font-bold mb-2">{tooltip.data.data.count} contributions</p>
                        
                        {/* FIX: Added the detailed breakdown to the tooltip */}
                        <div className="border-t-2 border-dashed border-stone-300 pt-2 space-y-1">
                            {Object.entries(tooltip.data.data.types).map(([type, count]) => {
                                const activityInfo = activityIcons[type];
                                if (!activityInfo) return null;
                                const { icon: Icon, color, label } = activityInfo;
                                return (
                                    <div key={type} className="flex items-center gap-2 text-xs">
                                        <Icon className={`w-4 h-4 ${color}`} />
                                        <span className="flex-1">{label}</span>
                                        <span className="font-bold">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContributionGraph;
