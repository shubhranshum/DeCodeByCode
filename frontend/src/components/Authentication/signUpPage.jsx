import { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiBook, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";

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
      setErrors(prev => ({...prev, [name]: ""}));
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful signup
      const user = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        
      })
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
          <p className="text-indigo-200">Join our community of learners and experts</p>
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
                  errors.username ? "focus:ring-red-500" : "focus:ring-indigo-500"
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
                  errors.password ? "focus:ring-red-500" : "focus:ring-indigo-500"
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
                  errors.confirmPassword ? "focus:ring-red-500" : "focus:ring-indigo-500"
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
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