import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useInView, useTransform } from "framer-motion";
import { ArrowRightIcon, MegaphoneIcon, TrophyIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/solid';

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
    decorativePanelBg: "bg-sky-100",
};

// --- Reusable Retro UI Components ---
const Button = ({ children, onClick, className = '', type = 'primary', as: Component = 'button' }) => {
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return (
        <Component onClick={onClick} className={`px-8 py-3 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center justify-center gap-2 ${typeStyle} ${className}`}>
            {children}
        </Component>
    );
};

const RetroCard = ({ children, className = '', ...props }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`} {...props}>
        {children}
    </div>
);

const TabButton = ({ children, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 p-3 text-xl border-r-2 last:border-r-0 ${retroThemeColors.panelBorder} transition-colors ${isActive ? `${retroThemeColors.panelBg} ${retroThemeColors.textAccent}` : `${retroThemeColors.buttonSecondaryBg} ${retroThemeColors.textPrimary} hover:bg-stone-300`}`}>
        {children}
    </button>
);

const SectionHeader = ({ title, actionText, actionLink }) => (
    <div className={`flex justify-between items-center p-4 border-b-4 ${retroThemeColors.panelBorder}`}>
        <h2 className="text-2xl font-bold">{title}</h2>
        {actionLink && (
            <Link to={actionLink} className={`text-base font-bold ${retroThemeColors.textAccent} hover:underline`}>
                {actionText} &rarr;
            </Link>
        )}
    </div>
);

// --- Custom Hooks for Data Fetching (Logic Unchanged) ---
const useFeaturedBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("http://localhost:3000/featured-blogs", { credentials: "include" })
            .then(res => res.json()).then(data => setBlogs(data.blogs || []))
            .catch(err => console.error("Failed to fetch blogs", err))
            .finally(() => setLoading(false));
    }, []);
    return { blogs, loading };
};
const useUpcomingContests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("http://localhost:3000/contests", { credentials: "include" })
            .then(res => res.json()).then(data => setContests(data || []))
            .catch(err => console.error("Failed to fetch contests", err))
            .finally(() => setLoading(false));
    }, []);
    return { contests, loading };
};
const useAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("http://localhost:3000/announcements", { credentials: "include" })
            .then(res => res.json()).then(data => setAnnouncements(data || []))
            .catch(err => console.error("Failed to fetch announcements", err))
            .finally(() => setLoading(false));
    }, []);
    return { announcements, loading };
};


// --- Page-Specific Components (Restyled) ---
const ContestCard = ({ contest }) => (
    <a href={contest.link || '/contests'} target="_blank" rel="noopener noreferrer" className={`block p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50 hover:bg-amber-100 transition-colors group`}>
        <div className="flex justify-between items-start">
            <div>
                <p className={`text-lg font-bold ${retroThemeColors.textAccent}`}>{contest.title || 'Platform'}</p>
                <h3 className="text-xl font-bold text-stone-800 mt-1">{contest.description}</h3>
            </div>
            <div className={`text-sm px-3 py-1 border-2 ${retroThemeColors.panelBorder} bg-white`}>{contest.duration + ' min' || 'N/A'}</div>
        </div>
        <p className={`mt-3 text-base ${retroThemeColors.textSecondary}`}>Starts: {new Date(contest.startTime).toLocaleString()}</p>
    </a>
);

const AnnouncementCard = ({ announcement }) => (
    <div className={`p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50`}>
        <p className="font-bold text-lg text-stone-800">{announcement.title}</p>
        <p className={`text-base text-stone-600 mt-1`}>{announcement.content}</p>
        <p className={`text-sm text-stone-400 mt-2`}>{new Date(announcement.createdAt).toLocaleDateString()}</p>
    </div>
);

const BlogCard = ({ blog }) => (
    <Link to={`/blog/${blog._id}`} className={`block p-4 border-2 ${retroThemeColors.panelBorder} bg-stone-50 hover:bg-sky-100 transition-colors`}>
        <p className={`text-sm font-bold ${retroThemeColors.textAccent}`}>{blog.tags?.[0] || 'General'}</p>
        <h3 className="text-lg font-bold mt-1 text-stone-800">{blog.title}</h3>
        <div className="mt-3 flex items-center gap-2">
            <img src={blog.author?.profilePicture || 'https://api.dicebear.com/7.x/initials/svg?seed=A'} alt={blog.author?.name} className={`w-8 h-8 border-2 ${retroThemeColors.panelBorder}`} />
            <span className="text-base text-stone-700">{blog.author?.username || 'Anonymous'}</span>
        </div>
    </Link>
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

const CommunityStatCard = ({ value, label }) => (
    <div className={`p-4 border-2 text-center ${retroThemeColors.panelBorder} bg-stone-200`}>
        <div className={`text-4xl font-bold ${retroThemeColors.textAccent} flex items-center justify-center`}>
            <AnimatedStat value={value} />K+
        </div>
        <div className="text-base text-stone-600">{label}</div>
    </div>
);

// --- Main HomePage Component ---
export default function HomePage() {
    const navigate = useNavigate();
    const { blogs, loading: blogsLoading } = useFeaturedBlogs();
    const { contests, loading: contestsLoading } = useUpcomingContests();
    const { announcements, loading: announcementsLoading } = useAnnouncements();
    const [activeTab, setActiveTab] = useState("contests");

    return (
        <div className={`min-h-screen ${retroThemeColors.bgPrimary} text-stone-800 font-retro`}>
            <section className="py-20 px-6">
                <RetroCard className="max-w-5xl mx-auto text-center p-8 md:p-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6">
                        Unlock Your Coding Potential
                    </h1>
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-10">
                        The ultimate platform to practice, compete, and grow. Dive into problems, join contests, and climb the leaderboards.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate("/problems")} type="primary" className={retroThemeColors.buttonPrimaryBg}>Explore Problems</Button>
                        <Button onClick={() => navigate("/contests")} type="secondary">View Contests</Button>
                    </div>
                </RetroCard>
            </section>

            <main className="max-w-7xl mx-auto px-6 pb-20 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        <RetroCard>
                            <div className="flex border-b-4 border-stone-800">
                                <TabButton isActive={activeTab === "contests"} onClick={() => setActiveTab("contests")}>Contests</TabButton>
                                <TabButton isActive={activeTab === "announcements"} onClick={() => setActiveTab("announcements")}>Announcements</TabButton>
                            </div>
                            <div className="p-6 space-y-4">
                                {activeTab === "contests" && (contestsLoading ? <p>Loading...</p> : contests.map(c => <ContestCard key={c.id || c._id} contest={c} />))}
                                {activeTab === "announcements" && (announcementsLoading ? <p>Loading...</p> : announcements.map(a => <AnnouncementCard key={a.id || a._id} announcement={a} />))}
                            </div>
                        </RetroCard>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <RetroCard>
                            <SectionHeader title="Featured Blogs" actionLink="/blogs" actionText="View All" />
                            <div className="p-6 space-y-4">
                                {blogsLoading ? <p>Loading...</p> : blogs.map(b => <BlogCard key={b.id || b._id} blog={b} />)}
                            </div>
                        </RetroCard>
                        <RetroCard>
                            <SectionHeader title="Community Stats" />
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <CommunityStatCard value={10} label="Active Coders" />
                                <CommunityStatCard value={5} label="Problems Solved" />
                                <CommunityStatCard value={0.5} label="Contests Held" />
                                <CommunityStatCard value={1} label="Blog Posts" />
                            </div>
                        </RetroCard>
                    </div>
                </div>
            </main>
        </div>
    );
}