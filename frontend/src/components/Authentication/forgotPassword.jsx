import React, { useState } from "react";
// In a real app, you would use this. For this example, we'll mock navigation.
// import { useNavigate } from "react-router-dom";

// --- MOCK useNavigate ---
// To make this component runnable in isolation, we'll create a mock hook.
import { useNavigate } from "react-router-dom";

const API_ENDPOINTS = {
  FORGOT_PASSWORD: "http://localhost:3000/auth/forgot-password", // Using relative paths is better practice
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
const MailIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);
const ArrowLeftIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

// --- Custom Hook for Form Logic ---
const useForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccessMessage("");
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    
  

    try {
         
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD + "/" + email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
        
     });
     console.log(response.status);
      if(response.ok) {
        console.log(`Password reset link sent to ${email}.`);
        setSuccessMessage(
        "Success! If an account with that email exists, a password reset link has been sent."
      );
      setEmail("");
      }
      
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    error,
    isLoading,
    successMessage,
    handleChange,
    handleSubmit,
  };
};

// --- Reusable UI Components ---
const Button = ({
  children,
  onClick,
  disabled,
  className = "",
  type = "primary",
  isSubmit = false,
}) => {
  const typeStyle = type === "primary" ? TEAL_THEME.buttonPrimaryBg : "";
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

const FormInput = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
}) => (
  <div className="relative mb-4">
    <label className="sr-only" htmlFor={id}>
      {placeholder}
    </label>
    {Icon && (
      <Icon
        className={`absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 ${TEAL_THEME.textSecondary}`}
      />
    )}
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
  </div>
);

// --- Main Forgot Password Page Component ---
export default function App() {
  const {
    email,
    error,
    isLoading,
    successMessage,
    handleChange,
    handleSubmit,
  } = useForgotPasswordForm();
  const navigate = useNavigate();

  return (
    <main
      className={`min-h-screen w-full flex items-center justify-center p-4 ${TEAL_THEME.bgPrimary}`}
      style={{ fontFamily: "'Courier Prime', monospace" }}
    >
      <div
        className={`relative z-10 w-full max-w-md flex flex-col ${TEAL_THEME.panelBg} rounded-none border-4 ${TEAL_THEME.panelBorder} shadow-[10px_10px_0_0_#004d40]`}
      >
        <div className="w-full p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1
              className={`text-2xl sm:text-3xl font-bold ${TEAL_THEME.textPrimary} mb-2`}
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              Forgot Password?
            </h1>
            <p className={`text-base ${TEAL_THEME.textSecondary}`}>
              No worries! Enter your email to reset it.
            </p>
          </div>

          {successMessage ? (
            <div
              className={`p-4 border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.successBg} ${TEAL_THEME.successText} text-sm mb-6 text-center`}
            >
              {successMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div
                  className={`p-3 border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.errorBg} ${TEAL_THEME.errorText} text-sm mb-4`}
                >
                  {error}
                </div>
              )}

              <FormInput
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your Email Address"
                icon={MailIcon}
              />

              <Button type="primary" isSubmit={true} disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
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
      <div
        className={`absolute top-10 left-10 w-10 h-10 border-4 ${TEAL_THEME.panelBorder} bg-[#80cbc4] transform -rotate-12 z-0 opacity-50`}
      ></div>
      <div
        className={`absolute bottom-10 right-10 w-14 h-14 border-4 ${TEAL_THEME.panelBorder} bg-[#b2dfdb] transform rotate-6 z-0 opacity-50`}
      ></div>
    </main>
  );
}
