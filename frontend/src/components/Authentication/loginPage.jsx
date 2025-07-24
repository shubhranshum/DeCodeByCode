import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- CONSTANTS ---
const API_ENDPOINTS = {
    LOGIN: "http://localhost:3000/login",
    GOOGLE_AUTH: "http://localhost:3000/api/auth/google",
    GITHUB_AUTH: "http://localhost:3000/api/auth/github",
};

const RETRO_THEME = {
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
    errorBg: "bg-rose-100",
    errorText: "text-rose-800",
    decorativePanelBg: "bg-teal-100",
};

// --- SVG ICONS ---
const MailIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> );
const LockIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> );
const EyeIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg> );
const EyeOffIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg> );
const GoogleIcon = (props) => ( <svg {...props} role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.84-4.32 1.84-5.23 0-9.48-4.25-9.48-9.48s4.25-9.48 9.48-9.48c2.92 0 4.84 1.16 6.3 2.52l2.34-2.34C19.33 2.52 16.2.92 12.48.92c-6.9 0-12.48 5.58-12.48 12.48s5.58 12.48 12.48 12.48c6.9 0 12.48-5.58 12.48-12.48 0-.8-.08-1.56-.22-2.32H12.48z" fill="#000"/></svg> );
const GithubIcon = (props) => ( <svg {...props} role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#000"/></svg> );


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
    const typeStyle = type === 'primary' ? RETRO_THEME.buttonPrimaryBg : RETRO_THEME.buttonSecondaryBg;
    return (
        <button type={isSubmit ? "submit" : "button"} onClick={onClick} disabled={disabled} className={`w-full px-5 py-2.5 text-base border-2 ${RETRO_THEME.panelBorder} ${RETRO_THEME.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const FormInput = ({ id, name, type, value, onChange, placeholder, icon: Icon, children }) => (
    <div className="relative">
        <label className="sr-only" htmlFor={id}>{placeholder}</label>
        {Icon && <Icon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-stone-400" />}
        <input id={id} name={name} type={type} value={value} onChange={onChange} required placeholder={placeholder} className={`w-full pl-11 pr-4 py-3 text-base border-2 ${RETRO_THEME.panelBorder} ${RETRO_THEME.inputBg} focus:outline-none`} />
        {children}
    </div>
);

const SocialButton = ({ provider, icon: Icon, href }) => (
    <Button type="secondary" onClick={() => (window.location.href = href)}>
        <Icon /> {provider}
    </Button>
);

const DecorativePanel = () => (
    <div className={`w-full md:w-2/5 p-8 flex-col justify-center items-center text-center hidden md:flex border-r-4 ${RETRO_THEME.panelBorder} ${RETRO_THEME.decorativePanelBg}`}>
        <div className="w-20 h-20 mb-4 border-4 border-stone-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-stone-800" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-stone-800 mb-2">DecodeByCode</h2>
        <p className="text-stone-600 max-w-xs text-base">Unlock your potential. Log in to access challenges and track your progress.</p>
    </div>
);

// --- Main Login Page Component ---
export default function LoginPage() {
    const { formData, error, isLoading, showPassword, handleChange, handleSubmit, setShowPassword } = useLoginForm();
    const navigate = useNavigate();

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 font-retro bg-stone-100">
            <div className={`relative z-10 w-full max-w-3xl flex flex-col md:flex-row bg-white rounded-none border-4 ${RETRO_THEME.panelBorder} shadow-chunky`}>
                <DecorativePanel />
                <div className="w-full md:w-3/5 p-8">
                    <div className="text-center md:text-left mb-6">
                        <h1 className="text-3xl font-bold text-stone-800 mb-1">Welcome Back!</h1>
                        <p className="text-base text-stone-500">Please sign in to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className={`p-3 border-2 ${RETRO_THEME.panelBorder} ${RETRO_THEME.errorBg} ${RETRO_THEME.errorText} text-sm`}>{error}</div>}
                        
                        <FormInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" icon={MailIcon} />
                        
                        <FormInput id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Password" icon={LockIcon}>
                            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute top-1/2 right-3 -translate-y-1/2 text-stone-400 hover:text-stone-800" onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </FormInput>

                        <Button type="primary" isSubmit={true} disabled={isLoading} className={RETRO_THEME.buttonPrimaryBg}>
                            {isLoading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className={`w-full border-t-2 border-dashed ${RETRO_THEME.panelBorder}`}></div></div>
                        <div className="relative flex justify-center text-base"><span className={`px-2 ${RETRO_THEME.panelBg} ${RETRO_THEME.textSecondary}`}>OR</span></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SocialButton provider="Google" icon={GoogleIcon} href={API_ENDPOINTS.GOOGLE_AUTH} />
                        <SocialButton provider="GitHub" icon={GithubIcon} href={API_ENDPOINTS.GITHUB_AUTH} />
                    </div>
                    
                    <div className="text-center mt-6">
                        <button type="button" onClick={() => navigate("/signup")} className="text-base text-stone-500 hover:text-stone-800 group transition-colors">
                            New here? <span className={`font-bold ${RETRO_THEME.textAccent} group-hover:underline`}>Create an account</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}