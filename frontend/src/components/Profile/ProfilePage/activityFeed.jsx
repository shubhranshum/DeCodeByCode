import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiMessageSquare, FiCheckCircle, FiXCircle, FiUserPlus, FiActivity } from 'react-icons/fi';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
    // Icon-specific colors
    blogBg: "bg-purple-200",
    blogText: "text-purple-700",
    commentBg: "bg-sky-200",
    commentText: "text-sky-700",
    problemBg: "bg-emerald-200",
    problemText: "text-emerald-700",
    dangerBg: "bg-rose-200",
    dangerText: "text-rose-700",
    followBg: "bg-rose-200",
    followText: "text-rose-700",
};

// --- Reusable UI Component ---
const Button = ({ children, onClick, className = '', small = false }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
    return (
        <button onClick={onClick} className={`border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} ${retroThemeColors.buttonSecondaryBg} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center justify-center gap-2 font-bold ${sizeStyle} ${className}`}>
            {children}
        </button>
    );
};

// --- Main ActivityFeed Component ---
const ActivityFeed = ({ activities, loading = false, mode = 'summary' }) => {
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    // --- LOGIC (Functionality Unchanged) ---
    const renderIcon = (type) => {
        const iconProps = { className: "w-5 h-5" };
        let bgColor, textColor, Icon;

        switch (type) {
            case 'BLOG_POSTED':
            case 'BLOG_EDITED':
                [bgColor, textColor, Icon] = [retroThemeColors.blogBg, retroThemeColors.blogText, FiFileText];
                break;
            case 'COMMENT_ADDED':
                [bgColor, textColor, Icon] = [retroThemeColors.commentBg, retroThemeColors.commentText, FiMessageSquare];
                break;
            case 'PROBLEM_SOLVED':
                [bgColor, textColor, Icon] = [retroThemeColors.problemBg, retroThemeColors.problemText, FiCheckCircle];
                break;
            case 'PROBLEM_ATTEMPTED':
                [bgColor, textColor, Icon] = [retroThemeColors.dangerBg, retroThemeColors.dangerText, FiXCircle];
                break;
            case 'FOLLOWED':
            case 'UNFOLLOWED':
                [bgColor, textColor, Icon] = [retroThemeColors.followBg, retroThemeColors.followText, FiUserPlus];
                break;
            default:
                [bgColor, textColor, Icon] = [retroThemeColors.buttonSecondaryBg, retroThemeColors.textSecondary, FiActivity];
        }
        return (
            <div className={`w-10 h-10 rounded-none border-2 ${retroThemeColors.panelBorder} flex items-center justify-center flex-shrink-0 ${bgColor} ${textColor}`}>
                <Icon {...iconProps} />
            </div>
        );
    };

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

    const getActivityText = (activity) => {
        switch (activity.type) {
            case 'BLOG_POSTED': return { title: "Posted a Blog", summary: `"${activity.details}"` };
            case 'PROBLEM_SOLVED': return { title: "Solved a Problem", summary: `"${activity.details}"` };
            case 'COMMENT_ADDED': return { title: "Commented on", summary: `"${activity.details}"` };
            default: return { title: activity.type.replace(/_/g, ' '), summary: 'Made an update' };
        }
    };

    const handleActivityClick = (activity) => {
        if (activity.refId) {
            if (activity.type.includes('BLOG') || activity.type.includes('COMMENT')) navigate(`/blog/${activity.refId}`);
            if (activity.type.includes('PROBLEM')) navigate(`/problems/${activity.refId}`);
        }
    };

    if (loading) {
        return <div className="text-center p-8 text-lg text-stone-500">Loading Activity...</div>;
    }

    const sortedActivities = [...(activities || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const maxSummaryItems = 3;
    const hasMoreActivities = sortedActivities.length > maxSummaryItems && mode === 'summary';
    const displayedActivities = showAll ? sortedActivities : sortedActivities.slice(0, maxSummaryItems);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Activity Feed</h2>
                {hasMoreActivities && (
                    <Button onClick={() => setShowAll(!showAll)} small>
                        {showAll ? 'View Less' : `View All`}
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {displayedActivities.length === 0 ? (
                    <div className={`p-8 text-center border-2 border-dashed ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                        <FiActivity className={`mx-auto h-12 w-12 mb-4 ${retroThemeColors.textSecondary}`} />
                        <h3 className="text-xl font-bold">No activity yet</h3>
                        <p className={`${retroThemeColors.textSecondary} mt-1`}>This feed will update as you interact.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {displayedActivities.map((activity) => {
                            const { title, summary } = getActivityText(activity);
                            return (
                                <motion.div
                                    key={activity._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onClick={() => handleActivityClick(activity)}
                                    className={`flex items-start gap-4 p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50 cursor-pointer hover:bg-amber-100 transition-colors`}
                                >
                                    {renderIcon(activity.type)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-lg font-bold truncate ${retroThemeColors.textPrimary}`}>{title}</p>
                                            <p className={`text-sm flex-shrink-0 ml-4 ${retroThemeColors.textSecondary}`}>{formatTimeAgo(activity.createdAt)}</p>
                                        </div>
                                        <p className={`text-base mt-1 truncate ${retroThemeColors.textSecondary}`}>{summary}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
