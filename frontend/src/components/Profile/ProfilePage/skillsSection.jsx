import React from 'react';
import { FiPlus } from 'react-icons/fi';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    panelBorder: "border-stone-800",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-teal-100", // Using the teal accent for skills
    accentText: "text-teal-800",
};

// --- Reusable UI Component ---
const Button = ({ children, onClick, className = '' }) => (
    <button onClick={onClick} className={`px-3 py-1 text-sm border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} ${retroThemeColors.buttonSecondaryBg} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center justify-center gap-2 font-bold ${className}`}>
        {children}
    </button>
);

// ================
// MAIN COMPONENT
// ================
const SkillsSection = ({ skills, onEditClick, allowEdit }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Skills & Expertise</h2>
                {allowEdit && (
                    <Button onClick={onEditClick}>
                        <FiPlus /> Add Skill
                    </Button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {skills && skills.length > 0 ? (
                    skills.map(skill => (
                        <span
                            key={skill}
                            className={`px-3 py-1 text-base font-bold border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg} ${retroThemeColors.accentText}`}
                        >
                            {skill}
                        </span>
                    ))
                ) : (
                    <p className={`text-lg ${retroThemeColors.textSecondary}`}>No skills added yet.</p>
                )}
            </div>
        </div>
    );
};

export default SkillsSection;
