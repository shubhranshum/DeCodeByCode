import React, { useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
    accentBg: "bg-amber-100",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary', isSubmit = false }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return (
        <button type={isSubmit ? "submit" : "button"} onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const FormInput = ({ label, name, value, onChange, ...props }) => (
    <div>
        <label className="block text-base mb-1.5 font-bold">{label}</label>
        <input
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`}
            {...props}
        />
    </div>
);

const FormTextarea = ({ label, name, value, onChange, ...props }) => (
     <div>
        <label className="block text-base mb-1.5 font-bold">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none resize-none`}
            {...props}
        />
    </div>
);

const TabButton = ({ label, isActive, onClick }) => (
     <button type="button" onClick={onClick} className={`flex-1 p-3 text-base font-bold border-r-2 last:border-r-0 ${retroThemeColors.panelBorder} transition-colors ${isActive ? `bg-white text-teal-600` : `bg-stone-200 text-stone-700 hover:bg-stone-300`}`}>
        {label}
    </button>
);


// ================
// MAIN COMPONENT
// ================
export default function EditProfileModal({ profile, onClose, onUpdate }) {
    const [editFormData, setEditFormData] = useState({
        profilePicture: profile.profilePicture || "",
        username: profile.username || "",
        about: profile.about || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        college: profile.college || "",
        skills: profile.skills || [],
        email: profile.email || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        age: profile.age || "",
        // Initialize socialLinks with all possible fields
        socialLinks: {
            personalsite: profile.socialLinks?.personalsite || "",
            github: profile.socialLinks?.github || "",
            linkedin: profile.socialLinks?.linkedin || "",
            leetcode: profile.socialLinks?.leetcode || "",
            codechef: profile.socialLinks?.codechef || "",
            codeforces: profile.socialLinks?.codeforces || "",
        },
    });

    const [newSkill, setNewSkill] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTab, setSelectedTab] = useState("basic");

    // --- LOGIC ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    // New handler for nested socialLinks object
    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !editFormData.skills.includes(newSkill.trim())) {
            setEditFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setEditFormData((prev) => ({ ...prev, skills: prev.skills.filter((skill) => skill !== skillToRemove) }));
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("http://localhost:3000/profile", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editFormData),
            });
            if (res.ok) {
                const updatedProfile = await res.json();
                onUpdate(updatedProfile);
                onClose();
            }
        } catch (err) {
            console.error("Error updating profile:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tabOrder = ["basic", "personal", "socials", "skills"];
    const currentTabIndex = tabOrder.indexOf(selectedTab);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-retro">
            <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky w-full max-w-3xl max-h-[90vh] flex flex-col`}>
                <div className={`p-4 border-b-4 ${retroThemeColors.panelBorder} flex justify-between items-center`}>
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800 text-2xl">&times;</button>
                </div>

                <div className={`flex border-b-4 ${retroThemeColors.panelBorder}`}>
                    <TabButton label="Basic" isActive={selectedTab === 'basic'} onClick={() => setSelectedTab('basic')} />
                    <TabButton label="Personal" isActive={selectedTab === 'personal'} onClick={() => setSelectedTab('personal')} />
                    <TabButton label="Socials" isActive={selectedTab === 'socials'} onClick={() => setSelectedTab('socials')} />
                    <TabButton label="Skills" isActive={selectedTab === 'skills'} onClick={() => setSelectedTab('skills')} />
                </div>

                <form onSubmit={handleSubmitEdit} className="p-6 overflow-y-auto flex-grow">
                    {selectedTab === "basic" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 flex flex-col items-center gap-3">
                                <img src={editFormData.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${editFormData.username}`} alt="Avatar" className={`w-28 h-28 object-cover border-4 ${retroThemeColors.panelBorder}`} />
                                <div className="w-full max-w-sm">
                                    <FormInput label="Profile Picture URL" name="profilePicture" value={editFormData.profilePicture} onChange={handleInputChange} placeholder="https://..." />
                                </div>
                            </div>
                            <FormInput label="First Name" name="firstName" value={editFormData.firstName} onChange={handleInputChange} required />
                            <FormInput label="Last Name" name="lastName" value={editFormData.lastName} onChange={handleInputChange} required />
                            <FormInput label="Username" name="username" value={editFormData.username} onChange={handleInputChange} required readOnly disabled />
                            <FormInput label="Email" name="email" value={editFormData.email} onChange={handleInputChange} required readOnly disabled />
                        </div>
                    )}

                    {selectedTab === "personal" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Title/Position" name="title" value={editFormData.title} onChange={handleInputChange} placeholder="Software Engineer" />
                            <FormInput label="Company" name="company" value={editFormData.company} onChange={handleInputChange} placeholder="Tech Company Inc." />
                            <FormInput label="Age" name="age" type="number" value={editFormData.age} onChange={handleInputChange} />
                            <FormInput label="Website" name="website" type="url" value={editFormData.website} onChange={handleInputChange} placeholder="https://..." />
                            <FormInput label="College/University" name="college" value={editFormData.college} onChange={handleInputChange} />
                            <FormInput label="City" name="city" value={editFormData.city} onChange={handleInputChange} />
                            <FormInput label="State" name="state" value={editFormData.state} onChange={handleInputChange} />
                            <FormInput label="Country" name="country" value={editFormData.country} onChange={handleInputChange} />
                        </div>
                    )}

                    {selectedTab === "socials" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Personal Site" name="personalsite" value={editFormData.socialLinks.personalsite} onChange={handleSocialLinkChange} placeholder="https://your-site.com" />
                            <FormInput label="GitHub" name="github" value={editFormData.socialLinks.github} onChange={handleSocialLinkChange} placeholder="https://github.com/username" />
                            <FormInput label="LinkedIn" name="linkedin" value={editFormData.socialLinks.linkedin} onChange={handleSocialLinkChange} placeholder="https://linkedin.com/in/username" />
                            <FormInput label="LeetCode" name="leetcode" value={editFormData.socialLinks.leetcode} onChange={handleSocialLinkChange} placeholder="https://leetcode.com/username" />
                            <FormInput label="CodeChef" name="codechef" value={editFormData.socialLinks.codechef} onChange={handleSocialLinkChange} placeholder="https://codechef.com/users/username" />
                            <FormInput label="Codeforces" name="codeforces" value={editFormData.socialLinks.codeforces} onChange={handleSocialLinkChange} placeholder="https://codeforces.com/profile/username" />
                        </div>
                    )}

                    {selectedTab === "skills" && (
                        <div className="space-y-4">
                            <FormTextarea label="About Me" name="about" value={editFormData.about} onChange={handleInputChange} rows="4" placeholder="Tell others about yourself..." />
                            <div>
                                <label className="block text-base mb-1.5 font-bold">Skills & Expertise</label>
                                <div className={`p-2 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} min-h-[4rem]`}>
                                    {editFormData.skills.map((skill) => (
                                        <span key={skill} className={`inline-flex items-center gap-2 px-2 py-1 mr-2 mb-2 text-sm border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="font-bold hover:text-rose-600">&times;</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a new skill" className={`flex-1 p-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`} />
                                    <Button type="secondary" onClick={handleAddSkill}>Add</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
                
                <div className={`p-4 border-t-4 ${retroThemeColors.panelBorder} flex justify-between items-center`}>
                    <p className="text-sm text-stone-500">Step {currentTabIndex + 1} of {tabOrder.length}</p>
                    <div className="flex gap-2">
                        {selectedTab !== "basic" && (
                            <Button type="button" onClick={() => setSelectedTab(tabOrder[currentTabIndex - 1])}  small>Back</Button>
                        )}
                        {selectedTab !== "skills" ? (
                            <Button type="button" onClick={() => setSelectedTab(tabOrder[currentTabIndex + 1])} small>Next</Button>
                        ) : (
                            <Button onClick={handleSubmitEdit} isSubmit disabled={isSubmitting} small>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
