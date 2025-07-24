import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Github, Instagram, Facebook, Youtube, Users, Heart, Shield } from 'lucide-react';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    decorativePanelBg: "bg-sky-100",
};

// --- Reusable UI Component ---
const RetroCard = ({ children, className = '', ...props }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`} {...props}>
        {children}
    </div>
);

// --- Page Data ---
const team = [
    {
        id: 'shubhranshu',
        name: 'Shubhranshu Mishra',
        role: 'Founder & Full-Stack Developer',
        bio: 'A B.Tech student with a passion for architecting robust systems. Shubhranshu is the visionary who laid the foundation of DecodeByCode, turning a simple idea into a thriving platform for coders who love to compete and improve.',
        img: 'https://i.ibb.co/JFtDB7N5/Chat-GPT-Image-Jul-24-2025-05-27-22-PM-removebg-preview.png' 
    },
    {
        id: 'omvrit',
        name: 'Om Vrit',
        role: 'Co-Founder & Full-Stack Developer',
        bio: 'Also a B.Tech student, Omvrit is the creative force behind the platform\'s unique look and feel. He specializes in crafting intuitive user experiences that are both functional and delightful to use.',
        img: 'https://i.ibb.co/zhTZyb90/Chat-GPT-Image-Jul-24-2025-05-19-02-PM.png'
    },
    {
        id: 'app',
        name: 'About DecodeByCode',
        role: 'Our Mission',
        bio: 'DecodeByCode was born from a simple idea: to create a space where students and aspiring developers can not only test their coding skills but also learn and grow together. We believe in the power of community and friendly competition to unlock true potential. Our goal is to provide a platform that is both challenging and supportive, helping coders at all levels to achieve their best.'
    }
];

// --- Team Member Image Component (With Highlight Effect) ---
const TeamMemberImage = ({ member, onHover }) => (
    <motion.div 
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.05, y: -5 }}
        onMouseEnter={() => onHover(member.id)}
    >
        <img
            src={member.img}
            alt={member.name}
            // FIX: Increased size and ensured aspect ratio is handled correctly
            className={`w-[433px] h-[433px] max-w-full max-h-full object-cover transition-all duration-300 group-hover:drop-shadow-[0_0_12px_#f59e0b]`}
        />
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 ${retroThemeColors.textAccent} transition-all duration-300 opacity-0 group-hover:opacity-100`}></div>
    </motion.div>
);

// --- Contact Button Component ---
const ContactButton = ({ href, icon, text, color }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`flex items-center gap-3 p-4 border-2 ${retroThemeColors.panelBorder} ${color.bg} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`}
    >
        <div className={`w-8 h-8 flex items-center justify-center border-2 ${retroThemeColors.panelBorder} ${color.iconBg} ${color.iconText}`}>
            {icon}
        </div>
        <span className={`font-bold text-lg ${color.text}`}>{text}</span>
    </a>
);

// --- Value Card Component ---
const ValueCard = ({ icon, title, children }) => (
    <div className={`p-6 border-2 ${retroThemeColors.panelBorder} bg-stone-50 h-full`}>
        <div className="flex items-center gap-4 mb-3">
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.decorativePanelBg} ${retroThemeColors.textAccent}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-base text-stone-600">{children}</p>
    </div>
);


// ================
// MAIN COMPONENT
// ================
export default function AboutUs() {
    const [activeId, setActiveId] = useState('app');

    const activeMember = team.find(m => m.id === activeId) || team.find(m => m.id === 'app');

    return (
        <div className={`min-h-screen ${retroThemeColors.bgPrimary} px-4 py-16 font-retro`}>
            <div className="max-w-6xl mx-auto">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left Column: Dynamic Bio Display */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold">
                            Our <span className={retroThemeColors.textAccent}>Story</span>
                        </h1>
                        <RetroCard className="p-8 min-h-[24rem] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h2 className="text-4xl font-bold">{activeMember.name}</h2>
                                    <p className={`text-lg ${retroThemeColors.textSecondary} mb-4`}>{activeMember.role}</p>
                                    <p className="text-base md:text-lg leading-relaxed">{activeMember.bio}</p>
                                </motion.div>
                            </AnimatePresence>
                        </RetroCard>
                    </div>

                    {/* Right Column: Team Members */}
                    <div 
                        className="flex items-center justify-center"
                        onMouseLeave={() => setActiveId('app')} // Reset to default
                    >
                         <div className="grid grid-cols-2 gap-8">
                            {team.filter(m => m.id !== 'app').map(member => (
                                <TeamMemberImage key={member.id} member={member} onHover={setActiveId} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Our Values Section */}
                <RetroCard className="p-8 mb-16">
                    <h2 className={`text-4xl font-bold text-center mb-8 ${retroThemeColors.textPrimary}`}>Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ValueCard icon={<Users size={28} />} title="Community">
                            We believe that coding is a team sport. Our platform is built to foster collaboration, mentorship, and friendly competition among peers.
                        </ValueCard>
                        <ValueCard icon={<Heart size={28} />} title="Learning">
                            Every problem is an opportunity to learn something new. We are committed to providing high-quality challenges that push you to grow as a developer.
                        </ValueCard>
                        <ValueCard icon={<Shield size={28} />} title="Growth">
                            Our ultimate goal is to help you grow. From your first solved problem to topping the leaderboards, we're here to support your journey.
                        </ValueCard>
                    </div>
                </RetroCard>

                {/* Contact Section */}
                <RetroCard className="p-8">
                    <h2 className={`text-4xl font-bold text-center mb-8 ${retroThemeColors.textPrimary}`}>Connect With Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                             <h3 className="text-2xl font-bold text-center">Contact</h3>
                             <ContactButton href="mailto:decodebycode.pvt.ltd@gmail.com" icon={<Mail />} text="Email Us" color={{ bg: 'bg-rose-100', text: 'text-rose-800', iconBg: 'bg-rose-200', iconText: 'text-rose-800' }} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-center">Follow</h3>
                            <ContactButton href="#" icon={<Linkedin />} text="LinkedIn" color={{ bg: 'bg-sky-100', text: 'text-sky-800', iconBg: 'bg-sky-200', iconText: 'text-sky-800' }} />
                            <ContactButton href="#" icon={<Instagram />} text="Instagram" color={{ bg: 'bg-purple-100', text: 'text-purple-800', iconBg: 'bg-purple-200', iconText: 'text-purple-800' }} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-center">Watch & Contribute</h3>
                            <ContactButton href="#" icon={<Github />} text="GitHub" color={{ bg: 'bg-stone-200', text: 'text-stone-800', iconBg: 'bg-stone-300', iconText: 'text-stone-800' }} />
                            <ContactButton href="#" icon={<Youtube />} text="YouTube" color={{ bg: 'bg-red-100', text: 'text-red-800', iconBg: 'bg-red-200', iconText: 'text-red-800' }} />
                        </div>
                    </div>
                </RetroCard>

                <footer className="mt-16 text-center text-stone-400 text-base">
                  © {new Date().getFullYear()} DecodeByCode. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
