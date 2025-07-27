import React, { useState, useEffect, useCallback, useMemo, useContext, createContext, Fragment } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    EnvelopeIcon,
    UsersIcon,
    HeartIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Navbar/Navbar"; // Assuming Navbar is in the same directory for this example

// --- SVG ICONS for Social Media (Not in Heroicons) ---
const GithubIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);
const LinkedinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const InstagramIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const YoutubeIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

// --- RETRO THEME COLORS ---
const TEAL_THEME = {
    bgPrimary: "bg-[#e0f2f1]",
    textPrimary: "text-[#004d40]",
    textSecondary: "text-[#00796b]",
    textAccent: "text-[#00bfa5]",
    panelBg: "bg-[#f0fdfa]",
    panelBorder: "border-[#004d40]",
    buttonSecondaryBg: "bg-[#b2dfdb]",
    decorativePanelBg: "bg-[#b2dfdb]",
};

// --- Reusable UI Component ---
const RetroCard = ({ children, className = "", ...props }) => (
  <div
    className={`border-4 ${TEAL_THEME.panelBorder} ${TEAL_THEME.panelBg} shadow-[8px_8px_0_0_#004d40] ${className}`}
    {...props}
  >
    {children}
  </div>
);

// --- Page Data ---
const team = [
  {
    id: "shubhranshu",
    name: "Shubhranshu Mishra",
    role: "Founder & Full-Stack Developer",
    bio: "A B.Tech student with a passion for architecting robust systems. Shubhranshu is the visionary who laid the foundation of DecodeByCode, turning a simple idea into a thriving platform for coders who love to compete and improve.",
    img: "https://i.ibb.co/SwpqHP7D/VIBHU.png",
  },
  {
    id: "omvrit",
    name: "Om Vrit",
    role: "Co-Founder & Full-Stack Developer",
    bio: "Also a B.Tech student, Omvrit is the creative force behind the platform's unique look and feel. He specializes in crafting intuitive user experiences that are both functional and delightful to use.",
    img: "https://i.ibb.co/ks4PXrdD/Chat-GPT-Image-Jul-24-2025-07-23-33-PM.png",
  },
  {
    id: "app",
    name: "About DecodeByCode",
    role: "Our Mission",
    bio: "DecodeByCode was born from a simple idea: to create a space where students and aspiring developers can not only test their coding skills but also learn and grow together. We believe in the power of community and friendly competition to unlock true potential.",
  },
];

// --- Team Member Image Component (With Highlight Effect) ---
const TeamMemberImage = ({ member, onHover, isActive }) => (
  <motion.div
    className="relative group cursor-pointer"
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    onMouseEnter={() => onHover(member.id)}
  >
    <img
      src={member.img}
      alt={member.name}
      className={`w-full h-full object-cover border-4 ${TEAL_THEME.panelBorder} transition-all duration-300 ${isActive ? `shadow-[0_0_20px_#00bfa5]` : ''}`}
    />
    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 ${TEAL_THEME.textAccent} transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
  </motion.div>
);

// --- Contact Button Component ---
const ContactButton = ({ href, icon, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center justify-center gap-3 p-3 border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.decorativePanelBg} shadow-[4px_4px_0_0_#004d40] transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`}
  >
    {icon}
    <span className={`font-bold text-lg ${TEAL_THEME.textPrimary}`} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}>{text}</span>
  </a>
);

// --- Value Card Component ---
const ValueCard = ({ icon, title, children }) => (
  <div className={`p-6 border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.panelBg} h-full`}>
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 ${TEAL_THEME.panelBorder} ${TEAL_THEME.decorativePanelBg} ${TEAL_THEME.textAccent}`}>
        {icon}
      </div>
      <h3 className={`${TEAL_THEME.textPrimary}`} style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1.2rem' }}>{title}</h3>
    </div>
    <p className={`text-base ${TEAL_THEME.textSecondary}`} style={{ fontFamily: "'Courier Prime', monospace" }}>{children}</p>
  </div>
);

// ================
// MAIN COMPONENT
// ================
export default function AboutUs() {
  const [activeId, setActiveId] = useState("app");

  const activeMember =
    team.find((m) => m.id === activeId) || team.find((m) => m.id === "app");

  return (
    <>
        <Navbar activePage={"About Us"} />
        <div
          className={`min-h-screen ${TEAL_THEME.bgPrimary} px-4 py-24`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Left Column: Dynamic Bio Display */}
              <div className="space-y-6">
                <h1 className={`text-5xl md:text-6xl ${TEAL_THEME.textPrimary}`} style={{ fontFamily: "'Press Start 2P', cursive" }}>
                  Our <span className={TEAL_THEME.textAccent}>Story</span>
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
                      <h2 className={`text-4xl ${TEAL_THEME.textPrimary}`} style={{ fontFamily: "'Press Start 2P', cursive" }}>{activeMember.name}</h2>
                      <p
                        className={`text-lg ${TEAL_THEME.textSecondary} mb-4`} style={{ fontFamily: "'Courier Prime', monospace" }}
                      >
                        {activeMember.role}
                      </p>
                      <p className={`text-base md:text-lg leading-relaxed ${TEAL_THEME.textPrimary}`} style={{ fontFamily: "'Courier Prime', monospace" }}>
                        {activeMember.bio}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </RetroCard>
              </div>

              {/* Right Column: Team Members */}
              <div
                className="flex items-center justify-center"
                onMouseLeave={() => setActiveId("app")} // Reset to default
              >
                <div className="grid grid-cols-2 gap-8">
                  {team
                    .filter((m) => m.id !== "app")
                    .map((member) => (
                      <TeamMemberImage
                        key={member.id}
                        member={member}
                        onHover={setActiveId}
                          isActive={activeId === member.id}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Our Values Section */}
            <RetroCard className="p-8 mb-16">
              <h2
                className={`text-4xl text-center mb-8 ${TEAL_THEME.textPrimary}`} style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValueCard icon={<UsersIcon size={28} />} title="Community">
                  We believe that coding is a team sport. Our platform is built to
                  foster collaboration, mentorship, and friendly competition among
                  peers.
                </ValueCard>
                <ValueCard icon={<HeartIcon size={28} />} title="Learning">
                  Every problem is an opportunity to learn something new. We are
                  committed to providing high-quality challenges that push you to
                  grow as a developer.
                </ValueCard>
                <ValueCard icon={<ShieldCheckIcon size={28} />} title="Growth">
                  Our ultimate goal is to help you grow. From your first solved
                  problem to topping the leaderboards, we're here to support your
                  journey.
                </ValueCard>
              </div>
            </RetroCard>

            {/* Contact Section */}
            <RetroCard className="p-8">
              <h2
                className={`text-4xl text-center mb-8 ${TEAL_THEME.textPrimary}`} style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Connect With Us
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  <ContactButton href="mailto:decodebycode.pvt.ltd@gmail.com" icon={<EnvelopeIcon className="h-6 w-6"/>} text="Email" />
                  <ContactButton href="#" icon={<LinkedinIcon className="h-6 w-6"/>} text="LinkedIn" />
                  <ContactButton href="#" icon={<InstagramIcon className="h-6 w-6"/>} text="Instagram" />
                  <ContactButton href="#" icon={<GithubIcon className="h-6 w-6"/>} text="GitHub" />
                  <ContactButton href="#" icon={<YoutubeIcon className="h-6 w-6"/>} text="YouTube" />
              </div>
            </RetroCard>

            <footer className={`mt-16 text-center text-sm ${TEAL_THEME.textSecondary}`} style={{ fontFamily: "'Courier Prime', monospace" }}>
              © {new Date().getFullYear()} DecodeByCode. All rights reserved.
            </footer>
          </div>
        </div>
    </>
  );
}
