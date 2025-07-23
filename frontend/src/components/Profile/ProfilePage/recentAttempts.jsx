import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    accentBg: "bg-amber-100",
    // Badge-specific colors
    successBg: 'bg-emerald-200',
    successText: 'text-emerald-800',
    failureBg: 'bg-rose-200',
    failureText: 'text-rose-800',
    difficulty: {
        Easy: "bg-emerald-200 text-emerald-800",
        Medium: "bg-amber-200 text-amber-800",
        Hard: "bg-rose-200 text-rose-800",
    },
};

// --- Reusable UI Component ---
const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

// --- Main RecentAttempts Component ---
const RecentAttempts = ({ attempts }) => {

    if (!attempts || attempts.length === 0) {
        return (
            <div>
                <h2 className="text-3xl font-bold mb-6">Recent Attempts</h2>
                <div className={`p-8 text-center border-2 border-dashed ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                    <FiZap className={`mx-auto h-12 w-12 mb-4 ${retroThemeColors.textSecondary}`} />
                    <h3 className="text-xl font-bold">No recent attempts yet</h3>
                    <p className={`${retroThemeColors.textSecondary} mt-1`}>Start solving problems to see your attempts here.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Recent Attempts</h2>
            <div className="space-y-4">
                {attempts.map((attempt) => (
                    <Link 
                        key={attempt._id} 
                        to={`/problems/${attempt.problemId || attempt._id}`} 
                        className={`block p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50 hover:bg-teal-50 transition-colors`}
                    >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-xl font-bold truncate ${retroThemeColors.textAccent}`}>
                                    {attempt.title}
                                </h3>
                                <p className={`text-sm mt-1 ${retroThemeColors.textSecondary}`}>
                                    Last tried on {new Date(attempt.lastTriedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className={`px-3 py-1 text-xs font-bold border-2 ${retroThemeColors.panelBorder} ${
                                    attempt.status === 'Accepted'
                                        ? `${retroThemeColors.successBg} ${retroThemeColors.successText}`
                                        : `${retroThemeColors.failureBg} ${retroThemeColors.failureText}`
                                }`}>
                                    {attempt.status}
                                </span>
                                <span className={`px-3 py-1 text-xs font-bold border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.difficulty[attempt.difficulty] || 'bg-stone-200 text-stone-800'}`}>
                                    {attempt.difficulty}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentAttempts;
