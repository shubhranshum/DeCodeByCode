import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
    errorText: "text-rose-600",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary', isSubmit = false }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return (
        <button type={isSubmit ? "submit" : "button"} onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>
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
const AnnouncementTitleModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setError("");
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Announcement title cannot be empty");
            return;
        }
        onSubmit(title);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-retro">
            <RetroCard className="w-full max-w-md">
                <div className={`p-4 border-b-4 ${retroThemeColors.panelBorder} flex justify-between items-center`}>
                    <h2 className="text-2xl font-bold">New Announcement</h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <FormInput
                            label="Enter Announcement Title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., New Contest Next Week!"
                            autoFocus
                        />
                        {error && <p className={`mt-1 text-sm ${retroThemeColors.errorText}`}>{error}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={onClose} type="secondary">
                            Cancel
                        </Button>
                        <Button isSubmit>
                            <Plus className="h-5 w-5" /> Create
                        </Button>
                    </div>
                </form>
            </RetroCard>
        </div>
    );
};

export default AnnouncementTitleModal;
