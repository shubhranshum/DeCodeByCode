import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/navbar.jsx";
import { formatDate } from "date-fns";
import ContestCard from "./Contest/contestCard.jsx";
import AnnouncementCard from "./Announcement/announceMentCard.jsx";
import SectionHeader from "./sectionsHeader.jsx";
import BlogCard from "./Blog/blogCard.jsx";
import SkeletonLoader from "./skeletonLoader.jsx";
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
        console.log("fetching contests");
         const res = await fetch("http://localhost:3000/contests", {
           method: "GET",
           credentials: "include",
         });
         const data = await res.json();
         
         setContests(data);
         setLoading(false);
         
        
      } catch (err) {
        console.error("Error fetching contests:", err);
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
    // Simulated API call with mock data
    const fetchAnnouncements = async () => {
      try {
        console.log("fetching announcements");
         const res = await fetch("http://localhost:3000/announcements", {
           method: "GET",
           credentials: "include",
         });
         const data = await res.json();
         
         setAnnouncements(data);
         setLoading(false);
       
           
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

           
          </div>
        </div>
      </main>
    </div>
  );
}