import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Navbar from "../Navbar/navbar.jsx";

export default function LoginPage() {
  window.href = "/login";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Added for spinner
  const [showPassword, setShowPassword] = useState(false); // Added for password toggle

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
    setIsLoading(true); // Start loading animation

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
      console.log("Login response:", data);
      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("username", data.user.username); // Store username in localStorage
        redirectToHome();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-white"
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
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-indigo-200">Sign in to continue your journey</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="mb-5">
              <label className="text-indigo-100 block mb-2 font-medium">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="text-indigo-100 block mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
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
                  Signing In...
                </>
              ) : (
                "Log In"
              )}
            </button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={redirectToSignUp}
                className="text-indigo-200 hover:text-white font-medium group transition-colors"
              >
                Don't have an account?{" "}
                <span className="text-white font-semibold underline group-hover:no-underline">
                  Sign up now
                </span>
              </button>
            </div>
          </form>
          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:3000/api/auth/google";
            }}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition duration-200 ease-in-out"
          >
            <img
              src="data:image/jpeg;base64,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"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:3000/api/auth/github";
            }}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-black text-white border border-gray-700 rounded-lg px-6 py-2.5 font-medium hover:bg-gray-900 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12a12.02 12.02 0 008.207 11.387c.6.11.793-.26.793-.578 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.547-1.39-1.336-1.758-1.336-1.758-1.093-.746.083-.73.083-.73 1.21.085 1.845 1.242 1.845 1.242 1.074 1.84 2.817 1.31 3.506.997.11-.778.42-1.31.762-1.61-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.242-3.22-.124-.305-.54-1.53.118-3.187 0 0 1.015-.324 3.325 1.23a11.57 11.57 0 013.03-.407c1.028.004 2.063.14 3.03.407 2.31-1.554 3.325-1.23 3.325-1.23.658 1.657.242 2.882.118 3.187.774.84 1.243 1.91 1.243 3.22 0 4.61-2.806 5.624-5.48 5.922.432.372.816 1.103.816 2.222 0 1.606-.015 2.898-.015 3.292 0 .321.192.694.8.577A12.02 12.02 0 0024 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Sign in with GitHub</span>
          </button>

          <div className="mt-8 text-center">
            <p className="text-indigo-300 text-sm">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
