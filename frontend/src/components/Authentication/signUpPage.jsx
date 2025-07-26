import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiBook, FiEye, FiEyeOff } from "react-icons/fi";

// --- RETRO THEME DEFINITIONS (Matching Login Page) ---
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
    errorText: "text-rose-600",
    decorativePanelBg: "bg-teal-100",
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

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

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

const PasswordStrengthMeter = ({ strength }) => {
    const getColor = () => {
        if (strength < 30) return "bg-rose-400";
        if (strength < 70) return "bg-amber-400";
        return "bg-emerald-400";
    };
    return (
        <div className={`w-full bg-stone-200 border-2 ${retroThemeColors.panelBorder}`}>
            <div className={`h-2 transition-all ${getColor()}`} style={{ width: `${strength}%` }} />
        </div>
    );
};

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

// ================
// MAIN COMPONENT
// ================
export default function SignUpPage() {
    // --- STATE MANAGEMENT (Unchanged) ---
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", college: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    // --- FORM LOGIC (Unchanged) ---
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 15;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;
        setPasswordStrength(strength > 100 ? 100 : strength);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "password") calculatePasswordStrength(value);
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email address is invalid";
        if (passwordStrength < 70) newErrors.password = "Password is too weak. Include uppercase, lowercase, numbers, and symbols.";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Sign up failed. Please try again.");
            }
            navigate("/login");
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
         <main className={`min-h-screen w-full flex items-center justify-center p-4 ${TEAL_THEME.bgPrimary}`} style={{ fontFamily: "'Courier Prime', monospace" }}>
            <div className={`relative z-10 w-full max-w-4xl flex flex-col md:flex-row ${TEAL_THEME.panelBg} rounded-none border-4 ${TEAL_THEME.panelBorder} shadow-[10px_10px_0_0_#004d40]`}>
                <DecorativePanel />
                <div className="w-full md:w-3/5 p-8">
                    <div className="text-center md:text-left mb-6">
                        <h1  className={`text-3xl font-bold ${TEAL_THEME.textPrimary} mb-2`} style={{ fontFamily: "'Press Start 2P', cursive" }}>Create Your Account</h1>
                        <p className={`text-base ${TEAL_THEME.textSecondary}`}>Join the Community!</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-5">
                        {errors.general && <div className={`p-3 border-2 ${retroThemeColors.panelBorder} bg-rose-100 text-rose-700 text-sm`}>{errors.general}</div>}

                        <div>
                            <FormInput id="username" name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Username" icon={FiUser} />
                            {errors.username && <p className={`text-sm mt-1 ${retroThemeColors.errorText}`}>{errors.username}</p>}
                        </div>

                        <div>
                            <FormInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" icon={FiMail} />
                            {errors.email && <p className={`text-sm mt-1 ${retroThemeColors.errorText}`}>{errors.email}</p>}
                        </div>
                        
                        <div>
                            <FormInput id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Create Password" icon={FiLock}>
                                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 hover:text-stone-800">
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </FormInput>
                            <PasswordStrengthMeter strength={passwordStrength} />
                            {errors.password && <p className={`text-sm mt-1 ${retroThemeColors.errorText}`}>{errors.password}</p>}
                        </div>
                        
                        <div>
                            <FormInput id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" icon={FiLock}>
                                <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 hover:text-stone-800">
                                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </FormInput>
                            {errors.confirmPassword && <p className={`text-sm mt-1 ${retroThemeColors.errorText}`}>{errors.confirmPassword}</p>}
                        </div>
                        
                        <FormInput id="college" name="college" type="text" value={formData.college} onChange={handleChange} placeholder="Institution (Optional)" icon={FiBook} />

                        <div className="pt-4">
                            <Button isSubmit disabled={isSubmitting}>
                                {isSubmitting ? "Creating Account..." : "Register Account"}
                            </Button>
                        </div>
                    </form>

                    <div className={`p-4 text-center mt-6 border-t-2 border-dashed border-stone-300`}>
                        <p className="text-base text-stone-500">
                            Already have an account?{" "}
                            <button onClick={() => navigate('/login')} className={`font-bold ${retroThemeColors.textAccent} hover:underline`}>Sign In</button>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
