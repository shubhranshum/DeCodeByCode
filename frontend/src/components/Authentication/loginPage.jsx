import React from "react";
import { useState } from "react";
// import Navbar from "../Navbar/navbar.jsx"; // Assuming you have a Navbar component
// import { useUser } from "../../context/UserContext"; // Assuming you have a UserContext

// --- SVG Icons ---
// Using inline SVGs for better performance and customization without external libraries.

const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line>
    </svg>
);

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <path d="M20.94 11.06A10.02 10.02 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.08 0 9.2-3.78 9.84-8.63H12v-2.31h8.94Z" fill="#4285F4" stroke="none"/>
        <path d="M20.94 11.06A10.02 10.02 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.08 0 9.2-3.78 9.84-8.63" fill="none" stroke="#fff" strokeOpacity="0.2"/>
        <path d="M12 22c5.52 0 10-4.48 10-10" fill="#34A853" stroke="none"/>
        <path d="M2 12C2 6.48 6.48 2 12 2v10H2Z" fill="#FBBC05" stroke="none"/>
        <path d="M12 12v10c-5.52 0-10-4.48-10-10Z" fill="#EA4335" stroke="none"/>
    </svg>
);

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.11.793-.26.793-.578v-2.04c-3.338.726-4.042-1.61-4.042-1.61-.547-1.39-1.336-1.758-1.336-1.758-1.093-.746.083-.73.083-.73 1.21.085 1.845 1.242 1.845 1.242 1.074 1.84 2.817 1.31 3.506.997.11-.778.42-1.31.762-1.61-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.242-3.22-.124-.305-.54-1.53.118-3.187 0 0 1.015-.324 3.325 1.23a11.57 11.57 0 013.03-.407c1.028.004 2.063.14 3.03.407 2.31-1.554 3.325-1.23 3.325-1.23.658 1.657.242 2.882.118 3.187.774.84 1.243 1.91 1.243 3.22 0 4.61-2.806 5.624-5.48 5.922.432.372.816 1.103.816 2.222v3.292c0 .321.192.694.8.577A12.02 12.02 0 0024 12c0-6.627-5.373-12-12-12z" />
    </svg>
);


// --- Animated Background Component ---
const AnimatedDecodeByCodeBackground = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-full h-full bg-slate-900"></div>
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1), transparent 60%)',
                animation: 'pulse 8s infinite ease-in-out'
            }}
        ></div>
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                animation: 'moveGrid 20s linear infinite'
            }}
        ></div>
        <style>{`
            @keyframes pulse {
                0%, 100% { transform: scale(0.8); opacity: 0.1; }
                50% { transform: scale(1.2); opacity: 0.15; }
            }
            @keyframes moveGrid {
                0% { background-position: 0 0; }
                100% { background-position: 80px 80px; }
            }
        `}</style>
    </div>
);


// --- Decorative Panel Component ---
const DecorativePanel = () => (
    <div className="w-full md:w-2/5 bg-black/20 p-8 md:p-12 flex-col justify-center items-center text-center hidden md:flex">
        <div className="w-24 h-24 mb-6">
            <svg viewBox="0 0 100 100" className="animate-spin-slow">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: '#0ea5e9', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="141.3 141.3" strokeDashoffset="0" opacity="0.3" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="110 110" strokeDashoffset="110" opacity="0.5" transform="rotate(-45 50 50)" />
                 <path d="M50,20 L65,35 L65,65 L50,80 L35,65 L35,35 Z" fill="none" stroke="url(#grad1)" strokeWidth="2" opacity="0.8"/>
            </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-wide">
           Welcome to DecodeByCode
        </h2>
        <p className="text-slate-400 max-w-xs">
            Authenticate to access your coding challenges and become a master coder.
        </p>
    </div>
);


export default function LoginPage() {
  // --- STATE MANAGEMENT (UNCHANGED) ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const { login } = useUser(); // Example from context

  // --- FORM LOGIC (UNCHANGED) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const redirectToHome = () => {
    window.location.href = "/home";
  };

  const redirectToSignUp = () => {
    window.location.href = "/signup";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("username", data.user.username);
        // login(data.user); // Example context usage
        redirectToHome();
      } else {
        // Replace alert with a more modern notification system in a real app
        console.error("Login failed:", data.message);
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX STRUCTURE ---
  return (
    <>
      {/* <Navbar /> */}
      <main className="relative min-h-screen w-full flex items-center justify-center bg-slate-900 font-sans p-4">
        <AnimatedDecodeByCodeBackground />
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          
          <DecorativePanel />

          {/* --- Right Panel - Login Form --- */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-400">Sign in to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label className="sr-only" htmlFor="email">Email</label>
                <MailIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="dev@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="sr-only" htmlFor="password">Password</label>
                <LockIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 shadow-lg shadow-sky-900/50 hover:shadow-sky-800/60 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-slate-800/50 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { window.location.href = "http://localhost:3000/api/auth/google"; }}
                className="flex items-center justify-center gap-3 bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-2.5 font-medium hover:bg-slate-800/90 hover:border-slate-500 transition duration-200"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = "http://localhost:3000/api/auth/github"; }}
                className="flex items-center justify-center gap-3 bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-2.5 font-medium hover:bg-slate-800/90 hover:border-slate-500 transition duration-200"
              >
                <GithubIcon />
                <span>GitHub</span>
              </button>
            </div>
            
            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <button
                type="button"
                onClick={redirectToSignUp}
                className="text-slate-400 hover:text-white font-medium group transition-colors"
              >
                New to the DecodeByCode?{" "}
                <span className="text-sky-400 font-semibold group-hover:underline">
                  Create an account
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <style>{`
        .animate-spin-slow {
            animation: spin 10s linear infinite;
        }
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
      `}</style>
    </>
  );
}
