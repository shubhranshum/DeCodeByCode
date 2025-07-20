import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useInView, useTransform } from "framer-motion";
import { ArrowRightIcon, MegaphoneIcon, TrophyIcon, BookOpenIcon, SparklesIcon, SunIcon, MoonIcon, LightBulbIcon } from '@heroicons/react/24/solid';

// --- Theme Management Hook ---
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme ? savedTheme : 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return { theme, toggleTheme };
};

// --- Redefined Reusable Components ---
const SectionHeader = ({ title, action, icon }) => (
    <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        {action && (
            <Link to={action.link} className="flex items-center gap-1 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
                {action.text}
                <ArrowRightIcon className="w-4 h-4" />
            </Link>
        )}
    </div>
);

const ContestCard = ({ contest }) => (
    <motion.div
        className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-cyan-500/10"
        whileHover={{ y: -5 }}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-lg text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">{contest.title || 'Platform'}</p>
                <h3 className="text-l font-bold text-slate-800 dark:text-slate-100 mt-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" >{contest.description}</h3>
            </div>
            <div className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{contest.duration + ' min' || 'N/A'}</div>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
            <div>
                <p>Starts: {new Date(contest.startTime).toLocaleString()}</p>
            </div>
            <a href={contest.link ||  'contests/'} target="_blank" rel="noopener noreferrer" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-500/20 transition-colors">
                Register
            </a>
        </div>
    </motion.div>
);

const AnnouncementCard = ({ announcement }) => (
     <motion.div
        className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        whileHover={{ x: 5 }}
    >
        <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-700 p-2 rounded-lg mt-1">
            <MegaphoneIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">{announcement.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{announcement.content}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{new Date(announcement.createdAt).toLocaleDateString()}</p>
        </div>
    </motion.div>
);

const BlogCard = ({ blog }) => (
    <motion.div
        className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-cyan-500/50 transition-colors duration-300 group shadow-sm hover:shadow-md"
        whileHover={{ y: -5 }}
    >
        <div className="p-5">
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{blog.tags?.[0] || 'General'}</p>
            <h3 className="text-lg font-bold mt-2 text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{blog.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{blog.description}</p>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={blog.author?.profilePicture || 'https://i.pravatar.cc/40'} alt={blog.author?.name || 'Author'} className="w-8 h-8 rounded-full" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{blog.author?.username || 'Anonymous'}</span>
                </div>
                <Link to={`/blog/${blog._id}`} className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300">
                    Read More
                </Link>
            </div>
        </div>
    </motion.div>
);

const SkeletonLoader = ({ count, className }) => (
    <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mt-1"></div>
            </div>
        ))}
    </div>
);

// --- CORRECTED AnimatedStat Component ---
const AnimatedStat = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const springValue = useSpring(0, { stiffness: 100, damping: 30 });

    const transformedValue = useTransform(springValue, (latest) => {
        // Use the original value prop to determine formatting
        if (value < 1) {
            return latest.toFixed(1);
        }
        return latest.toFixed(0);
    });

    useEffect(() => {
        if (isInView) {
            springValue.set(value);
        }
    }, [isInView, value, springValue]);

    return <motion.div ref={ref}>{transformedValue}</motion.div>;
};

const CommunityStatCard = ({ value, label }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold text-cyan-400 flex items-center justify-center gap-1">
            <AnimatedStat value={value} />
            <span>K+</span>
        </div>
        <div className="text-sm text-slate-400">{label}</div>
    </div>
);

// --- Custom Hooks with Real Fetch Logic ---
const useFeaturedBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("http://localhost:3000/featured-blogs", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setBlogs(data.blogs);
            } catch (err) {
                setError("Failed to load blogs. Please try again later.");
                console.error("Error fetching blogs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return { blogs, loading, error };
};

const useUpcomingContests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await fetch("http://localhost:3000/contests", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setContests(data);
            } catch (err) {
                console.error("Error fetching contests:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    return { contests, loading };
};

const useAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("http://localhost:3000/announcements", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setAnnouncements(data);
            } catch (err) {
                console.error("Error fetching announcements:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    return { announcements, loading };
};

// --- Main HomePage Component ---
export default function HomePage() {
    const { theme, toggleTheme } = useTheme();
    const { blogs, loading: blogsLoading, error: blogsError } = useFeaturedBlogs();
    const { contests, loading: contestsLoading } = useUpcomingContests();
    const { announcements, loading: announcementsLoading } = useAnnouncements();
    const [activeTab, setActiveTab] = useState("contests");

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-sans transition-colors duration-300">
            
          

            <section className="relative py-24 px-6 overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950"></div>
                <div className="absolute inset-0 opacity-[.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl -translate-x-1/4"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl translate-x-1/4"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 tracking-tight">
                            Unlock Your Coding Potential
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
                            The ultimate platform to practice, compete, and grow. Dive into problems, join contests, and climb the leaderboards.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/problems" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transform hover:scale-105">
                                Explore Problems
                            </Link>
                            <Link to="/contests" className="bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                                View Contests
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 pb-20 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl p-6">
                            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                                <button className={`py-3 px-4 font-semibold relative transition-colors ${activeTab === "contests" ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}`} onClick={() => setActiveTab("contests")}>
                                    Upcoming Contests
                                    {activeTab === "contests" && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 dark:bg-cyan-400" layoutId="active-tab-indicator" />}
                                </button>
                                <button className={`py-3 px-4 font-semibold relative transition-colors ${activeTab === "announcements" ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}`} onClick={() => setActiveTab("announcements")}>
                                    Announcements
                                    {activeTab === "announcements" && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 dark:bg-cyan-400" layoutId="active-tab-indicator" />}
                                </button>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                    {activeTab === "contests" && (
                                        contestsLoading ? <SkeletonLoader count={2} /> :
                                        contests.length > 0 ? <div className="space-y-4"><SectionHeader title="Get Ready to Compete" icon={<TrophyIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400"/>} />{contests.map(c => <ContestCard key={c.id} contest={c} />)}</div> :
                                        <p className="text-center py-8 text-slate-500 dark:text-slate-400">No upcoming contests. Stay tuned!</p>
                                    )}
                                    {activeTab === "announcements" && (
                                        announcementsLoading ? <SkeletonLoader count={2} /> :
                                        announcements.length > 0 ? <div className="space-y-4"><SectionHeader title="What's New" icon={<MegaphoneIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400"/>} />{announcements.map(a => <AnnouncementCard key={a.id} announcement={a} />)}</div> :
                                        <p className="text-center py-8 text-slate-500 dark:text-slate-400">No new announcements.</p>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl p-6">
                            <SectionHeader title="Featured Blogs" icon={<BookOpenIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400"/>} action={{ text: "View all", link: "/blogs" }} />
                            {blogsError ? <p className="text-red-500 dark:text-red-400 text-center">{blogsError}</p> :
                             blogsLoading ? <SkeletonLoader count={2} /> :
                             <div className="space-y-4">{blogs.map(b => <BlogCard key={b.id} blog={b} />)}</div>
                            }
                        </div>
                         <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700">
                            <SectionHeader title="Community Stats" icon={<SparklesIcon className="w-6 h-6 text-cyan-400"/>} />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                               <CommunityStatCard value={10} label="Active Coders" />
                               <CommunityStatCard value={5} label="Problems" />
                               <CommunityStatCard value={0.5} label="Contests" />
                               <CommunityStatCard value={1} label="Blog Posts" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
