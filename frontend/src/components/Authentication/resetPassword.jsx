import React, { useState } from "react";
import { useParams } from "react-router-dom";
// In a real app, you would use this. For this example, we'll mock navigation.
// import { useNavigate } from "react-router-dom";

// --- MOCK useNavigate ---
// To make this component runnable in isolation, we'll create a mock hook.

import { useNavigate } from "react-router-dom";
// --- CONSTANTS ---
const API_ENDPOINTS = {
    RESET_PASSWORD: "http://localhost:3000/auth/reset-password", // Using relative paths is better practice
};

const TEAL_THEME = {
    bgPrimary: "bg-[#e0f2f1]", // Light teal-grey background
    textPrimary: "text-[#004d40]", // Dark teal for primary text
    textSecondary: "text-[#00796b]", // Medium teal for secondary text
    textAccent: "text-[#00bfa5]", // Bright teal for accents
    panelBg: "bg-[#f0fdfa]", // Very light, almost white teal for panels
    panelBorder: "border-[#004d40]", // Dark teal border
    buttonPrimaryBg: "bg-[#80cbc4] hover:bg-[#4db6ac]", // Soft teal for primary button
    buttonText: "text-[#004d40]",
    inputBg: "bg-[#e0f2f1]",
    inputFocusBorder: "focus:border-[#00bfa5]",
    inputFocusRing: "focus:ring-[#00bfa5]/50",
    errorBg: "bg-[#ffcdd2]",
    errorText: "text-[#c62828]",
    successBg: "bg-[#c8e6c9]",
    successText: "text-[#2e7d32]",
};

// --- SVG ICONS ---
const LockIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> );
const EyeIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg> );
const EyeOffIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg> );
const ArrowLeftIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

// --- Custom Hook for Form Logic ---
const useResetPasswordForm = () => {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const token = useParams().token;
    const handleChange = (e) => {
        setError("");
        setSuccessMessage("");
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { password, confirmPassword } = formData;

        if (!password || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        setIsLoading(true);
        setError("");
        setSuccessMessage("");
        console.log(token);
        
        console.log(`Resetting password...`);
      
            try {
                const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newPassword: formData.password,
                        token: token
                    }),
                })
                if(response.ok){
                    setSuccessMessage("Your password has been reset successfully! You can now log in.");
                    setFormData({ password: '', confirmPassword: '' });
                }
                else{
                    setError("Token Expired or Invalid, Please try again.");
                }
                
            } catch (err) {
                setError("An unexpected error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        
    };

    return { formData, error, isLoading, successMessage, showPassword, showConfirmPassword, handleChange, handleSubmit, setShowPassword, setShowConfirmPassword };
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', type = 'primary', isSubmit = false }) => {
    const typeStyle = type === 'primary' ? TEAL_THEME.buttonPrimaryBg : '';
    return (
        <button 
            type={isSubmit ? "submit" : "button"} 
            onClick={onClick} 
            disabled={disabled} 
            className={`w-full px-5 py-2.5 text-base border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.buttonText} shadow-[4px_4px_0_0_#004d40] transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 ${typeStyle} ${className}`}
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "0.85rem" }}
        >
            {children}
        </button>
    );
};

const FormInput = ({ id, name, type, value, onChange, placeholder, icon: Icon, children }) => (
    <div className="relative mb-4">
        <label className="sr-only" htmlFor={id}>{placeholder}</label>
        {Icon && <Icon className={`absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 ${TEAL_THEME.textSecondary}`} />}
        <input 
            id={id} 
            name={name} 
            type={type} 
            value={value} 
            onChange={onChange} 
            required 
            placeholder={placeholder} 
            className={`w-full pl-11 pr-10 py-3 text-base border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.inputBg} ${TEAL_THEME.textPrimary} focus:outline-none ${TEAL_THEME.inputFocusBorder} focus:ring-2 ${TEAL_THEME.inputFocusRing}`} 
        />
        {children}
    </div>
);


// --- Main Reset Password Page Component ---
export default function App() {
    const { formData, error, isLoading, successMessage, showPassword, showConfirmPassword, handleChange, handleSubmit, setShowPassword, setShowConfirmPassword } = useResetPasswordForm();
    const navigate = useNavigate();
    const token = useParams().token;
    return (
        <main className={`min-h-screen w-full flex items-center justify-center p-4 ${TEAL_THEME.bgPrimary}`} style={{ fontFamily: "'Courier Prime', monospace" }}>
            <div className={`relative z-10 w-full max-w-md flex flex-col ${TEAL_THEME.panelBg} rounded-none border-4 ${TEAL_THEME.panelBorder} shadow-[10px_10px_0_0_#004d40]`}>
                <div className="w-full p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className={`text-2xl sm:text-3xl font-bold ${TEAL_THEME.textPrimary} mb-2`} style={{ fontFamily: "'Press Start 2P', cursive" }}>Set New Password</h1>
                        <p className={`text-base ${TEAL_THEME.textSecondary}`}>Create a new, strong password.</p>
                    </div>

                    {successMessage ? (
                         <div className={`p-4 border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.successBg} ${TEAL_THEME.successText} text-sm mb-6 text-center`}>{successMessage}</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className={`p-3 border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.errorBg} ${TEAL_THEME.errorText} text-sm mb-4`}>{error}</div>}
                            
                            <FormInput 
                                id="password" 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="New Password" 
                                icon={LockIcon}
                            >
                                <button type="button" aria-label="Toggle password visibility" className={`absolute top-1/2 right-3 -translate-y-1/2 ${TEAL_THEME.textSecondary} hover:${TEAL_THEME.textAccent}`} onClick={() => setShowPassword(p => !p)}>
                                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </FormInput>
                            
                            <FormInput 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                placeholder="Confirm New Password" 
                                icon={LockIcon}
                            >
                                <button type="button" aria-label="Toggle confirm password visibility" className={`absolute top-1/2 right-3 -translate-y-1/2 ${TEAL_THEME.textSecondary} hover:${TEAL_THEME.textAccent}`} onClick={() => setShowConfirmPassword(p => !p)}>
                                    {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </FormInput>

                            <Button type="primary" isSubmit={true} disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting...
                                    </span>
                                ) : "Reset Password"}
                            </Button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <button 
                            type="button" 
                            onClick={() => navigate("/login")} 
                            className={`inline-flex items-center gap-2 text-base ${TEAL_THEME.textSecondary} hover:${TEAL_THEME.textAccent} group transition-colors`}
                        >
                            <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span className="group-hover:underline">Back to Login</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Retro decorative elements */}
            <div className={`absolute top-10 right-10 w-10 h-10 border-4 ${TEAL_THEME.panelBorder} bg-[#b2dfdb] transform rotate-12 z-0 opacity-50`}></div>
            <div className={`absolute bottom-10 left-10 w-14 h-14 border-4 ${TEAL_THEME.panelBorder} bg-[#80cbc4] transform -rotate-6 z-0 opacity-50`}></div>
        </main>
    );
}


