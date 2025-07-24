import React, { useState } from "react";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

const FormInput = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label className="block text-lg mb-2 font-bold">{label}</label>
        <input
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-3 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`}
            {...props}
        />
    </div>
);


// ================
// MAIN COMPONENT
// ================
export default function ProblemTitleModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState("");

    const handleSubmit = () => {
        if (title.trim() === "") return;
        onSubmit(title.trim());
        setTitle("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-retro">
            <RetroCard className="w-full max-w-md">
                <div className={`p-4 border-b-4 ${retroThemeColors.panelBorder}`}>
                    <h2 className="text-2xl font-bold">New Problem</h2>
                </div>
                <div className="p-6 space-y-4">
                    <FormInput
                        label="Enter Problem Title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., GCD of Arrays"
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={onClose} type="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Create Problem
                        </Button>
                    </div>
                </div>
            </RetroCard>
        </div>
    );
}
