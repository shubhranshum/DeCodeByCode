import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/navbar.jsx";

// Custom hook for fetching blogs
const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Simulated API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockBlogs = [
          { id: 1, title: "Why You Should Start Competitive Programming", link: "https://cpblog.com/start", likes: 42, tags: ["Algorithms", "Beginner"] },
          { id: 2, title: "Top 10 CP Mistakes Beginners Make", link: "https://cpblog.com/mistakes", likes: 31, tags: ["Tips", "Common Errors"] },
          { id: 3, title: "CP Roadmap for College Students", link: "https://cpblog.com/roadmap", likes: 28, tags: ["Learning Path", "Career"] },
          { id: 4, title: "How to Prepare for ICPC", link: "https://cpblog.com/icpc", likes: 56, tags: ["ICPC", "Contests"] },
          { id: 5, title: "Data Structures You Must Master", link: "https://cpblog.com/dsa", likes: 74, tags: ["Data Structures", "Core"] },
        ];
        
        setBlogs(mockBlogs);
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

// Blog Card Component
const BlogCard = ({ blog }) => (
  <div className="bg-gray-900/50 hover:bg-gray-800 transition-all rounded-xl p-4">
    <div className="flex justify-between items-start">
      <a 
        href={blog?.link || "#"} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-orange-300 hover:text-orange-400 font-medium text-lg"
      >
        {blog?.title || "Untitled Blog"}
      </a>
      <button className="text-gray-400 hover:text-red-500 transition-colors">
        ♡ {blog?.likes || 0}
      </button>
    </div>
    {blog?.tags && (
      <div className="mt-2 flex flex-wrap gap-2">
        {blog.tags.map((tag, index) => (
          <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

// News Card Component
const NewsCard = ({ news }) => (
  <div className="bg-white/10 hover:bg-white/15 transition-all p-4 rounded-xl">
    <div className="flex items-center gap-2 mb-2">
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>
      <span className="text-xs text-orange-300">{news?.date || "Today"}</span>
    </div>
    <h3 className="font-semibold text-lg">{news?.title || "Important Update"}</h3>
    <p className="mt-2 text-white/80">
      {news?.description || "Stay tuned for more information about this exciting development."}
    </p>
  </div>
);

// Section Header Component
const SectionHeader = ({ title, action }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">{title || "Section"}</h2>
    {action && (
      <Link to={action.link || "#"} className="text-orange-300 hover:underline text-sm">
        {action.text} →
      </Link>
    )}
  </div>
);

// Skeleton Loader Component
const SkeletonLoader = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-gray-900/50 rounded-xl p-4 animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="flex gap-2 mt-3">
          <div className="h-6 bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function HomePage() {
  const { blogs, loading, error } = useBlogs();
  const [activeTab, setActiveTab] = useState("news");

  // Upcoming contests data
  const contests = [
    { 
      id: 1, 
      name: "Codeforces Round #950", 
      date: "Jul 15, 2023", 
      time: "17:35 UTC+2", 
      duration: "2 hrs", 
      platform: "Codeforces" 
    },
    { 
      id: 2, 
      name: "Google Kick Start 2023", 
      date: "Jul 22, 2023", 
      time: "13:00 UTC", 
      duration: "3 hrs", 
      platform: "Google" 
    },
    { 
      id: 3, 
      name: "LeetCode Biweekly Contest", 
      date: "Jul 30, 2023", 
      time: "14:30 UTC", 
      duration: "1.5 hrs", 
      platform: "LeetCode" 
    },
  ];

  // Hot news data
  const hotNews = [
    {
      id: 1,
      title: "ICPC 2025 Regionals Announced!",
      description: "Registration opens August 1st for the most prestigious programming contest. Teams from over 100 countries will compete.",
      date: "2 hours ago"
    },
    {
      id: 2,
      title: "Codeforces Adds New Rating Division",
      description: "A new 'Candidate Master' division is being introduced to better segment 1900-2100 rated coders.",
      date: "1 day ago"
    },
    {
      id: 3,
      title: "Summer CP Bootcamps Announced",
      description: "Check out online and offline bootcamps designed to build your problem-solving mindset from scratch to advanced techniques.",
      date: "3 days ago"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Level Up Your <span className="text-orange-400">Coding Skills</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
            Join our community of competitive programmers. Practice problems, read expert blogs, and prepare for contests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/practice" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
            >
              Start Practicing
            </Link>
            <Link 
              to="/contests" 
              className="bg-transparent hover:bg-gray-800 border-2 border-orange-500 text-orange-300 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              View Contests
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-20 -mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column (Main Content) */}
          <div className="lg:w-2/3">
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "news" 
                    ? "text-orange-400 border-b-2 border-orange-400" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("news")}
              >
                Hot News
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "contests" 
                    ? "text-orange-400 border-b-2 border-orange-400" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("contests")}
              >
                Upcoming Contests
              </button>
            </div>

            {/* News Tab Content */}
            {activeTab === "news" && (
              <section>
                <SectionHeader 
                  title="🔥 Hot News in CP World" 
                  action={{ text: "All News", link: "/news" }}
                />
                
                {hotNews.length > 0 ? (
                  <div className="space-y-4">
                    {hotNews.map(news => (
                      <NewsCard key={news.id} news={news} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-8 text-center">
                    <p className="text-gray-400">No news available at the moment. Check back later!</p>
                  </div>
                )}
              </section>
            )}

            {/* Contests Tab Content */}
            {activeTab === "contests" && (
              <section>
                <SectionHeader 
                  title="🚀 Upcoming Contests" 
                  action={{ text: "View All", link: "/contests" }}
                />
                
                {contests.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full">
                      <thead className="text-left text-gray-400 bg-gray-900">
                        <tr>
                          <th className="p-4">Contest</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Platform</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contests.map(contest => (
                          <tr 
                            key={contest.id} 
                            className="border-t border-gray-800 hover:bg-gray-900/50"
                          >
                            <td className="p-4">
                              <Link 
                                to={`/contest/${contest.id}`} 
                                className="text-orange-300 hover:underline font-medium"
                              >
                                {contest.name}
                              </Link>
                            </td>
                            <td className="p-4">
                              <div>{contest.date}</div>
                              <div className="text-sm text-gray-400">{contest.time}</div>
                            </td>
                            <td className="p-4">{contest.duration}</td>
                            <td className="p-4">
                              <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                                {contest.platform}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-8 text-center">
                    <p className="text-gray-400">No upcoming contests. Check back soon!</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:w-1/3">
            {/* Featured Blogs Section */}
            <SectionHeader 
              title="📚 Featured Blogs" 
              action={{ text: "Create Blog", link: "/blog/create" }}
            />
            
            {error ? (
              <div className="bg-red-900/30 rounded-xl p-4 text-center">
                <p className="text-red-300">{error}</p>
                <button 
                  className="mt-2 text-orange-300 hover:underline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <SkeletonLoader count={3} />
            ) : blogs.length > 0 ? (
              <div className="space-y-4">
                {blogs.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-gray-400">No blogs available yet</p>
                <Link 
                  to="/blog/create" 
                  className="mt-3 inline-block text-orange-300 hover:underline"
                >
                  Be the first to create one!
                </Link>
              </div>
            )}

            {/* Community Stats Section */}
            <div className="mt-10 bg-gradient-to-r from-orange-900/30 to-amber-900/30 p-5 rounded-xl border border-amber-900/50">
              <SectionHeader title="📊 Community Stats" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-white/80">Coders</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold">5K+</div>
                  <div className="text-sm text-white/80">Problems</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-white/80">Contests</div>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="mt-8 bg-gray-900/50 p-5 rounded-xl">
              <SectionHeader title="🔗 Quick Links" />
              <ul className="space-y-3">
                <li>
                  <a href="/leaderboard" className="flex items-center gap-2 text-orange-300 hover:text-orange-400">
                    <span>🏆 Leaderboard</span>
                  </a>
                </li>
                <li>
                  <a href="/problems" className="flex items-center gap-2 text-orange-300 hover:text-orange-400">
                    <span>💻 Practice Problems</span>
                  </a>
                </li>
                <li>
                  <a href="/discuss" className="flex items-center gap-2 text-orange-300 hover:text-orange-400">
                    <span>💬 Discussion Forum</span>
                  </a>
                </li>
                <li>
                  <a href="/resources" className="flex items-center gap-2 text-orange-300 hover:text-orange-400">
                    <span>📚 Learning Resources</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}