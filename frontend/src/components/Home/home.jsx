import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/navbar.jsx";
import { formatDate } from "date-fns";

// Custom hooks for better modularity
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
    // Simulated API call with mock data
    const fetchContests = async () => {
      try {
         const res = await fetch("http://localhost:3000/upcoming-contests", {
           method: "GET",
           credentials: "include",
         });
         const data = await res.json();
         console.log(data.filteredContests);
         setContests(data.filteredContests);
         setLoading(false);
         data.filteredContests.forEach(contest => {
           console.log(contest);
         })
        
      } catch (err) {
        console.error("Error fetching contests:", err);
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return { contests, loading };
};
function formatDateToDMY(isoDateStr) {
  const date = new Date(isoDateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call with mock data
    const fetchAnnouncements = async () => {
      try {
        // In a real app, this would be an actual API call
        setTimeout(() => {
          setAnnouncements([
            {
              id: 1,
              title: "System Maintenance Scheduled",
              content: "The platform will be down for maintenance on July 20th from 2:00 AM to 4:00 AM UTC.",
              date: "2 days ago",
              importance: "medium"
            },
            {
              id: 2,
              title: "New Problem Categories Added",
              content: "We've added 3 new problem categories: Dynamic Programming Advanced, Graph Theory, and Bit Manipulation.",
              date: "1 week ago",
              importance: "high"
            },
            {
              id: 3,
              title: "Community Contest Winners",
              content: "Congratulations to the winners of our June community contest! Prizes will be distributed within 7 days.",
              date: "2 weeks ago",
              importance: "low"
            }
          ]);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return { announcements, loading };
};

// Component for theme management
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme === 'dark' : true; // Default to dark
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return { isDarkMode };
};

// Blog Card Component with improved UI
const BlogCard = ({ blog }) => (
  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 hover:from-gray-700/50 hover:to-gray-800/70 transition-all rounded-xl p-5 border border-gray-700 hover:border-orange-500/30 shadow-lg hover:shadow-orange-500/10">
    <div className="flex justify-between items-start gap-3">
      <Link
        to={`/blog/${blog?._id}`}
        className="text-orange-300 hover:text-orange-400 font-medium text-lg line-clamp-2"
      >
        {blog?.title || "Untitled Blog"}
      </Link>
      <div className="flex items-center gap-1 text-gray-400">
        <span className="text-xs">♡</span>
        <span className="text-sm">{blog?.likedBy.length || 0}</span>
      </div>
    </div>
    <p className="mt-2 text-gray-300 text-sm line-clamp-2">
      {blog?.summary || "Read this insightful blog post about competitive programming..."}
    </p>
    {blog?.tags && (
      <div className="mt-3 flex flex-wrap gap-2">
        {blog.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index} 
            className="text-xs bg-gray-700 hover:bg-orange-500/20 px-2 py-1 rounded transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
      <span> {blog?.author.username || "Anonymous"}</span>
      <span>{formatDateToDMY(blog?.createdAt) || "Recently"}</span>
    </div>
  </div>
);

// Contest Card Component
const ContestCard = ({ contest }) => (
  <div className="bg-gray-800/50 hover:bg-gray-700/50 transition-all rounded-lg p-4 border border-gray-700 hover:border-orange-500/30">
    <div className="flex justify-between items-start gap-2">
      <div>
        <h3 className="font-medium text-orange-300 hover:underline">
          <a href="/contest"target="_blank" rel="noopener noreferrer">
            {contest.title}
          </a>
        </h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-300">
          {/* <span>{contest.platform}</span> */}
          <span className="text-gray-500">•</span>
          <span>{contest.duration}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">{contest.date}</div>
        <div className="text-xs text-gray-400">{contest.time}</div>
      </div>
    </div>
    <div className="mt-3 flex justify-between items-center text-xs">
      <button className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 px-3 py-1 rounded transition-colors">
        Remind Me
      </button>
      <a 
        href={contest.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 hover:underline"
      >
        Visit Site →
      </a>
    </div>
  </div>
);

// Announcement Card Component
const AnnouncementCard = ({ announcement }) => (
  <div className={`p-4 rounded-lg border ${
    announcement.importance === 'high' 
      ? 'bg-red-900/10 border-red-900/30' 
      : announcement.importance === 'medium'
        ? 'bg-orange-900/10 border-orange-900/30'
        : 'bg-gray-800/50 border-gray-700'
  }`}>
    <div className="flex justify-between items-start">
      <h3 className="font-medium text-white">{announcement.title}</h3>
      <span className="text-xs text-gray-400">{announcement.date}</span>
    </div>
    <p className="mt-2 text-sm text-gray-300">{announcement.content}</p>
  </div>
);

// Section Header Component
const SectionHeader = ({ title, action, icon }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold flex items-center gap-2">
      {icon && <span>{icon}</span>}
      {title}
    </h2>
    {action && (
      <Link
        to={action.link || "#"}
        className="text-orange-300 hover:underline text-sm flex items-center gap-1"
      >
        {action.text}
        <span>→</span>
      </Link>
    )}
  </div>
);

// Skeleton Loader Component
const SkeletonLoader = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-gray-800/50 rounded-xl p-4 animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    ))}
  </div>
);

// Main HomePage Component
export default function HomePage() {
  const { isDarkMode } = useTheme();
  const { blogs, loading: blogsLoading, error: blogsError } = useFeaturedBlogs();
  const { contests, loading: contestsLoading } = useUpcomingContests();
  const { announcements, loading: announcementsLoading } = useAnnouncements();
  const [activeTab, setActiveTab] = useState("contests");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-gray-900/30">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
              Competitive Programming
            </span>{" "}
            Hub
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
            Sharpen your skills, compete with peers, and track your progress in
            our comprehensive coding platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/problems"
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              Start Practicing
            </Link>
            <Link
              to="/contests"
              className="bg-transparent hover:bg-gray-800/50 border-2 border-orange-500 text-orange-300 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              View Contests
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-20 -mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Main Content) */}
          <div className="lg:w-2/3">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`py-2 px-4 font-medium relative ${
                  activeTab === "contests"
                    ? "text-orange-400"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("contests")}
              >
                Upcoming Contests
                {activeTab === "contests" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></span>
                )}
              </button>
              <button
                className={`py-2 px-4 font-medium relative ${
                  activeTab === "announcements"
                    ? "text-orange-400"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                Announcements
                {activeTab === "announcements" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></span>
                )}
              </button>
            </div>

            {/* Contests Tab Content */}
            {activeTab === "contests" && (
              <section>
                <SectionHeader
                  title="Upcoming Coding Contests"
                  action={{ text: "View all contests", link: "/contests" }}
                  icon="🚀"
                />

                {contestsLoading ? (
                  <SkeletonLoader count={3} />
                ) : contests.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {contests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-8 text-center">
                    <p className="text-gray-400">
                      No upcoming contests. Check back soon!
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Announcements Tab Content */}
            {activeTab === "announcements" && (
              <section>
                <SectionHeader
                  title="Latest Announcements"
                  action={{ text: "View all", link: "/announcements" }}
                  icon="📢"
                />

                {announcementsLoading ? (
                  <SkeletonLoader count={3} />
                ) : announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <AnnouncementCard 
                        key={announcement.id} 
                        announcement={announcement} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-8 text-center">
                    <p className="text-gray-400">
                      No announcements at the moment.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Practice Problems Section */}
            <section className="mt-12">
              <SectionHeader
                title="Recommended Problems"
                action={{ text: "Browse all problems", link: "/problems" }}
                icon="💡"
              />
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((id) => (
                    <div key={id} className="bg-gray-900/50 hover:bg-gray-800/70 p-4 rounded-lg border border-gray-700 transition-colors">
                      <div className="flex justify-between">
                        <span className="text-orange-300 font-medium">Problem #{id}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {["Easy", "Medium", "Hard"][id % 3]}
                        </span>
                      </div>
                      <h3 className="mt-2 font-medium line-clamp-1">
                        {["Two Sum", "Reverse String", "Binary Search"][id % 3]}
                      </h3>
                      <div className="mt-3 flex justify-between items-center text-xs">
                        <span className="text-gray-400">Solved by {Math.floor(Math.random() * 1000)}</span>
                        <Link 
                          to={`/problem/${id}`} 
                          className="text-orange-300 hover:underline"
                        >
                          Solve →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:w-1/3">
            {/* Featured Blogs Section */}
            <SectionHeader
              title="Featured Blog Posts"
              action={{ text: "View all blogs", link: "/blogs" }}
              icon="✍️"
            />

            {blogsError ? (
              <div className="bg-red-900/30 rounded-xl p-4 text-center">
                <p className="text-red-300">{blogsError}</p>
                <button
                  className="mt-2 text-orange-300 hover:underline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : blogsLoading ? (
              <SkeletonLoader count={2} />
            ) : blogs.length > 0 ? (
              <div className="space-y-4">
                {blogs.slice(0, 3).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-gray-400">No featured blogs available</p>
                <Link
                  to="/create-blog"
                  className="mt-3 inline-block text-orange-300 hover:underline"
                >
                  Write your own blog
                </Link>
              </div>
            )}

            {/* Community Stats Section */}
            <div className="mt-8 bg-gradient-to-br from-orange-900/20 to-amber-900/20 p-5 rounded-xl border border-amber-900/30">
              <SectionHeader title="Community Stats" icon="📊" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-black/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-300">10K+</div>
                  <div className="text-sm text-white/80">Active Coders</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-300">5K+</div>
                  <div className="text-sm text-white/80">Problems</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-300">500+</div>
                  <div className="text-sm text-white/80">Contests</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-300">1K+</div>
                  <div className="text-sm text-white/80">Blog Posts</div>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="mt-8 bg-gray-800/50 p-5 rounded-xl border border-gray-700">
              <SectionHeader title="Quick Links" icon="🔗" />
              <ul className="space-y-3 mt-4">
                <li>
                  <Link
                    to="/leaderboard"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="bg-orange-500/10 p-2 rounded-lg">
                      🏆
                    </span>
                    <span className="font-medium">Leaderboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/problems"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="bg-blue-500/10 p-2 rounded-lg">
                      💻
                    </span>
                    <span className="font-medium">Practice Problems</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/discuss"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="bg-green-500/10 p-2 rounded-lg">
                      💬
                    </span>
                    <span className="font-medium">Discussion Forum</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="bg-purple-500/10 p-2 rounded-lg">
                      📚
                    </span>
                    <span className="font-medium">Learning Resources</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}