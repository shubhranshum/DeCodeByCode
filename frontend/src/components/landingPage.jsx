import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Navbar from "./Navbar/navbar";
import { UserContext } from "../context/userContext";
import { useEffect, useState, useContext} from "react";
import { FaTrophy, FaCode, FaUsers, FaChartLine, FaLightbulb, FaGithub, FaDiscord } from "react-icons/fa";

export default function LandingPage() {
  window.href = "/";
  const { user } = useContext(UserContext);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const goToSignUp = () => {
    if(!user) window.location.href = "/signup";
    else window.location.href = "/home";
  }

  // Features data
  const features = [
    {
      icon: <FaCode className="text-3xl" />,
      title: "Coding Challenges",
      description: "Sharpen your skills with 1000+ problems across various difficulty levels and topics."
    },
    {
      icon: <FaTrophy className="text-3xl" />,
      title: "Daily Contests",
      description: "Compete in regular contests with real-time leaderboards and prizes."
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Community Support",
      description: "Get help from our active community of 50,000+ programmers."
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Progress Tracking",
      description: "Visualize your growth with detailed statistics and skill graphs."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Google SWE",
      quote: "DecodeByCode helped me land my dream job. The contests simulate real interview environments perfectly.",
      rating: 5
    },
    {
      name: "Samantha Lee",
      role: "Competitive Programmer",
      quote: "I've improved my ranking from 1500 to 2100 in just 3 months with DecodeByCode's practice problems.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "University Student",
      quote: "The community discussions helped me understand complex algorithms I struggled with for months.",
      rating: 4
    }
  ];

  // Stats data
  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "1M+", label: "Submissions" },
    { value: "500+", label: "Problems" },
    { value: "200+", label: "Contests" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen text-white">
      <Navbar activePage={""}/>
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-16 pb-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-orange-500/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 20}px`,
                height: `${Math.random() * 200 + 20}px`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          
          {/* Floating code snippets */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-gray-400 font-mono text-xs opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {i % 3 === 0 ? "function solve() {" : 
               i % 3 === 1 ? "const dp = new Array(n);" : 
               "return binarySearch(arr);"}
            </motion.div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-6xl w-full mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6"
          >
            Level Up Your <span className="text-orange-400">Coding Skills</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Your ultimate hub for Competitive Programming – practice problems, contests, discussions, and progress tracking, all in one place.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Button 
              className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
              onClick={goToSignUp}
            >
              Start Coding Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white bg-transparent hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-xl transition-all hover:scale-105"
            >
              Explore Challenges
            </Button>
          </motion.div>
          
          {/* Stats counter */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-orange-400">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="text-orange-400">DecodeByCode</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to excel in competitive programming and technical interviews
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-orange-500/50 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="text-orange-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-orange-400">Coders Say</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of developers who have transformed their coding skills
            </p>
          </motion.div>
          
          <div className="relative h-80">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 rounded-2xl border ${
                  activeTestimonial === index 
                    ? 'border-orange-500/50 shadow-lg shadow-orange-500/10' 
                    : 'border-white/5 opacity-0 pointer-events-none'
                } transition-all duration-500`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
                animate={{ 
                  opacity: activeTestimonial === index ? 1 : 0,
                  x: activeTestimonial === index ? 0 : (index % 2 === 0 ? 100 : -100)
                }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-lg italic mb-6">"{testimonial.quote}"</p>
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonial.rating ? "text-orange-400" : "text-gray-700"} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTestimonial === index ? 'bg-orange-500 w-6' : 'bg-gray-700'
                }`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#1e293b] to-[#0f172a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 p-12 rounded-3xl border border-white/10 backdrop-blur-sm"
          >
            <FaLightbulb className="text-5xl text-orange-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="text-orange-400">Level Up</span> Your Coding Journey?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of passionate coders and unlock your full potential with CodeVerse
            </p>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
              onClick={goToSignUp}
            >
              Get Started For Free
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#0a0f1d] py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-orange-500">Code</span>Verse
              </h3>
              <p className="text-gray-400 mb-4">
                The ultimate platform for competitive programmers to learn, practice, and compete.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <FaGithub className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <FaDiscord className="text-xl" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest contests and features.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-orange-500"
                />
                <button className="bg-orange-500 hover:bg-orange-600 px-4 rounded-r-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">
            <p>Built with 💙 by Competitive Programmers for Competitive Programmers. © {new Date().getFullYear()} CodeVerse</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Star icon component for ratings
const FaStar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);