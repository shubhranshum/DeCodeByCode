import React from 'react';
import { Award } from 'lucide-react'; // Using a more appropriate icon

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    panelBorder: "border-stone-800",
    accentBg: "bg-amber-100", // Using amber for achievements
    accentText: "text-amber-800",
};

// ================
// MAIN COMPONENT
// ================
const AchievementsSection = ({ achievements }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            <div className="flex flex-wrap gap-4">
                {achievements && achievements.length > 0 ? (
                    achievements.map(achievement => (
                        <div key={achievement} className="text-center flex flex-col items-center gap-2">
                            <div className={`w-16 h-16 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg} ${retroThemeColors.accentText} flex items-center justify-center`}>
                                <Award size={32} />
                            </div>
                            <span className={`text-sm font-bold ${retroThemeColors.textPrimary} w-20 truncate`}>{achievement}</span>
                        </div>
                    ))
                ) : (
                    <p className={`text-lg ${retroThemeColors.textSecondary}`}>No achievements earned yet.</p>
                )}
            </div>
        </div>
    );
};

export default AchievementsSection;
