import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiBook, FiEye, FiEyeOff } from "react-icons/fi";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-purple-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-purple-400 hover:bg-purple-500",
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
    errorText: "text-rose-600",
    decorativePanelBg: "bg-sky-100", // This is not used in the final component but kept for consistency
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', isSubmit = false }) => (
    <button type={isSubmit ? "submit" : "button"} onClick={onClick} disabled={disabled} className={`w-full px-5 py-2.5 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-3 ${retroThemeColors.buttonPrimaryBg} ${className}`}>
        {children}
    </button>
);

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

const FormInput = ({ id, name, type, value, onChange, placeholder, icon: Icon, children }) => (
    <div className="relative">
        <label htmlFor={id} className="sr-only">{placeholder}</label>
        {Icon && <Icon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-stone-400" />}
        <input id={id} name={name} type={type} value={value} onChange={onChange} required placeholder={placeholder} className={`w-full pl-12 pr-4 py-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`} />
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

// ================
// MAIN COMPONENT
// ================
export default function SignUpPage() {
    // --- STATE MANAGEMENT ---
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
        setPasswordStrength(strength);
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
        if (passwordStrength < 70) newErrors.password = "Password is too weak";
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
            if (!response.ok) throw new Error("Sign up failed. Please try again.");
            navigate("/login");
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 font-retro">
            <RetroCard className="w-full max-w-md">
                <div className={`p-4 text-center border-b-4 ${retroThemeColors.panelBorder} ${retroThemeColors.decorativePanelBg}`}>
                    <h1 className="text-3xl font-bold text-stone-800">Create Your Account</h1>
                    <p className={`text-base mt-1 ${retroThemeColors.textAccent}`}>Join the Community!</p>
                </div>

                <form onSubmit={handleSignUp} className="p-6 space-y-3">
                    {errors.general && <div className={`p-3 mb-3 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.errorBg} ${retroThemeColors.errorText} text-sm`}>{errors.general}</div>}

                    <FormInput id="username" name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Username" icon={FiUser} />
                    {errors.username && <p className={`text-sm ${retroThemeColors.errorText}`}>{errors.username}</p>}

                    <FormInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" icon={FiMail} />
                    {errors.email && <p className={`text-sm ${retroThemeColors.errorText}`}>{errors.email}</p>}

                    <FormInput id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Create Password" icon={FiLock}>
                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 hover:text-stone-800">
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </FormInput>
                    <PasswordStrengthMeter strength={passwordStrength} />
                    {errors.password && <p className={`text-sm ${retroThemeColors.errorText}`}>{errors.password}</p>}
                    
                    <FormInput id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" icon={FiLock}>
                        <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 hover:text-stone-800">
                            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </FormInput>
                    {errors.confirmPassword && <p className={`text-sm ${retroThemeColors.errorText}`}>{errors.confirmPassword}</p>}
                    
                    <FormInput id="college" name="college" type="text" value={formData.college} onChange={handleChange} placeholder="Institution (Optional)" icon={FiBook} />

                    <div className="pt-3">
                        <Button isSubmit disabled={isSubmitting}>
                            {isSubmitting ? "Creating Account..." : "Register Account"}
                        </Button>
                    </div>
                </form>

                <div className={`p-4 text-center border-t-2 border-dashed border-stone-300`}>
                    <p className="text-base text-stone-500">
                        Already have an account?{" "}
                        <button onClick={() => navigate('/login')} className={`font-bold ${retroThemeColors.textAccent} hover:underline`}>Sign In</button>
                    </p>
                </div>
            </RetroCard>
        </div>
    );
}