import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Component Imports (Assuming they exist and are styled) ---
import ProblemTitleModal from "./initialiseProblem.jsx";
import ContestTitleModal from "./initialiseContest.jsx";
import AnnouncementTitleModal from "./initialiseAnnouncement.jsx";
import { StatCard } from "./utils/ui/statCard.jsx";
import { EmptyState } from "./utils/ui/emptyState.jsx";

// --- Task Imports (Logic) ---
import { getAdminProblems } from "../Tasks/getAdminProblems.jsx";
import { getAdminContests } from "../Tasks/getAdminContests.jsx";
import { getAdminAnnouncements } from "../Tasks/getAdminAnnouncements.jsx";
import { getCurrentPotd } from "../Tasks/getCurrentPotd.jsx";
import { handleCreateProblem } from "./CreateProblem/hooks/handleCreateProblem.jsx";
import { handleDeleteProblem } from "./CreateProblem/hooks/handleDeleteProblem.jsx";
import { handleVerifyProblem } from "./CreateProblem/hooks/handleVerifyProblem.jsx";
import { handleCreateAnnouncement } from "./CreateAnnouncement/hooks/handleCreateAnnouncement.jsx";
import { handleDeleteAnnouncement } from "./CreateAnnouncement/hooks/handleDeleteAnnouncement.jsx";
import { handleVerifyAnnouncement } from "./CreateAnnouncement/hooks/handleVerifyAnnounce.jsx";
import { handleCreateContest } from "./CreateContest/hooks/handleCreateContest.jsx";
import { handleDeleteContest } from "./CreateContest/hooks/handleDeleteContest.jsx";
import { handleVerifyContest } from "./CreateContest/hooks/handleVerifyContest.jsx";

import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Globe,
  XCircle,
  Calendar,
  Users,
  Trophy,
  Megaphone,
  FileText,
  RefreshCw,
  PlusCircle,
  Hash,
  BellDot,
} from "lucide-react";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
  bgPrimary: "bg-stone-100",
  textPrimary: "text-stone-800",
  textSecondary: "text-stone-500",
  textAccent: "text-teal-600",
  panelBg: "bg-white",
  panelBorder: "border-stone-800",
  buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
  buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
  buttonDangerBg: "bg-rose-400 hover:bg-rose-500",
  buttonText: "text-stone-800",
  inputBg: "bg-stone-100",
  accentBg: "bg-amber-100",
  status: {
    running: "bg-emerald-200 text-emerald-800",
    upcoming: "bg-sky-200 text-sky-800",
    ended: "bg-stone-200 text-stone-800",
  },
  difficulty: {
    Easy: "bg-emerald-200 text-emerald-800",
    Medium: "bg-amber-200 text-amber-800",
    Hard: "bg-rose-200 text-rose-800",
  },
};

// --- Reusable UI Components ---
const Button = ({
  children,
  onClick,
  disabled,
  className = "",
  small = false,
  type = "primary",
  isSubmit = false,
}) => {
  const sizeStyle = small ? "px-2 py-1 text-xs" : "px-4 py-2 text-base";
  const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
  const typeStyle =
    type === "primary"
      ? retroThemeColors.buttonPrimaryBg
      : type === "danger"
      ? retroThemeColors.buttonDangerBg
      : retroThemeColors.buttonSecondaryBg;
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}
    >
      {children}
    </button>
  );
};

const RetroCard = ({ children, className = "" }) => (
  <div
    className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}
  >
    {children}
  </div>
);
const TabButton = ({ children, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-lg border-2 ${
      retroThemeColors.panelBorder
    } font-bold transition-all ${
      isActive
        ? `bg-teal-400 text-white shadow-none translate-x-[4px] translate-y-[4px]`
        : `bg-stone-200 text-stone-800 shadow-chunky hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`
    }`}
  >
    {children}
  </button>
);

// --- Self-Contained Retro Card Components ---
const ContestCard = ({
  contest,
  onView,
  onEdit,
  onVerify,
  onDelete,
  onToggleGlobal,
  onSendNotification,
}) => {
  
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);
  const status =
    now < startTime ? "upcoming" : now > endTime ? "ended" : "running";

  return (
    <RetroCard className="flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-stone-800">
            {contest.title || "Untitled Contest"}
          </h3>
          <span
            className={`px-2 py-0.5 text-xs font-bold border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.status[status]}`}
          >
            {status.toUpperCase()}
          </span>
        </div>
        <p className={`text-sm text-stone-500 mb-3 line-clamp-2 min-h-[40px]`}>
          {contest.description || "No description."}
        </p>
        <div className="flex items-center gap-1 text-sm text-stone-500">
          <Calendar className="w-4 h-4" />
          <span>Start: {startTime.toLocaleString()}</span>
        </div>
      </div>
      <div
        className={`border-t-4 ${retroThemeColors.panelBorder} p-2 bg-stone-50 flex flex-wrap justify-end gap-2`}
      >
        <Button onClick={onView} small type="secondary">
          <Eye size={14} />
        </Button>
        <Button onClick={onEdit} small type="secondary">
          <Edit size={14} />
        </Button>
        {!contest.isVerified && (
          <Button onClick={onVerify} small type="secondary">
            <CheckCircle size={14} />
          </Button>
        )}
        <Button onClick={onToggleGlobal} small type="secondary">
          {contest.isGlobal ? <XCircle size={14} /> : <Globe size={14} />}
        </Button>
        <Button onClick={onDelete} small type="danger">
          <Trash2 size={14} />
        </Button>
        <Button onClick={onSendNotification} small type="secondary">
          <BellDot size={14} />
        </Button>
      </div>
    </RetroCard>
  );
};

const ProblemCard = ({
  problem,
  onView,
  onEdit,
  onVerify,
  onDelete,
  onToggleGlobal,
}) => (

  <RetroCard className="flex flex-col">
    <div className="p-4 flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-stone-800">
          {problem.title || "Untitled Problem"}
        </h3>
        <span
          className={`px-2 py-0.5 text-xs font-bold border-2 ${
            retroThemeColors.panelBorder
          } ${
            retroThemeColors.difficulty[problem.difficulty] || "bg-stone-200"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>
      <p className={`text-sm text-stone-500 mb-3 line-clamp-2 min-h-[40px]`}>
        {problem.statement?.substring(0, 100) || "No statement."}...
      </p>
    </div>
    <div
      className={`border-t-4 ${retroThemeColors.panelBorder} p-2 bg-stone-50 flex flex-wrap justify-end gap-2`}
    >
      <Button onClick={onView} small type="secondary">
        <Eye size={14} />
      </Button>
      <Button onClick={onEdit} small type="secondary">
        <Edit size={14} />
      </Button>
      {!problem.isVerified && (
        <Button onClick={onVerify} small type="secondary">
          <CheckCircle size={14} />
        </Button>
      )}
      <Button onClick={onToggleGlobal} small type="secondary">
        {problem.isGlobal ? <XCircle size={14} /> : <Globe size={14} />}
      </Button>
      <Button onClick={onDelete} small type="danger">
        <Trash2 size={14} />
      </Button>
    </div>
  </RetroCard>
);

const AnnouncementCard = ({
  announcement,
  onView,
  onEdit,
  onVerify,
  onDelete,
  onToggleGlobal,
}) => (
  <RetroCard className="flex flex-col">
    <div className="p-4 flex-grow">
      <h3 className="text-xl font-bold text-stone-800">
        {announcement.title || "Untitled Announcement"}
      </h3>
      <p className={`text-sm text-stone-500 mb-3 line-clamp-2 min-h-[40px]`}>
        {announcement.message || "No message."}
      </p>
    </div>
    <div
      className={`border-t-4 ${retroThemeColors.panelBorder} p-2 bg-stone-50 flex flex-wrap justify-end gap-2`}
    >
      <Button onClick={onView} small type="secondary">
        <Eye size={14} />
      </Button>
      <Button onClick={onEdit} small type="secondary">
        <Edit size={14} />
      </Button>
      {!announcement.isVerified && (
        <Button onClick={onVerify} small type="secondary">
          <CheckCircle size={14} />
        </Button>
      )}
      <Button onClick={onToggleGlobal} small type="secondary">
        {announcement.isGlobal ? <XCircle size={14} /> : <Globe size={14} />}
      </Button>
      <Button onClick={onDelete} small type="danger">
        <Trash2 size={14} />
      </Button>
    </div>
  </RetroCard>
);

// ================
// MAIN COMPONENT
// ================
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
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("adminDashboardActiveTab") || "problems"
  );
  const[isVerifying, setIsVerifying] = useState(false);
  const[isSettingGlobal, setIsSettingGlobal] = useState(false);
  const [currentPotd, setCurrentPotd] = useState(null);
  const [potdIdInput, setPotdIdInput] = useState("");
  const [isPotdLoading, setIsPotdLoading] = useState(false);

  // Load initial data
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
        setAnnouncements(announcementsData || []);
        setProblems(problemsData || []);
        setContests(contestsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Fetch POTD when POTD tab is active
  useEffect(() => {
    if (activeTab === "potd") {
      fetchPotd();
    }
  }, [activeTab]);

  const fetchPotd = useCallback(async () => {
    try {
      setIsPotdLoading(true);
      const response = await fetch(`http://localhost:3000/admin/potd`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch Problem of the Day");
      const potd = await response.json();
      setCurrentPotd(potd);
    } catch (error) {
      console.error("Error fetching POTD:", error);
      toast.error(error.message || "Failed to load Problem of the Day");
    } finally {
      setIsPotdLoading(false);
    }
  }, []);

  const filteredItems = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const list =
      activeTab === "problems"
        ? problems
        : activeTab === "contests"
        ? contests
        : announcements;
    return list.filter((item) =>
      item.title?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [activeTab, problems, contests, announcements, searchTerm]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("adminDashboardActiveTab", tab);
  };

  const handleSetPotd = async () => {
    if (!potdIdInput.trim()) {
      toast.error("Please enter a Problem ID.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/admin/createpotd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ problemId: potdIdInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to set Problem of the Day"
        );
      }

      const newPotd = await response.json();
      setCurrentPotd(newPotd);
      setPotdIdInput("");
      toast.success("Problem of the Day has been updated!");
    } catch (error) {
      console.error("Error setting POTD:", error);
      toast.error(error.message || "Failed to set Problem of the Day");
    }
  };

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
      setIsSettingGlobal(true);
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
      setIsSettingGlobal(false);
      console.log("Problems is set to global")
      toast.success(
        `Problem ${
          currentStatus ? "removed from" : "added to"
        } global problems!`
      );
    } catch (error) {
      console.error("Error updating global status:", error);
      setIsSettingGlobal(false);
      toast.error("Failed to update problem status");
    }
  };
  const sendNotification = async (slug) => {
    try {
      const res = await fetch(
        `http://localhost:3000/notifications/send-notification/`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: "all",
            type: "SYSTEM",
            message: "New contest is added check it out participate and grow",
            link: "/contests/"+slug,
          }),
        }
      );
    } catch (err) {
      console.error(err);
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

  const handleViewProblem = (slug) => navigate(`/admin/problems/${slug}`);
  const handleEditProblem = (slug) => navigate(`/admin/edit-problem/${slug}`);
  const handleViewContest = (slug) => navigate(`/admin/contests/${slug}`);
  const handleEditContest = (slug) => navigate(`/admin/edit-contest/${slug}`);
  const handleViewAnnouncement = (id) => navigate(`/admin/announcements/${id}`);
  const handleEditAnnouncement = (id) =>
    navigate(`/admin/edit-announcement/${id}`);

  return (
    <div className={`min-h-screen ${retroThemeColors.bgPrimary} font-retro`}>
      {/* Modals */}
      <ProblemTitleModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        onSubmit={handleCreateProblem}
      />
      <ContestTitleModal
        isOpen={isContestModalOpen}
        onClose={() => setIsContestModalOpen(false)}
        onSubmit={handleCreateContest}
      />
      <AnnouncementTitleModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSubmit={handleCreateAnnouncement}
      />

      <header
        className={`p-4 border-b-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg}`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className={`mt-1 text-base ${retroThemeColors.textSecondary}`}>
              Manage problems, contests, and announcements.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className={`w-full pl-12 pr-4 py-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                if (activeTab === "problems") setIsProblemModalOpen(true);
                else if (activeTab === "contests") setIsContestModalOpen(true);
                else setIsAnnouncementModalOpen(true);
              }}
            >
              <Plus className="h-5 w-5" /> New {activeTab.slice(0, -1)}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton
            isActive={activeTab === "problems"}
            onClick={() => handleTabClick("problems")}
          >
            Problems
          </TabButton>
          <TabButton
            isActive={activeTab === "contests"}
            onClick={() => handleTabClick("contests")}
          >
            Contests
          </TabButton>
          <TabButton
            isActive={activeTab === "announcements"}
            onClick={() => handleTabClick("announcements")}
          >
            Announcements
          </TabButton>
          <TabButton
            isActive={activeTab === "potd"}
            onClick={() => handleTabClick("potd")}
          >
            POTD
          </TabButton>
        </div>

        {activeTab === "potd" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current POTD Card */}
            <RetroCard className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  Current Problem of the Day
                </h2>
                <Button onClick={fetchPotd} small disabled={isPotdLoading}>
                  <RefreshCw
                    className={`w-4 h-4 ${isPotdLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              {isPotdLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-pulse text-stone-500">
                    Loading POTD...
                  </div>
                </div>
              ) : currentPotd ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-amber-50 border-2 border-stone-800">
                    <div>
                      <h3 className="text-lg font-bold">{currentPotd.title}</h3>
                      <p className="text-sm text-stone-500">
                        ID: {currentPotd._id}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-bold border-2 ${
                        retroThemeColors.panelBorder
                      } ${
                        retroThemeColors.difficulty[currentPotd.difficulty] ||
                        "bg-stone-200"
                      }`}
                    >
                      {currentPotd.difficulty}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() =>
                        navigate(`/admin/problems/${currentPotd.slug}`)
                      }
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View Problem
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 mx-auto text-stone-400 mb-2" />
                  <p className="text-lg text-stone-500">
                    No Problem of the Day is set
                  </p>
                </div>
              )}
            </RetroCard>

            {/* Set New POTD Card */}
            <RetroCard className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-teal-600" />
                Set New POTD
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="problemId"
                    className="block text-sm font-bold mb-2 text-stone-700"
                  >
                    Problem ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="problemId"
                      className={`w-full p-3 pl-10 text-base border-4 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none focus:ring-2 focus:ring-teal-400`}
                      value={potdIdInput}
                      onChange={(e) => setPotdIdInput(e.target.value)}
                      placeholder="Enter problem ID"
                    />
                    <Hash className="absolute top-1/2 left-3 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Find problem IDs in the Problems tab
                  </p>
                </div>

                <Button
                  onClick={handleSetPotd}
                  className="w-full"
                  disabled={!potdIdInput.trim()}
                >
                  <CheckCircle className="w-5 h-5 mr-1" /> Set as POTD
                </Button>

                <div
                  className={`p-3 ${retroThemeColors.accentBg} border-2 ${retroThemeColors.panelBorder} text-sm`}
                >
                  <p className="font-bold mb-1">ℹ️ How to find Problem ID:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Go to Problems tab</li>
                    <li>Click on a problem card</li>
                    <li>Check URL: /admin/problems/[problem-id]</li>
                    <li>Or view problem details page</li>
                  </ul>
                </div>
              </div>
            </RetroCard>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20 text-xl font-bold">Loading...</div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              if (activeTab === "problems" )
                return (
                  
                  <ProblemCard
                    key={item._id}
                    problem={item}
                    onView={() => handleViewProblem(item.slug)}
                    onEdit={() => handleEditProblem(item.slug)}
                    onVerify={() =>
                      handleVerifyProblem(item._id, problems, setProblems)
                    }
                    onDelete={() =>
                      handleDeleteProblem(item._id, problems, setProblems)
                    }
                    onToggleGlobal={() =>
                      toggleProblemGlobalStatus(item._id, item.isGlobal)
                    }
                  />
                );
              if (activeTab === "contests")
                return (
                  <ContestCard
                    key={item._id}
                    contest={item}
                    onView={() => handleViewContest(item.slug)}
                    onEdit={() => handleEditContest(item.slug)}
                    onVerify={() =>
                      handleVerifyContest(item._id, contests, setContests)
                    }
                    onDelete={() =>
                      handleDeleteContest(item._id, contests, setContests)
                    }
                    onToggleGlobal={() =>
                      toggleContestGlobalStatus(item._id, item.isGlobal)
                    }
                    onSendNotification={() => sendNotification(item.slug)}
                  />
                );
              if (activeTab === "announcements")
                return (
                  <AnnouncementCard
                    key={item._id}
                    announcement={item}
                    onView={() => handleViewAnnouncement(item._id)}
                    onEdit={() => handleEditAnnouncement(item._id)}
                    onVerify={() =>
                      handleVerifyAnnouncement(
                        item._id,
                        announcements,
                        setAnnouncements
                      )
                    }
                    onDelete={() =>
                      handleDeleteAnnouncement(
                        item._id,
                        announcements,
                        setAnnouncements
                      )
                    }
                    onToggleGlobal={() =>
                      toggleAnnouncementGlobalStatus(item._id, item.isGlobal)
                    }
                  />
                );
              return null;
            })}
          </div>
        ) : (
          <EmptyState
            type={activeTab}
            searchTerm={searchTerm}
            onCreateNew={() => {
              if (activeTab === "problems") setIsProblemModalOpen(true);
              else if (activeTab === "contests") setIsContestModalOpen(true);
              else setIsAnnouncementModalOpen(true);
            }}
          />
        )}
      </main>
    </div>
  );
}
