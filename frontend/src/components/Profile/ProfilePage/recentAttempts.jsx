import React from 'react';
import { Link } from 'react-router-dom';

const RecentAttempts = ({ attempts, theme, themeStyles }) => { // Accept themeStyles prop
    // Fallback themeStyles if not provided (though it should be by parent)
    const currentThemeStyles = themeStyles || (theme === 'dark' ? { /* dark defaults */ } : { /* light defaults */ });

    // Placeholder default theme styles if themeStyles prop is not passed correctly from parent
    // In a real app, you'd ensure themeStyles is always passed or import a global theme context
    const defaultThemes = {
        light: {
            card: 'bg-white',
            shadow: 'shadow-xl',
            border: 'border-gray-200',
            text: 'text-gray-800',
            secondaryText: 'text-gray-500',
            primaryAccent: 'text-purple-700', // Still using purple as primary for titles
            secondaryAccent: 'text-teal-600', // Green-blue accent
            sectionTitle: 'text-purple-800', // Main section titles
            hoverBg: 'hover:bg-gray-50',
            emptyStateIconBg: 'bg-gray-100',
            // Specific badge colors
            badgeSuccessBg: 'bg-emerald-100', // Emerald green
            badgeSuccessText: 'text-emerald-800',
            badgeFailureBg: 'bg-rose-100', // Rose red
            badgeFailureText: 'text-rose-800',
            badgeDefaultBg: 'bg-gray-100',
            badgeDefaultText: 'text-gray-700',
            difficultyEasyBg: 'bg-emerald-100',
            difficultyEasyText: 'text-emerald-800',
            difficultyMediumBg: 'bg-amber-100',
            difficultyMediumText: 'text-amber-800',
            difficultyHardBg: 'bg-rose-100',
            difficultyHardText: 'text-rose-800',
        },
        dark: {
            card: 'bg-gray-800',
            shadow: 'shadow-xl',
            border: 'border-gray-700',
            text: 'text-gray-100',
            secondaryText: 'text-gray-400',
            primaryAccent: 'text-indigo-400', // Indigo as primary for titles
            secondaryAccent: 'text-cyan-400', // Green-blue accent
            sectionTitle: 'text-indigo-300', // Main section titles
            hoverBg: 'hover:bg-gray-700',
            emptyStateIconBg: 'bg-gray-700',
            // Specific badge colors
            badgeSuccessBg: 'bg-emerald-900/30', // Emerald green
            badgeSuccessText: 'text-emerald-400',
            badgeFailureBg: 'bg-rose-900/30', // Rose red
            badgeFailureText: 'text-rose-400',
            badgeDefaultBg: 'bg-gray-700',
            badgeDefaultText: 'text-gray-300',
            difficultyEasyBg: 'bg-emerald-900/30',
            difficultyEasyText: 'text-emerald-400',
            difficultyMediumBg: 'bg-amber-900/30',
            difficultyMediumText: 'text-amber-400',
            difficultyHardBg: 'bg-rose-900/30',
            difficultyHardText: 'text-rose-400',
        }
    };
    const activeThemeStyles = themeStyles || defaultThemes[theme];


    if (!attempts || attempts.length === 0) {
        return (
            <div className={`rounded-xl ${activeThemeStyles.card} ${activeThemeStyles.shadow} p-8 text-center border ${activeThemeStyles.border}`}>
                <div className={`${activeThemeStyles.emptyStateIconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner`}>
                    <svg className={`w-8 h-8 ${activeThemeStyles.secondaryText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className={`text-xl font-semibold ${activeThemeStyles.text}`}>No recent attempts yet</h3>
                <p className={`${activeThemeStyles.secondaryText} mt-1`}>Start solving problems to see your attempts here.</p>
            </div>
        );
    }

    return (
        <div className={`rounded-xl ${activeThemeStyles.card} ${activeThemeStyles.shadow} transition-colors border ${activeThemeStyles.border}`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-2xl font-bold ${activeThemeStyles.sectionTitle}`}>Recent Attempts</h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {attempts.map((attempt) => (
                    <li key={attempt._id} className={`${activeThemeStyles.hoverBg} transition-colors`}>
                        <Link to={`/problems/${attempt.problemId || attempt._id}`} className="block p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className={`text-xl font-semibold truncate ${activeThemeStyles.secondaryAccent} hover:underline`}>
                                        {attempt.title}
                                    </h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            attempt.status === 'Accepted'
                                                ? `${activeThemeStyles.badgeSuccessBg} ${activeThemeStyles.badgeSuccessText}`
                                                : `${activeThemeStyles.badgeFailureBg} ${activeThemeStyles.badgeFailureText}`
                                        }`}>
                                            {attempt.status}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${activeThemeStyles.badgeDefaultBg} ${activeThemeStyles.badgeDefaultText}`}>
                                            {attempt.language || "C++"}
                                        </span>
                                    </div>
                                </div>
                                <div className={`ml-4 flex-shrink-0 text-sm font-medium ${activeThemeStyles.secondaryText}`}>
                                    {new Date(attempt.lastTriedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            {attempt.difficulty && (
                                <div className="mt-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        attempt.difficulty === 'Easy'
                                            ? `${activeThemeStyles.difficultyEasyBg} ${activeThemeStyles.difficultyEasyText}`
                                            : attempt.difficulty === 'Medium'
                                                ? `${activeThemeStyles.difficultyMediumBg} ${activeThemeStyles.difficultyMediumText}`
                                                : `${activeThemeStyles.difficultyHardBg} ${activeThemeStyles.difficultyHardText}`
                                    }`}>
                                        {attempt.difficulty}
                                    </span>
                                </div>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentAttempts;