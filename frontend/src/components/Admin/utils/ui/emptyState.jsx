import React from 'react';
import { Plus, FileText } from "lucide-react";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} ${retroThemeColors.buttonPrimaryBg} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center justify-center gap-2 font-bold ${className}`}
    >
        {children}
    </button>
);

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

// ================
// MAIN COMPONENT
// ================
export const EmptyState = ({ searchTerm, onCreateNew, type = "problems" }) => {
    const typeLabels = {
        problems: "coding problem",
        contests: "contest",
        announcements: "announcement",
        users: "user",
    };

    const typeLabelCapitalized = {
        problems: "Problem",
        contests: "Contest",
        announcements: "Announcement",
    };

    return (
        <RetroCard className={`p-12 text-center ${retroThemeColors.accentBg} border-2 border-dashed`}>
            <FileText className={`mx-auto h-16 w-16 mb-6 ${retroThemeColors.textSecondary}`} />
            <h3 className={`text-2xl font-bold mb-3 ${retroThemeColors.textPrimary}`}>
                {searchTerm ? `No matching ${type} found` : `No ${type} created yet`}
            </h3>
            <p className={`${retroThemeColors.textSecondary} text-lg max-w-md mx-auto mb-6`}>
                {searchTerm
                    ? "Try adjusting your search to find what you're looking for."
                    : `Get started by creating your first ${typeLabels[type] || type}.`}
            </p>
            <div className="flex justify-center">
                <Button onClick={onCreateNew} className="w-auto">
                    <Plus className="h-5 w-5" />
                    Create New {typeLabelCapitalized[type] || type.slice(0, -1)}
                </Button>
            </div>
        </RetroCard>
    );
};

export default EmptyState;
