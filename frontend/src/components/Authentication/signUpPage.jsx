import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBook,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);

  useEffect(() => {
    // Calculate password strength when password changes
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
      setPasswordSuggestions([]);
    }
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const suggestions = [];

    // Check length
    if (password.length >= 8) strength += 25;
    else suggestions.push("At least 8 characters");

    // Check uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    else suggestions.push("Include uppercase letters");

    // Check lowercase
    if (/[a-z]/.test(password)) strength += 25;
    else suggestions.push("Include lowercase letters");

    // Check numbers
    if (/\d/.test(password)) strength += 15;
    else suggestions.push("Include numbers");

    // Check special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    else suggestions.push("Include special characters");

    setPasswordSuggestions(suggestions);
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength < 70) {
      newErrors.password = "Password is too weak";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful signup
      const user = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Signup successful with data:", formData);

      // Redirect to login after successful signup
      setTimeout(() => {
        setIsSubmitting(false);
        redirectToLogin();
      }, 500);
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors({ general: "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-indigo-200">
            Join our community of learners and experts
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
        >
          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg flex items-center">
              <FiX className="mr-2 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="mb-5">
            <label className="text-indigo-100 block mb-2 font-medium flex items-center">
              <FiUser className="mr-2" />
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "focus:ring-red-500"
                    : "focus:ring-indigo-500"
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-500" />
              </div>
            </div>
            {errors.username && (
              <p className="mt-1 text-red-300 text-sm flex items-center">
                <FiX className="mr-1" /> {errors.username}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="text-indigo-100 block mb-2 font-medium flex items-center">
              <FiMail className="mr-2" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-indigo-500"
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-500" />
              </div>
            </div>
            {errors.email && (
              <p className="mt-1 text-red-300 text-sm flex items-center">
                <FiX className="mr-1" /> {errors.email}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="text-indigo-100 block mb-2 font-medium flex items-center">
              <FiLock className="mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "focus:ring-red-500"
                    : "focus:ring-indigo-500"
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-500 hover:text-gray-700" />
                ) : (
                  <FiEye className="text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>

            {/* Password strength meter */}
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-indigo-200">
                <span>Weak</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Password suggestions */}
            {passwordSuggestions.length > 0 && (
              <div className="mt-3 text-sm text-indigo-200">
                <p className="font-medium mb-1">Password should include:</p>
                <ul className="space-y-1">
                  {passwordSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center">
                      <FiX className="mr-2 text-red-400 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-red-300 text-sm flex items-center">
                <FiX className="mr-1" /> {errors.password}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="text-indigo-100 block mb-2 font-medium flex items-center">
              <FiLock className="mr-2" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "focus:ring-red-500"
                    : "focus:ring-indigo-500"
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="text-gray-500 hover:text-gray-700" />
                ) : (
                  <FiEye className="text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-red-300 text-sm flex items-center">
                <FiX className="mr-1" /> {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="text-indigo-100 block mb-2 font-medium flex items-center">
              <FiBook className="mr-2" />
              College/Institution
              <span className="text-sm text-indigo-300 ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Your college or institution"
                className="w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBook className="text-gray-500" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:opacity-80"
          >
            {isSubmitting ? (
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              (window.location.href = "http://localhost:3000/api/auth/google")
            }
            className="w-full mt-4 flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2 font-semibold hover:bg-gray-100 transition"
          >
            <img
              src="data:image/jpeg;base64,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"
              alt="Google logo"
              className="w-5 h-5"
            />
            Continue with Google
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

          <div className="mt-6 text-center">
            <p className="text-indigo-200">
              Already have an account?{" "}
              <button
                type="button"
                onClick={redirectToLogin}
                className="text-white font-semibold hover:underline focus:outline-none"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-indigo-300 text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
