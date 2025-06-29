import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/navbar.jsx";

export default function HomePage() {
  window.href = "/home";
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    // Simulated blogs data — replace with real API fetch
    setBlogs([
      { id: 1, title: "Why You Should Start Competitive Programming", link: "https://cpblog.com/start" },
      { id: 2, title: "Top 10 CP Mistakes Beginners Make", link: "https://cpblog.com/mistakes" },
      { id: 3, title: "CP Roadmap for College Students", link: "https://cpblog.com/roadmap" },
      { id: 4, title: "How to Prepare for ICPC", link: "https://cpblog.com/icpc" },
      { id: 5, title: "Data Structures You Must Master", link: "https://cpblog.com/dsa" },
      { id: 6, title: "5 Tips to Improve Problem Solving", link: "https://cpblog.com/tips" },
      { id: 7, title: "Daily CP Practice Routine", link: "https://cpblog.com/routine" },
      { id: 8, title: "Mastering Graphs in CP", link: "https://cpblog.com/graphs" },
      { id: 9, title: "Dynamic Programming Made Easy", link: "https://cpblog.com/dp" },
      { id: 10, title: "Advanced CP Techniques", link: "https://cpblog.com/advanced" },
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white px-6 py-10 mt-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left side: Blog Titles */}
        <aside className="lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Top CP Blogs</h2>
          <ul className="space-y-3">
            {blogs.map((blog) => (
              <li key={blog.id}>
                <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-orange-300 hover:underline">
                  {blog.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right side: Hot News */}
        <section className="lg:w-2/3">
          <h2 className="text-3xl font-bold mb-4">🔥 Hot News in CP World</h2>
          <p className="mb-4 text-lg text-white/80">
            Stay updated with the latest happenings in the Competitive Programming world. Whether it's new contests, ICPC announcements,
            or training camps — we bring the best curated news to you!
          </p>

          <div className="space-y-4 text-white/90">
            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="font-semibold text-lg">ICPC 2025 Regionals Announced!</h3>
              <p>Get ready to register for the most prestigious contest — ICPC Regionals coming this December!</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="font-semibold text-lg">Codeforces Adds New Rating Division</h3>
              <p>A new rating division is being introduced to better segment mid-level coders. Are you ready to level up?</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <h3 className="font-semibold text-lg">CP Bootcamps This Summer</h3>
              <p>Check out online and offline bootcamps designed to build your problem-solving mindset from scratch.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}