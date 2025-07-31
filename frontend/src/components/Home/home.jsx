import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useSpring, useInView, useTransform } from "framer-motion";
import { TrophyIcon, BookOpenIcon, MegaphoneIcon, CodeBracketIcon, SparklesIcon, UsersIcon, ChartBarIcon, ArrowRightIcon, AcademicCapIcon, LightBulbIcon, RocketLaunchIcon, StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import Navbar from "../Navbar/navbar.jsx"; // Assuming Navbar is in the correct path

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100", // Light background
    textPrimary: "text-stone-800", // Dark text
    textSecondary: "text-stone-500", // Lighter text
    textAccent: "text-purple-600", // Accent color for links/highlights
    panelBg: "bg-white", // Card background
    panelBorder: "border-stone-800", // Dark border for panels
    buttonPrimaryBg: "bg-purple-400", // Primary button color
    buttonPrimaryHoverBg: "hover:bg-purple-500", // Primary button hover
    buttonSecondaryBg: "bg-stone-200", // Secondary button color
    buttonSecondaryHoverBg: "hover:bg-stone-300", // Secondary button hover
    buttonText: "text-stone-800", // Button text color
    accentBg: "bg-amber-100", // Accent background for highlights
    shadowColor: "rgba(0,0,0,0.8)", // For chunky shadows
    shadowOffset: "4px", // Offset for chunky shadows
};

// --- Reusable Retro UI Components ---
// Enhanced Button with more pronounced retro feel and Framer Motion for "bumpy" effect
const Button = ({ children, onClick, className = '', type = 'primary', as: Component = 'button', icon: Icon = null }) => {
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg + ' ' + retroThemeColors.buttonPrimaryHoverBg : retroThemeColors.buttonSecondaryBg + ' ' + retroThemeColors.buttonSecondaryHoverBg;
    const shadowStyle = {
        boxShadow: `${retroThemeColors.shadowOffset} ${retroThemeColors.shadowOffset} 0px 0px ${retroThemeColors.shadowColor}`,
    };
    const hoverStyle = {
        boxShadow: `0px 0px 0px 0px ${retroThemeColors.shadowColor}`,
        transform: `translate(${retroThemeColors.shadowOffset}, ${retroThemeColors.shadowOffset})`,
    };

    return (
        <motion.button
            onClick={onClick}
            className={`px-8 py-3 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} transition-all flex items-center justify-center gap-2 ${typeStyle} ${className}`}
            style={shadowStyle}
            whileHover={hoverStyle}
            whileTap={{ boxShadow: `0px 0px 0px 0px ${retroThemeColors.shadowColor}`, transform: `translate(${retroThemeColors.shadowOffset}, ${retroThemeColors.shadowOffset})` }}
            as={Component}
        >
            {Icon && <Icon className="w-6 h-6" />}
            {children}
        </motion.button>
    );
};

// Enhanced RetroCard with more pronounced retro feel
const RetroCard = ({ children, className = '', ...props }) => {
    const shadowStyle = {
        boxShadow: `${retroThemeColors.shadowOffset} ${retroThemeColors.shadowOffset} 0px 0px ${retroThemeColors.shadowColor}`,
    };
    return (
        <div className={`border-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg} ${className}`} style={shadowStyle} {...props}>
            {children}
        </div>
    );
};

// Enhanced TabButton for a more distinct active state
const TabButton = ({ children, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-3 text-xl border-r-2 last:border-r-0 ${retroThemeColors.panelBorder} font-bold transition-all flex items-center justify-center gap-2
            ${isActive
                ? `bg-white ${retroThemeColors.textAccent} shadow-none translate-y-[4px] border-b-0` // Active tab lifts up
                : `bg-stone-200 text-stone-700 shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-y-[4px]`
            }
        `}
    >
        {children}
    </button>
);

const SectionHeader = ({ title, actionText, actionLink, icon: Icon = null }) => (
    <div className={`flex justify-between items-center p-4 border-b-4 ${retroThemeColors.panelBorder}`}>
        <h2 className="text-3xl font-bold flex items-center gap-3">
            {Icon && <Icon className="w-8 h-8 text-purple-600" />}
            {title}
        </h2>
        {actionLink && (
            <Link to={actionLink} className={`text-lg font-bold ${retroThemeColors.textAccent} hover:underline flex items-center gap-2`}>
                {actionText} <ArrowRightIcon className="w-5 h-5" />
            </Link>
        )}
    </div>
);

// --- Custom Hooks for Data Fetching (Logic Unchanged) ---
const useFeaturedBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/featured-blogs", { credentials: "include" })
            .then(res => res.json()).then(data => setBlogs(data.blogs || []))
            .catch(err => console.error("Failed to fetch blogs", err));
    }, []);
    return { blogs };
};
const useUpcomingContests = () => {
    const [contests, setContests] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/contests", { credentials: "include" })
            .then(res => res.json()).then(data => setContests(data || []))
            .catch(err => console.error("Failed to fetch contests", err));
    }, []);
    return { contests };
};
const useAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/announcements", { credentials: "include" })
            .then(res => res.json()).then(data => setAnnouncements(data || []))
            .catch(err => console.error("Failed to fetch announcements", err));
    }, []);
    return { announcements };
};

// --- MOCK HOOKS AND DATA FOR NEW SECTIONS (as requested) ---
const useFeatures = () => {
    const features = useMemo(() => [
        { id: 1, icon: CodeBracketIcon, title: "Practice Problems", description: "Sharpen your skills with a vast library of coding challenges." },
        { id: 2, icon: TrophyIcon, title: "Compete Globally", description: "Join thrilling contests and test your mettle against coders worldwide." },
        { id: 3, icon: BookOpenIcon, title: "Learn & Grow", description: "Access insightful blogs, tutorials, and community discussions." },
        { id: 4, icon: UsersIcon, title: "Connect & Collaborate", description: "Engage with a vibrant community of passionate developers." },
    ], []);
    return { features };
};

const useTestimonials = () => {
    const testimonials = useMemo(() => [
        { id: 1, quote: "This platform transformed my coding journey! The problems are challenging and the community is incredibly supportive.", author: "Alice Johnson", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AJ" },
        { id: 2, quote: "I love the variety of contests. It's the perfect place to push my limits and learn new algorithms.", author: "Bob Williams", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BW" },
        { id: 3, quote: "The blogs are a goldmine of information. I've learned so much from experienced coders here.", author: "Charlie Brown", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CB" },
    ], []);
    return { testimonials };
};

const useGettingStartedSteps = () => {
    const steps = useMemo(() => [
        { id: 1, icon: LightBulbIcon, title: "Sign Up", description: "Create your free account in seconds and join the community." },
        { id: 2, icon: AcademicCapIcon, title: "Explore Problems", description: "Dive into our curated problem sets, from easy to expert." },
        { id: 3, icon: RocketLaunchIcon, title: "Join a Contest", description: "Test your skills in real-time coding competitions." },
        { id: 4, icon: StarIcon, title: "Climb the Leaderboard", description: "Solve, compete, and earn your spot among the top coders!" },
    ], []);
    return { steps };
};


// --- Page-Specific Components (Restyled for better UI/UX) ---
const ContestCard = ({ contest }) => (
    <motion.a
        href={contest.link || '/contests'}
        target="_blank"
        rel="noopener noreferrer"
        className={`block p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50 hover:bg-amber-100 transition-colors group`}
        whileHover={{ scale: 1.02, boxShadow: `2px 2px 0px 0px ${retroThemeColors.shadowColor}` }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className={`text-lg font-bold ${retroThemeColors.textAccent}`}>{contest.title || 'Platform'}</p>
                <h3 className="text-xl font-bold text-stone-800 mt-1">{contest.description}</h3>
            </div>
            <div className={`text-sm px-3 py-1 border-2 ${retroThemeColors.panelBorder} bg-white`}>{contest.duration + ' min' || 'N/A'}</div>
        </div>
        <p className={`mt-3 text-base ${retroThemeColors.textSecondary}`}>Starts: {new Date(contest.startTime).toLocaleString()}</p>
    </motion.a>
);

const AnnouncementCard = ({ announcement }) => (
    <div className={`p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50`}>
        <p className="font-bold text-lg text-stone-800">{announcement.title}</p>
        <p className={`text-base text-stone-600 mt-1`}>{announcement.content}</p>
        <p className={`text-sm text-stone-400 mt-2`}>{new Date(announcement.createdAt).toLocaleDateString()}</p>
    </div>
);

const BlogCard = ({ blog }) => (
    <motion.a
        to={`/blog/${blog._id}`}
        className={`block p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50 hover:bg-sky-100 transition-colors`}
        whileHover={{ scale: 1.02, boxShadow: `2px 2px 0px 0px ${retroThemeColors.shadowColor}` }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        as={Link}
    >
        <p className={`text-sm font-bold ${retroThemeColors.textAccent}`}>{blog.tags?.[0] || 'General'}</p>
        <h3 className="text-lg font-bold mt-1 text-stone-800">{blog.title}</h3>
        <div className="mt-3 flex items-center gap-2">
            <img src={blog.author?.profilePicture || 'https://api.dicebear.com/7.x/initials/svg?seed=A'} alt={blog.author?.name} className={`w-8 h-8 border-2 ${retroThemeColors.panelBorder}`} />
            <span className="text-base text-stone-700">{blog.author?.username || 'Anonymous'}</span>
        </div>
    </motion.a>
);

const AnimatedStat = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const springValue = useSpring(0, { stiffness: 100, damping: 30 });

    useEffect(() => {
        if (isInView) springValue.set(value);
    }, [isInView, value, springValue]);

    return <motion.div ref={ref}>{useTransform(springValue, v => v.toFixed(value < 1 ? 1 : 0))}</motion.div>;
};

const CommunityStatCard = ({ value, label, icon: Icon }) => (
    <RetroCard className="p-4 text-center bg-stone-200">
        <div className={`text-4xl font-bold ${retroThemeColors.textAccent} flex items-center justify-center gap-2`}>
            {Icon && <Icon className="w-10 h-10" />}
            <AnimatedStat value={value} />{value >= 1 ? 'K+' : ''}
        </div>
        <div className="text-base text-stone-600 mt-2">{label}</div>
    </RetroCard>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
    <RetroCard className="p-6 text-center flex flex-col items-center">
        <div className={`p-4 rounded-full ${retroThemeColors.accentBg} border-2 ${retroThemeColors.panelBorder} mb-4`}>
            <Icon className={`w-12 h-12 ${retroThemeColors.textAccent}`} />
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">{title}</h3>
        <p className={`text-base ${retroThemeColors.textSecondary}`}>{description}</p>
    </RetroCard>
);

const TestimonialCard = ({ quote, author, avatar }) => (
    <RetroCard className="p-6 flex flex-col items-center text-center">
        <img src={avatar} alt={author} className={`w-16 h-16 rounded-full border-4 ${retroThemeColors.panelBorder} mb-4`} />
        <p className={`text-lg italic ${retroThemeColors.textPrimary} mb-4`}>"{quote}"</p>
        <p className={`font-bold ${retroThemeColors.textAccent}`}>- {author}</p>
    </RetroCard>
);

const GettingStartedStep = ({ icon: Icon, title, description, stepNumber }) => (
    <RetroCard className="p-6 flex flex-col items-center text-center">
        <div className={`text-5xl font-bold ${retroThemeColors.textAccent} mb-4`}>{stepNumber}.</div>
        <div className={`p-3 rounded-full ${retroThemeColors.accentBg} border-2 ${retroThemeColors.panelBorder} mb-4`}>
            <Icon className={`w-10 h-10 ${retroThemeColors.textAccent}`} />
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">{title}</h3>
        <p className={`text-base ${retroThemeColors.textSecondary}`}>{description}</p>
    </RetroCard>
);


// --- Main HomePage Component ---
export default function HomePage() {
    const navigate = useNavigate();
    const { blogs } = useFeaturedBlogs();
    const { contests } = useUpcomingContests();
    const { announcements } = useAnnouncements();
    const { features } = useFeatures(); // New mock hook for features
    const { testimonials } = useTestimonials(); // New mock hook for testimonials
    const { steps } = useGettingStartedSteps(); // New mock hook for getting started steps

    const [activeTab, setActiveTab] = useState("contests");

    return (
        <div className={`min-h-screen ${retroThemeColors.bgPrimary} text-stone-800 font-sans`}> {/* Using font-sans, assuming a retro font can be imported globally if desired */}
            <Navbar activePage="Home" />

            {/* Hero Section - Enhanced with retro pattern */}
            <section className="relative py-20 px-6 overflow-hidden">
                {/* Retro background pattern for visual flair */}
                <div className="absolute inset-0 z-0 opacity-10" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${retroThemeColors.shadowColor} 0px, ${retroThemeColors.shadowColor} 1px, transparent 1px, transparent 10px)`,
                    backgroundSize: '10px 10px'
                }}></div>
                <RetroCard className="max-w-5xl mx-auto text-center p-8 md:p-12 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight">
                        Unlock Your <span className={retroThemeColors.textAccent}>Coding Potential</span>
                    </h1>
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-10">
                        The ultimate platform to practice, compete, and grow. Dive into problems, join contests, and climb the leaderboards.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate("/problems")} type="primary" icon={CodeBracketIcon}>Explore Problems</Button>
                        <Button onClick={() => navigate("/contests")} type="secondary" icon={TrophyIcon}>View Contests</Button>
                    </div>
                </RetroCard>
            </section>

            <main className="max-w-7xl mx-auto px-6 pb-20 -mt-8 relative z-10">
                {/* Main Content Grid: Contests/Announcements & Blogs/Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Contests & Announcements Tabs */}
                    <div className="lg:col-span-2">
                        <RetroCard>
                            <div className={`flex border-b-4 ${retroThemeColors.panelBorder} p-2 ${retroThemeColors.buttonSecondaryBg}`}>
                                <TabButton isActive={activeTab === "contests"} onClick={() => setActiveTab("contests")}>
                                    <TrophyIcon className="w-6 h-6 mr-2" /> Contests
                                </TabButton>
                                <TabButton isActive={activeTab === "announcements"} onClick={() => setActiveTab("announcements")}>
                                    <MegaphoneIcon className="w-6 h-6 mr-2" /> Announcements
                                </TabButton>
                            </div>
                            <div className="p-6 space-y-4">
                                {activeTab === "contests" && (contests.length > 0 ? contests.map(c => <ContestCard key={c.id || c._id} contest={c} />) : <p className="text-center text-stone-500 py-8">No upcoming contests at the moment. Check back soon!</p>)}
                                {activeTab === "announcements" && (announcements.length > 0 ? announcements.map(a => <AnnouncementCard key={a.id || a._id} announcement={a} />) : <p className="text-center text-stone-500 py-8">No recent announcements.</p>)}
                            </div>
                        </RetroCard>
                    </div>

                    {/* Right Column: Featured Blogs & Community Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <RetroCard>
                            <SectionHeader title="Featured Blogs" actionLink="/blogs" actionText="View All" icon={BookOpenIcon} />
                            <div className="p-6 space-y-4">
                                {blogs.length > 0 ? blogs.map(b => <BlogCard key={b.id || b._id} blog={b} />) : <p className="text-center text-stone-500 py-8">No featured blogs yet.</p>}
                            </div>
                        </RetroCard>
                        <RetroCard>
                            <SectionHeader title="Community Stats" icon={ChartBarIcon} />
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <CommunityStatCard value={10} label="Active Coders" icon={UsersIcon} />
                                <CommunityStatCard value={5} label="Problems Solved" icon={CodeBracketIcon} />
                                <CommunityStatCard value={0.5} label="Contests Held" icon={TrophyIcon} />
                                <CommunityStatCard value={1} label="Blog Posts" icon={BookOpenIcon} />
                            </div>
                        </RetroCard>
                    </div>
                </div>

                {/* New Section: Why Choose Us / Key Features */}
                <section className="mt-16">
                    <SectionHeader title="Why Choose Us?" icon={SparklesIcon} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                        {features.map(feature => (
                            <FeatureCard key={feature.id} {...feature} />
                        ))}
                    </div>
                </section>

                {/* New Section: How It Works / Getting Started Steps */}
                <section className="mt-16">
                    <SectionHeader title="Getting Started" icon={RocketLaunchIcon} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                        {steps.map((step, index) => (
                            <GettingStartedStep key={step.id} {...step} stepNumber={index + 1} />
                        ))}
                    </div>
                </section>

                {/* New Section: Testimonials */}
                <section className="mt-16">
                    <SectionHeader title="What Our Users Say" icon={ChatBubbleLeftRightIcon} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        {testimonials.map(testimonial => (
                            <TestimonialCard key={testimonial.id} {...testimonial} />
                        ))}
                    </div>
                </section>

                {/* New Section: Call to Action */}
                <section className="mt-16 text-center">
                    <RetroCard className="p-10">
                        <h2 className="text-4xl font-bold text-stone-800 mb-6">Ready to Start Your Coding Journey?</h2>
                        <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-10">
                            Join thousands of developers improving their skills and connecting with a global community.
                        </p>
                        <Button onClick={() => navigate("/signup")} type="primary" icon={UsersIcon}>Join Now!</Button>
                    </RetroCard>
                </section>
            </main>

            {/* Footer */}
            <footer className={`py-10 px-6 border-t-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg} text-center text-stone-600`}>
                <div className="max-w-7xl mx-auto">
                    <p>&copy; {new Date().getFullYear()} CodeQuest. All rights reserved.</p>
                    <div className="mt-4 flex justify-center space-x-6">
                        <Link to="/privacy" className={`${retroThemeColors.textAccent} hover:underline`}>Privacy Policy</Link>
                        <Link to="/terms" className={`${retroThemeColors.textAccent} hover:underline`}>Terms of Service</Link>
                        <Link to="/contact" className={`${retroThemeColors.textAccent} hover:underline`}>Contact Us</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}