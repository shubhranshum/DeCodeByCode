import { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBook,
  FiEye,
  FiEyeOff,
  FiX,
  FiCode,
  FiTerminal,
  FiDatabase,
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
  const [activeInput, setActiveInput] = useState(null);
  const canvasRef = useRef(null);

  // Competitive programming problems for background
  const problems = [
    `function solveTwoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    `function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`
  ];

  // Initialize canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Competitive programming symbols
    const symbols = ['{}', '()', '[]', '<>', ';', '=', '!', '&', '|', '^', '%', '#', '*', '/', '\\'];
    const particles = [];
    const particleCount = Math.min(200, Math.floor(canvas.width * canvas.height / 3000));
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 8;
        this.speed = Math.random() * 2 + 1;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
      }
      
      update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
        
        // React to active input
        if (activeInput) {
          const dx = this.x - activeInput.x;
          const dy = this.y - activeInput.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            this.x += dx * 0.03;
            this.y += dy * 0.03;
          }
        }
      }
      
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = '#f97316';
        ctx.font = `${this.size}px monospace`;
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw competitive programming problems in background
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = '#c084fc';
      ctx.font = '14px monospace';
      problems.forEach((problem, i) => {
        const lines = problem.split('\n');
        lines.forEach((line, j) => {
          ctx.fillText(line, 50, 100 + i * 200 + j * 20);
        });
      });
      ctx.globalAlpha = 1;
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeInput]);

  const handleInputFocus = (name, position) => {
    setActiveInput({ name, ...position });
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  useEffect(() => {
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

    if (password.length >= 8) strength += 25;
    else suggestions.push("At least 8 characters");

    if (/[A-Z]/.test(password)) strength += 25;
    else suggestions.push("Include uppercase letters");

    if (/[a-z]/.test(password)) strength += 25;
    else suggestions.push("Include lowercase letters");

    if (/\d/.test(password)) strength += 15;
    else suggestions.push("Include numbers");

    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    else suggestions.push("Include special characters");

    setPasswordSuggestions(suggestions);
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const user = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setTimeout(() => {
        setIsSubmitting(false);
        redirectToLogin();
      }, 500);
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 70) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-orange-800 px-4 py-8 relative overflow-hidden">
      {/* Animated Competitive Programming Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Floating Leaderboard */}
      <div className="absolute top-8 right-8 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 w-64">
        <h3 className="text-orange-400 font-bold mb-3 flex items-center">
          <FiTerminal className="mr-2" /> Weekly Leaderboard
        </h3>
        <ul className="space-y-2">
          {['@code_wizard', '@algo_master', '@binary_guru', '@data_struct', '@leet_champ'].map((user, i) => (
            <li key={i} className="flex items-center justify-between text-purple-200">
              <div className="flex items-center">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                  i === 0 ? 'bg-yellow-500 text-black' : 
                  i === 1 ? 'bg-gray-300 text-black' : 
                  i === 2 ? 'bg-amber-700 text-white' : 'bg-indigo-900'
                }`}>
                  {i + 1}
                </span>
                <span className={i < 3 ? "font-bold" : ""}>{user}</span>
              </div>
              <span className="text-orange-400">{2500 - i * 200} pts</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-10">
        {/* Left Panel - Code Preview */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-900 to-purple-800 p-8 hidden md:flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <div className="bg-orange-500 w-3 h-3 rounded-full mr-2"></div>
              <div className="bg-yellow-500 w-3 h-3 rounded-full mr-2"></div>
              <div className="bg-green-500 w-3 h-3 rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold text-orange-300 mb-4">
              // account-service.js
            </h2>
          </div>

          <pre className="text-xs font-mono text-purple-200 overflow-hidden">
            {`function createAccount(username, email, password) {
  const newUser = {
    id: generateId(),
    username,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };
  
  database.save(newUser);
  return newUser;
}`}
          </pre>

          <div className="mt-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
                <FiDatabase className="text-orange-400 text-lg" />
              </div>
              <div>
                <p className="text-sm text-indigo-200 font-medium">
                  DevHub Auth System
                </p>
                <p className="text-xs text-purple-300">
                  Secure account creation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="w-full md:w-3/5 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-orange-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FiUser className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-purple-300">Join our community of Decoders</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg flex items-center">
              <FiX className="mr-2 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSignUp}>
            <div className="mb-5">
              <label className="text-orange-200 block mb-2 font-medium flex items-center">
                <FiUser className="mr-2" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={(e) => 
                    handleInputFocus('username', {
                      x: e.target.getBoundingClientRect().left + e.target.offsetWidth / 2,
                      y: e.target.getBoundingClientRect().top + e.target.offsetHeight / 2
                    })
                  }
                  onBlur={handleInputBlur}
                  placeholder="Enter your username"
                  className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "focus:ring-red-500"
                      : "focus:ring-orange-500"
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
              <label className="text-orange-200 block mb-2 font-medium flex items-center">
                <FiMail className="mr-2" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={(e) => 
                    handleInputFocus('email', {
                      x: e.target.getBoundingClientRect().left + e.target.offsetWidth / 2,
                      y: e.target.getBoundingClientRect().top + e.target.offsetHeight / 2
                    })
                  }
                  onBlur={handleInputBlur}
                  placeholder="dev@example.com"
                  className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "focus:ring-red-500"
                      : "focus:ring-orange-500"
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
              <label className="text-orange-200 block mb-2 font-medium flex items-center">
                <FiLock className="mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={(e) => 
                    handleInputFocus('password', {
                      x: e.target.getBoundingClientRect().left + e.target.offsetWidth / 2,
                      y: e.target.getBoundingClientRect().top + e.target.offsetHeight / 2
                    })
                  }
                  onBlur={handleInputBlur}
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500"
                      : "focus:ring-orange-500"
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
                  <p className="font-medium mb-1">Password requirements:</p>
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
              <label className="text-orange-200 block mb-2 font-medium flex items-center">
                <FiLock className="mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={(e) => 
                    handleInputFocus('confirmPassword', {
                      x: e.target.getBoundingClientRect().left + e.target.offsetWidth / 2,
                      y: e.target.getBoundingClientRect().top + e.target.offsetHeight / 2
                    })
                  }
                  onBlur={handleInputBlur}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "focus:ring-red-500"
                      : "focus:ring-orange-500"
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
              <label className="text-orange-200 block mb-2 font-medium flex items-center">
                <FiBook className="mr-2" />
                Institution
                <span className="text-sm text-purple-300 ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  onFocus={(e) => 
                    handleInputFocus('college', {
                      x: e.target.getBoundingClientRect().left + e.target.offsetWidth / 2,
                      y: e.target.getBoundingClientRect().top + e.target.offsetHeight / 2
                    })
                  }
                  onBlur={handleInputBlur}
                  placeholder="University or company"
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBook className="text-gray-500" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:opacity-80"
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
                "Register Developer Account"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-transparent text-orange-300 font-medium">
                Or register with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() =>
                (window.location.href = "http://localhost:3000/api/auth/google")
              }
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
            <p className="text-purple-300">
              Already have an account?{" "}
              <button
                type="button"
                onClick={redirectToLogin}
                className="text-orange-400 font-semibold hover:underline focus:outline-none"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center w-full max-w-md">
        <p className="text-purple-400 text-sm">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
