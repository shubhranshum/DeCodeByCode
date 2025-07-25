import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/userContext";
import Navbar from "./Navbar/navbar";
import { FaTrophy, FaCode, FaUsers, FaChartLine, FaGithub, FaDiscord, FaStar } from "react-icons/fa";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-purple-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-purple-400 hover:bg-purple-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
    errorText: "text-rose-700",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, className = '', type = 'primary' }) => {
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return (
        <button onClick={onClick} className={`px-8 py-4 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center justify-center gap-2 font-bold ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

// --- Page-Specific Components ---
const HeroSection = ({ onStartCoding }) => {
    const [typedText, setTypedText] = useState("");
    const codeText = `function welcome() {\n  console.log("Hello, Coder!");\n  // Start your journey here\n}`;

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < codeText.length) {
                setTypedText(prev => prev + codeText.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
        return () => clearInterval(typingInterval);
    }, [codeText]);

    return (
        <section className="py-20 px-6 text-center">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-5xl md:text-7xl font-bold mb-6"
            >
                Level Up Your <span className={retroThemeColors.textAccent}>Coding Skills</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl text-stone-600 max-w-3xl mx-auto mb-10"
            >
                Your ultimate hub for Competitive Programming – practice, compete, and grow, all in one place.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Button onClick={onStartCoding} type="primary">Start Coding Now</Button>
            </motion.div>
            <RetroCard className="max-w-2xl mx-auto mt-16 text-left p-4 bg-stone-800">
                <div className="flex items-center gap-2 border-b-2 border-stone-600 pb-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <pre className="whitespace-pre-wrap text-sm md:text-base">
                    <code>{typedText}</code>
                    <span className="animate-ping">_</span>
                </pre>
            </RetroCard>
        </section>
    );
};

const FeatureCard = ({ icon, title, description, color }) => (
    <RetroCard className="p-6 text-center h-full">
        <div className={`w-16 h-16 mx-auto mb-4 border-2 ${retroThemeColors.panelBorder} ${color.bg} flex items-center justify-center`}>
            {React.cloneElement(icon, { className: `text-3xl ${color.text}` })}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-base text-stone-600">{description}</p>
    </RetroCard>
);

const TestimonialCard = ({ testimonial, isActive }) => (
    <motion.div
        className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
    >
        <p className="text-2xl italic mb-4">"{testimonial.quote}"</p>
        <div className="flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < testimonial.rating ? "text-amber-400" : "text-stone-300"} />
            ))}
        </div>
        <div className="mt-4">
            <p className="font-bold text-xl">{testimonial.name}</p>
            <p className="text-stone-500">{testimonial.role}</p>
        </div>
    </motion.div>
);


// ================
// MAIN COMPONENT
// ================
export default function LandingPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const goToSignUp = () => {
        if (!user) navigate("/signup");
        else navigate("/home");
    };

    const features = [
        { icon: <FaCode />, title: "Coding Challenges", description: "Sharpen your skills with 1000+ problems across various topics.", color: { bg: 'bg-sky-100', text: 'text-sky-700'} },
        { icon: <FaTrophy />, title: "Daily Contests", description: "Compete in regular contests with real-time leaderboards and prizes.", color: { bg: 'bg-amber-100', text: 'text-amber-700'} },
        { icon: <FaUsers />, title: "Community Support", description: "Get help from our active community of 50,000+ programmers.", color: { bg: 'bg-purple-100', text: 'text-purple-700'} },
        { icon: <FaChartLine />, title: "Progress Tracking", description: "Visualize your growth with detailed statistics and skill graphs.", color: { bg: 'bg-emerald-100', text: 'text-emerald-700'} }
    ];
    const testimonials = [
        { name: "Alex Johnson", role: "Google SWE", quote: "DecodeByCode helped me land my dream job. The contests simulate real interview environments perfectly.", rating: 5 },
        { name: "Samantha Lee", role: "Competitive Programmer", quote: "I've improved my ranking from 1500 to 2100 in just 3 months with DecodeByCode's practice problems.", rating: 5 },
        { name: "Michael Chen", role: "University Student", quote: "The community discussions helped me understand complex algorithms I struggled with for months.", rating: 4 }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <div className={`min-h-screen ${retroThemeColors.bgPrimary} font-retro`}>
            <Navbar activePage={""}/>
            
            <HeroSection onStartCoding={goToSignUp} />
            
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose <span className={retroThemeColors.textAccent}>DecodeByCode</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-20 px-6 bg-stone-200 border-y-4 border-stone-800">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">What Our Coders Say</h2>
                    <RetroCard className="relative h-80 overflow-hidden">
                        {/* FIX: Corrected the mapping logic */}
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard 
                                    key={index} 
                                    testimonial={testimonial} 
                                    isActive={activeTestimonial === index} 
                                />
                            ))}
                        </AnimatePresence>
                    </RetroCard>
                    <div className="flex justify-center mt-8 gap-3">
                        {testimonials.map((_, index) => (
                            <button key={index} onClick={() => setActiveTestimonial(index)} className={`w-4 h-4 border-2 border-stone-800 transition-all ${activeTestimonial === index ? 'bg-purple-400' : 'bg-white'}`} />
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-20 px-6">
                <RetroCard className="max-w-4xl mx-auto text-center p-12 bg-teal-100">
                    <h2 className="text-4xl font-bold mb-6">Ready to Level Up?</h2>
                    <p className="text-lg text-stone-600 mb-8">Join our community of passionate coders and unlock your full potential.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={goToSignUp} className={retroThemeColors.buttonPrimaryBg}>Get Started For Free</Button>
                        <Button onClick={() => window.open('https://github.com', '_blank')} type="secondary"><FaGithub className="inline-block w-6 h-6 mr-2" /> View on GitHub</Button>
                    </div>
                </RetroCard>
            </section>
            
            <footer className={`py-12 px-6 border-t-4 ${retroThemeColors.panelBorder}`}>
                <div className="max-w-6xl mx-auto text-center text-stone-500">
                    <p>&copy; {new Date().getFullYear()} DecodeByCode. Built with 💙 by coders, for coders.</p>
                </div>
            </footer>
        </div>
    );
}
