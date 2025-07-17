import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Navbar from "../Navbar/navbar.jsx";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        redirectToHome();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // CSS code snippet for creative element
  const codeSnippet = `
  function authenticate() {
    const user = findUser(email);
    if (user && verifyPassword(password)) {
      grantAccess();
      redirect('/dashboard');
    } else {
      showError('Invalid credentials');
    }
  }`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-orange-800 px-6 py-12">
        {/* Creative Coding Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-xs font-mono text-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: 0.3 + Math.random() * 0.3
              }}
            >
              {['<div>', '{ }', '() =>', 'import', 'const', 'function', 'return'].sort(() => 0.5 - Math.random())[0]}
            </div>
          ))}
        </div>

        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Left Panel - Code Preview */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-900 to-purple-800 p-8 hidden md:flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-8">
                <div className="bg-orange-500 w-3 h-3 rounded-full mr-2"></div>
                <div className="bg-yellow-500 w-3 h-3 rounded-full mr-2"></div>
                <div className="bg-green-500 w-3 h-3 rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-orange-300 mb-4">// authentication.js</h2>
            </div>
            
            <pre className="text-xs font-mono text-purple-200 overflow-hidden">
              {codeSnippet}
            </pre>
            
            <div className="mt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
                  <span className="text-orange-400 font-bold">{"</>"}</span>
                </div>
                <div>
                  <p className="text-sm text-indigo-200 font-medium">DevAuth System</p>
                  <p className="text-xs text-purple-300">Secure developer authentication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="w-full md:w-3/5 p-8">
            <div className="text-center mb-8">
              <div className="mx-auto bg-gradient-to-r from-orange-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Developer Access</h1>
              <p className="text-purple-300">Sign in to your coding environment</p>
            </div>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-5">
                <label className="text-orange-200 block mb-2 font-medium">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="dev@example.com"
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-orange-200 block mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5 text-gray-500 hover:text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-500 hover:text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Authenticating...
                  </>
                ) : (
                  "Access Developer Console"
                )}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-orange-300 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "http://localhost:3000/api/auth/google";
                }}
                className="flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2.5 font-medium shadow-sm hover:shadow-md transition duration-200 ease-in-out"
              >
                <img
                  src="data:image/png;base64,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"
                  alt="Google logo"
                  className="w-5 h-5"
                />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "http://localhost:3000/api/auth/github";
                }}
                className="flex items-center justify-center gap-3 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 font-medium hover:bg-gray-900 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12a12.02 12.02 0 008.207 11.387c.6.11.793-.26.793-.578 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.547-1.39-1.336-1.758-1.336-1.758-1.093-.746.083-.73.083-.73 1.21.085 1.845 1.242 1.845 1.242 1.074 1.84 2.817 1.31 3.506.997.11-.778.42-1.31.762-1.61-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.242-3.22-.124-.305-.54-1.53.118-3.187 0 0 1.015-.324 3.325 1.23a11.57 11.57 0 013.03-.407c1.028.004 2.063.14 3.03.407 2.31-1.554 3.325-1.23 3.325-1.23.658 1.657.242 2.882.118 3.187.774.84 1.243 1.91 1.243 3.22 0 4.61-2.806 5.624-5.48 5.922.432.372.816 1.103.816 2.222 0 1.606-.015 2.898-.015 3.292 0 .321.192.694.8.577A12.02 12.02 0 0024 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={redirectToSignUp}
                className="text-purple-300 hover:text-white font-medium group transition-colors"
              >
                New to DevHub?{" "}
                <span className="text-orange-400 font-semibold group-hover:underline">
                  Create account
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center w-full max-w-md">
          <p className="text-purple-400 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}