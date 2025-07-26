import React, { useState } from "react";
// In a real app, you would use this. For this example, we'll mock navigation.
// import { useNavigate } from "react-router-dom";

// --- MOCK useNavigate ---
// To make this component runnable in isolation, we'll create a mock hook.
import { useNavigate } from "react-router-dom";
// --- CONSTANTS ---

const API_ENDPOINTS = {
    LOGIN: "http://localhost:3000/login",
    GOOGLE_AUTH: "http://localhost:3000/api/auth/google",
    GITHUB_AUTH: "http://localhost:3000/api/auth/github",
};

const TEAL_THEME = {
    bgPrimary: "bg-[#e0f2f1]", // Light teal-grey background
    textPrimary: "text-[#004d40]", // Dark teal for primary text
    textSecondary: "text-[#00796b]", // Medium teal for secondary text
    textAccent: "text-[#00bfa5]", // Bright teal for accents
    panelBg: "bg-[#f0fdfa]", // Very light, almost white teal for panels
    panelBorder: "border-[#004d40]", // Dark teal border
    buttonPrimaryBg: "bg-[#80cbc4] hover:bg-[#4db6ac]", // Soft teal for primary button
    buttonSecondaryBg: "bg-[#b2dfdb] hover:bg-[#80cbc4]", // Lighter teal for secondary button
    buttonText: "text-[#004d40]",
    inputBg: "bg-[#e0f2f1]",
    inputFocusBorder: "focus:border-[#00bfa5]",
    inputFocusRing: "focus:ring-[#00bfa5]/50",
    errorBg: "bg-[#ffcdd2]",
    errorText: "text-[#c62828]",
    decorativePanelBg: "bg-[#b2dfdb]", // A soft, muted teal for the side panel
    retroPattern: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZTBmMmYxIj48L3JlY3Q+PHBhdGggZD0iTSAwIDEwIEwgMjAgMTAgTSAxMCAwIEwgMTAgMjAiIHN0cm9rZT0iIzAwNzE2YiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4yIj48L3BhdGg+PC9zdmc+')]",
};

// --- SVG ICONS (Updated to use currentColor) ---
const MailIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> );
const LockIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> );
const EyeIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg> );
const EyeOffIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg> );
const GoogleIcon = (props) => ( <svg {...props} role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.84-4.32 1.84-5.23 0-9.48-4.25-9.48-9.48s4.25-9.48 9.48-9.48c2.92 0 4.84 1.16 6.3 2.52l2.34-2.34C19.33 2.52 16.2.92 12.48.92c-6.9 0-12.48 5.58-12.48 12.48s5.58 12.48 12.48 12.48c6.9 0 12.48-5.58 12.48-12.48 0-.8-.08-1.56-.22-2.32H12.48z" fill="#4285F4"/></svg> );
const GithubIcon = (props) => ( <svg {...props} role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#181717"/></svg> );

// --- Custom Hook for Form Logic ---
const useLoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setError("");
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Please fill in both email and password.");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed. Please check your credentials.");
            }
            localStorage.setItem("username", data.user.username);
            navigate("/home");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, error, isLoading, showPassword, handleChange, handleSubmit, setShowPassword };
};
// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', type = 'primary', isSubmit = false }) => {
    const typeStyle = type === 'primary' ? TEAL_THEME.buttonPrimaryBg : TEAL_THEME.buttonSecondaryBg;
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
            className={`w-full pl-11 pr-4 py-3 text-base border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.inputBg} ${TEAL_THEME.textPrimary} focus:outline-none ${TEAL_THEME.inputFocusBorder} focus:ring-2 ${TEAL_THEME.inputFocusRing}`} 
        />
        {children}
    </div>
);

const SocialButton = ({ provider, icon: Icon, href }) => (
    <Button type="secondary" onClick={() => (window.location.href = href)}>
        <Icon /> {provider}
    </Button>
);

const DecorativePanel = () => (
    <div className={`w-full md:w-2/5 p-8 sm:p-10 flex-col justify-center items-center text-center hidden md:flex border-r-4 ${TEAL_THEME.panelBorder} ${TEAL_THEME.decorativePanelBg} ${TEAL_THEME.retroPattern} relative`}>
        <div className="absolute inset-0 bg-repeat opacity-10" style={{ backgroundImage: "radial-gradient(#004d40 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="relative z-10 w-full max-w-xs">
            <div className={`w-24 h-24 mb-6 border-4 ${TEAL_THEME.panelBorder} flex items-center justify-center mx-auto bg-white`}>
                <svg viewBox="0 0 24 24" className={`w-14 h-14 ${TEAL_THEME.textPrimary}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
            
            <h2 className={`text-2xl font-bold ${TEAL_THEME.textPrimary} mb-4`} style={{ fontFamily: "'Press Start 2P', cursive", textShadow: "2px 2px 0 #80cbc4" }}>
                DecodeByCode
            </h2>
            <p className={`${TEAL_THEME.textSecondary} text-base`} style={{ fontFamily: "'Courier Prime', monospace" }}>
                Unlock your potential. Log in to access challenges and track your progress.
            </p>
        </div>
    </div>
);

// --- Main Login Page Component ---
export default function App() {
    const { formData, error, isLoading, showPassword, handleChange, handleSubmit, setShowPassword } = useLoginForm();
    const navigate = useNavigate();

    return (
        <main className={`min-h-screen w-full flex items-center justify-center p-4 ${TEAL_THEME.bgPrimary}`} style={{ fontFamily: "'Courier Prime', monospace" }}>
            <div className={`relative z-10 w-full max-w-4xl flex flex-col md:flex-row ${TEAL_THEME.panelBg} rounded-none border-4 ${TEAL_THEME.panelBorder} shadow-[10px_10px_0_0_#004d40]`}>
                <DecorativePanel />
                
                <div className="w-full md:w-3/5 p-8 sm:p-10">
                    <div className="text-center md:text-left mb-8">
                        <h1 className={`text-3xl font-bold ${TEAL_THEME.textPrimary} mb-2`} style={{ fontFamily: "'Press Start 2P', cursive" }}>Welcome Back!</h1>
                        <p className={`text-base ${TEAL_THEME.textSecondary}`}>Please sign in to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className={`p-3 border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.errorBg} ${TEAL_THEME.errorText} text-sm mb-4`}>{error}</div>}
                        
                        <FormInput 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Email Address" 
                            icon={MailIcon} 
                        />
                        
                        <FormInput 
                            id="password" 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Password" 
                            icon={LockIcon}
                        >
                            <button 
                                type="button" 
                                aria-label={showPassword ? "Hide password" : "Show password"} 
                                className={`absolute top-1/2 right-3 -translate-y-1/2 ${TEAL_THEME.textSecondary} hover:${TEAL_THEME.textAccent}`}
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </FormInput>

                        <div className="flex justify-end mb-4">
                            <button 
                                type="button" 
                                onClick={() => navigate("/forgot-password")} 
                                className={`text-sm ${TEAL_THEME.textSecondary} hover:${TEAL_THEME.textAccent} hover:underline`}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <Button type="primary" isSubmit={true} disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </span>
                            ) : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className={`w-full border-t-2 border-dashed ${TEAL_THEME.panelBorder}`}></div></div>
                        <div className="relative flex justify-center text-base"><span className={`px-2 ${TEAL_THEME.panelBg} ${TEAL_THEME.textSecondary}`}>OR</span></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <SocialButton provider="Google" icon={GoogleIcon} href={API_ENDPOINTS.GOOGLE_AUTH} />
                        <SocialButton provider="GitHub" icon={GithubIcon} href={API_ENDPOINTS.GITHUB_AUTH} />
                    </div>
                    
                    <div className="text-center">
                        <button type="button" onClick={() => navigate("/signup")} className={`text-base ${TEAL_THEME.textSecondary} hover:${TEAL_THEME.textPrimary} group transition-colors`}>
                            New here? <span className={`font-bold ${TEAL_THEME.textAccent} group-hover:underline`}>Create an account</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Retro decorative elements */}
            <div className={`absolute bottom-4 right-4 w-16 h-16 border-4 ${TEAL_THEME.panelBorder} bg-[#80cbc4] transform rotate-12 z-0`}></div>
            <div className={`absolute top-4 left-4 w-12 h-12 border-4 ${TEAL_THEME.panelBorder} bg-[#b2dfdb] transform -rotate-6 z-0`}></div>
        </main>
    );
}
