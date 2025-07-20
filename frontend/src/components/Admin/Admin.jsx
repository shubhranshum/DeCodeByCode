import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProblemTitleModal from "./initialiseProblem.jsx";
import ContestTitleModal from "./initialiseContest.jsx";
import AnnouncementTitleModal from "./initialiseAnnouncement.jsx";
import { getAdminProblems } from "../Tasks/getAdminProblems.jsx";
import { getAdminContests } from "../Tasks/getAdminContests.jsx";
import { getAdminAnnouncements } from "../Tasks/getAdminAnnouncements.jsx";
import { ProblemCard } from "./CreateProblem/ui/problemCard.jsx";
import { handleCreateProblem } from "./CreateProblem/hooks/handleCreateProblem.jsx";
import { handleDeleteProblem } from "./CreateProblem/hooks/handleDeleteProblem.jsx";
import { handleVerifyProblem } from "./CreateProblem/hooks/handleVerifyProblem.jsx";
import { AnnouncementCard } from "./CreateAnnouncement/ui/announcementCard.jsx";
import { handleCreateAnnouncement } from "./CreateAnnouncement/hooks/handleCreateAnnouncement.jsx";
import { handleDeleteAnnouncement } from "./CreateAnnouncement/hooks/handleDeleteAnnouncement.jsx";
import { handleVerifyAnnouncement } from "./CreateAnnouncement/hooks/handleVerifyAnnounce.jsx";
import { ContestCard } from "./CreateContest/ui/contestCard.jsx";
import { handleCreateContest } from "./CreateContest/hooks/handleCreateContest.jsx";
import { handleDeleteContest } from "./CreateContest/hooks/handleDeleteContest.jsx";
import { handleVerifyContest } from "./CreateContest/hooks/handleVerifyContest.jsx";
import { StatCard } from "./utils/ui/statCard.jsx";
import { EmptyState } from "./utils/ui/emptyState.jsx";
import { toast } from 'react-toastify';
import {
  Search,
  Plus,
  Users,
  BarChart2,
  Calendar,
  FileText,
  CheckCircle,
  Globe,
  AlertCircle,
  Trophy,
  Clock,
  Megaphone,
} from "lucide-react";
import { useCallback } from "react";

// Custom hook for theme management
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("adminTheme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return { isDarkMode };
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isContestModalOpen, setIsContestModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminDashboardActiveTab") || "problems";
  });
  const { isDarkMode } = useTheme();

  // Fetch all admin data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [problemsData, contestsData, announcementsData] =
          await Promise.all([
            getAdminProblems(),
            getAdminContests(),
            getAdminAnnouncements(),
          ]);

        setAnnouncements(announcementsData);
        setProblems(problemsData);
        setContests(contestsData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setProblems([]);
        setContests([]);
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    return () => {
      localStorage.removeItem("adminDashboardActiveTab");
    };
  }, []);

  const filteredItems =
    activeTab === "problems"
      ? problems.filter(
          (problem) =>
            problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            problem.statement?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : activeTab === "contests"
      ? contests.filter(
          (contest) =>
            contest.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contest.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : announcements?.filter(
          (announcement) =>
            announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.message?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const toggleAnnouncementGlobalStatus = async (id, currentStatus) => {
    try {
      const endpoint = `http://localhost:3000/admin/postToGlobalAnnouncements/${id}`;
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update global status");
      setAnnouncements(
        announcements.map((a) =>
          a._id === id ? { ...a, isGlobal: !currentStatus } : a
        )
      );
      toast.success(
        `Announcement ${
          currentStatus ? "removed from" : "added to"
        } global announcements!`
      );
    } catch (error) {
      console.error("Error updating global status:", error);
      toast.error("Failed to update announcement status");
    }
  };

  const toggleProblemGlobalStatus = async (id, currentStatus) => {
    try {
      const endpoint = `http://localhost:3000/admin/postToGlobalProblems/${id}`;
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update global status");
      setProblems(
        problems.map((p) =>
          p._id === id ? { ...p, isGlobal: !currentStatus } : p
        )
      );
      toast.success(
        `Problem ${
          currentStatus ? "removed from" : "added to"
        } global problems!`
      );
    } catch (error) {
      console.error("Error updating global status:", error);
      toast.error("Failed to update problem status");
    }
  };

  const toggleContestGlobalStatus = async (id, currentStatus) => {
    try {
      const endpoint = `http://localhost:3000/admin/postToGlobalContests/${id}`;
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update global status");
      setContests(
        contests.map((c) =>
          c._id === id ? { ...c, isGlobal: !currentStatus } : c
        )
      );
      toast.success(
        `Contest ${
          currentStatus ? "removed from" : "added to"
        } global contests!`
      );
    } catch (error) {
      console.error("Error updating global status:", error);
      toast.error("Failed to update contest status");
    }
  };

  // Navigation handlers
  const handleViewProblem = (slug) => navigate(`/admin/problems/${slug}`);
  const handleEditProblem = (slug) => navigate(`/admin/edit-problem/${slug}`);
  const handleViewContest = (slug) => navigate(`/admin/contests/${slug}`);
  const handleEditContest = (slug) => navigate(`/admin/edit-contest/${slug}`);
  const handleViewAnnouncement = (id) => navigate(`/admin/announcements/${id}`);
  const handleEditAnnouncement = (id) =>
    navigate(`/admin/edit-announcement/${id}`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage coding problems, contests, and announcements
              </p>
            </div>

            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-blue-500 dark:focus:border-purple-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  if (activeTab === "problems") setIsProblemModalOpen(true);
                  else if (activeTab === "contests") setIsContestModalOpen(true);
                  else setIsAnnouncementModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-colors duration-150"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                New{" "}
                {activeTab === "problems"
                  ? "Problem"
                  : activeTab === "contests"
                  ? "Contest"
                  : "Announcement"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {["problems", "contests", "announcements"].map((tab) => (
              <button
                key={tab}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 dark:border-orange-500 text-blue-600 dark:text-orange-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  localStorage.setItem("adminDashboardActiveTab", tab);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activeTab === "problems" ? (
            <>
              <StatCard
                title="Total Problems"
                value={problems.length}
                icon={<FileText className="w-5 h-5" />}
                color="blue"
                darkColor="purple"
              />
              <StatCard
                title="Verified"
                value={problems.filter((p) => p.isVerified).length}
                icon={<CheckCircle className="w-5 h-5" />}
                color="emerald"
                darkColor="emerald"
              />
              <StatCard
                title="Global"
                value={problems.filter((p) => p.isGlobal).length}
                icon={<Globe className="w-5 h-5" />}
                color="indigo"
                darkColor="violet"
              />
              <StatCard
                title="Drafts"
                value={problems.filter((p) => p.status === "draft").length}
                icon={<AlertCircle className="w-5 h-5" />}
                color="amber"
                darkColor="orange"
              />
            </>
          ) : activeTab === "contests" ? (
            <>
              <StatCard
                title="Total Contests"
                value={contests.length}
                icon={<Trophy className="w-5 h-5" />}
                color="violet"
                darkColor="purple"
              />
              <StatCard
                title="Active"
                value={
                  contests.filter(
                    (c) =>
                      new Date(c.startTime) <= new Date() &&
                      new Date(c.endTime) >= new Date()
                  ).length
                }
                icon={<CheckCircle className="w-5 h-5" />}
                color="emerald"
                darkColor="emerald"
              />
              <StatCard
                title="Upcoming"
                value={
                  contests.filter((c) => new Date(c.startTime) > new Date())
                    .length
                }
                icon={<Clock className="w-5 h-5" />}
                color="blue"
                darkColor="indigo"
              />
              <StatCard
                title="Global"
                value={contests.filter((c) => c.isGlobal).length}
                icon={<Globe className="w-5 h-5" />}
                color="orange"
                darkColor="amber"
              />
            </>
          ) : (
            <>
              <StatCard
                title="Total Announcements"
                value={announcements.length}
                icon={<Megaphone className="w-5 h-5" />}
                color="purple"
                darkColor="violet"
              />
              <StatCard
                title="Verified"
                value={announcements.filter((a) => a.isVerified).length}
                icon={<CheckCircle className="w-5 h-5" />}
                color="emerald"
                darkColor="emerald"
              />
              <StatCard
                title="Global"
                value={announcements.filter((a) => a.isGlobal).length}
                icon={<Globe className="w-5 h-5" />}
                color="indigo"
                darkColor="blue"
              />
              <StatCard
                title="High Priority"
                value={
                  announcements.filter((a) => a.importance === "high").length
                }
                icon={<AlertCircle className="w-5 h-5" />}
                color="red"
                darkColor="orange"
              />
            </>
          )}
        </div>

        {/* List Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-orange-500"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) =>
                activeTab === "problems" ? (
                  <ProblemCard
                    key={item._id}
                    problem={item}
                    onView={() => handleViewProblem(item.slug)}
                    onEdit={() => handleEditProblem(item.slug)}
                    onVerify={() =>
                      handleVerifyProblem(item._id, problems, setProblems)
                    }
                    onDelete={() => handleDeleteProblem(item._id)}
                    onToggleGlobal={() =>
                      toggleProblemGlobalStatus(item._id, item.isGlobal)
                    }
                    darkMode={isDarkMode}
                  />
                ) : activeTab === "contests" ? (
                  <ContestCard
                    key={item._id}
                    contest={item}
                    onView={() => handleViewContest(item.slug)}
                    onEdit={() => handleEditContest(item.slug)}
                    onVerify={() => handleVerifyContest(item._id, contests, setContests)}
                    onDelete={() => handleDeleteContest(item._id)}
                    onToggleGlobal={() =>
                      toggleContestGlobalStatus(item._id, item.isGlobal)
                    }
                    darkMode={isDarkMode}
                  />
                ) : (
                  <AnnouncementCard
                    key={item._id}
                    announcement={item}
                    onView={() => handleViewAnnouncement(item._id)}
                    onEdit={() => handleEditAnnouncement(item._id)}
                    onVerify={() => handleVerifyAnnouncement(item._id)}
                    onDelete={() => handleDeleteAnnouncement(item._id)}
                    onToggleGlobal={() =>
                      toggleAnnouncementGlobalStatus(item._id, item.isGlobal)
                    }
                    darkMode={isDarkMode}
                  />
                )
              )}
            </ul>
          </div>
        ) : (
          <EmptyState
            searchTerm={searchTerm}
            onCreateNew={() => {
              if (activeTab === "problems") setIsProblemModalOpen(true);
              else if (activeTab === "contests") setIsContestModalOpen(true);
              else setIsAnnouncementModalOpen(true);
            }}
            type={activeTab}
            darkMode={isDarkMode}
          />
        )}

        {/* Platform Overview Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-blue-50 dark:bg-purple-900 text-blue-600 dark:text-purple-300">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Statistics
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Total Users
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    2,548
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Active Today
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    1,243
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    New This Week
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    187
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Activity Metrics
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Submissions (24h)
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    8,742
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Problems Solved
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    23,891
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Avg. Solve Time
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    12m 34s
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-purple-50 dark:bg-violet-900 text-purple-600 dark:text-violet-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Last Problem Added
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    2 hours ago
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Last Contest
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Yesterday
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    System Updated
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    3 days ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <ProblemTitleModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        onSubmit={handleCreateProblem}
        darkMode={isDarkMode}
      />
      <ContestTitleModal
        isOpen={isContestModalOpen}
        onClose={() => setIsContestModalOpen(false)}
        onSubmit={handleCreateContest}
        darkMode={isDarkMode}
      />
      <AnnouncementTitleModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSubmit={handleCreateAnnouncement}
        darkMode={isDarkMode}
      />
    </div>
  );
}