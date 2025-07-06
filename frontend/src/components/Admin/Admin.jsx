import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProblemTitleModal from "./initialiseProblem.jsx";
import ContestTitleModal from "./initialiseContest.jsx"; // New component
import {getAdminProblems} from "../Tasks/getAdminProblems.jsx";
import {getAdminContests} from "../Tasks/getAdminContests.jsx";
import { Edit, Eye, Trash2, CheckCircle, Plus, Globe, Search, FileText, Clock, AlertCircle, XCircle, Trophy } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]); // New state for contests
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isContestModalOpen, setIsContestModalOpen] = useState(false); // New modal state
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminDashboardActiveTab") || "problems";
  });

  // Fetch problems and contests
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [problemsData, contestsData] = await Promise.all([
          getAdminProblems(),
          getAdminContests() // New function to fetch contests
        ]);
        setProblems(problemsData);
        setContests(contestsData);
        console.log("Problems:", problemsData);
        console.log("Contests:", contestsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter problems or contests based on active tab
  const filteredItems = activeTab === "problems" 
    ? problems.filter(problem =>
        problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.statement?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contests.filter(contest =>
        contest.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contest.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Problem actions (unchanged)
  const handleCreateProblem = (title) => {
    fetch(`http://localhost:3000/admin/createProblem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
      credentials: "include",
    }).then(() => window.location.reload());
  };

  // New contest actions
  const handleCreateContest = (title) => {
    fetch(`http://localhost:3000/admin/createContest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
      credentials: "include",
    }).then(() => window.location.reload());
  };

  const handleDeleteContest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    try {
      await fetch(`http://localhost:3000/admin/deleteContest/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(() => window.location.reload());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleVerifyContest = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/edit-contest/${id}/verify`, {
        method: "POST",
        credentials: "include",
      });
      if(response.status !== 200) {
        alert("Failed to verify contest");
        return;
      }
      setContests(contests.map(c =>
        c._id === id ? { ...c, isVerified: true } : c
      ));
    } catch (error) {
      console.error("Verification failed:", error);
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
      setContests(contests.map(c =>
        c._id === id ? { ...c, isGlobal: !currentStatus } : c
      ));
      alert(`Contest ${currentStatus ? 'removed from' : 'added to'} global contests successfully!`);
    } catch (error) {
      console.error("Error updating global status:", error);
      alert("Failed to update contest status. Please try again.");
    }
  };

  // Existing problem actions (unchanged)
  const handleDeleteProblem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      await fetch(`http://localhost:3000/admin/deleteProblem/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(() => window.location.reload());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  const handleVerifyProblem = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/edit-problem/${id}/verify`, {
        method: "POST",
        credentials: "include",
      });
      if(response.status !== 200) {
        alert("Failed to verify problem");
        return;
      }
      setProblems(problems.map(p =>
        p._id === id ? { ...p, isVerified: true } : p
      ));
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };
  const toggleGlobalStatus = async (id, currentStatus) => {
    try {
      const endpoint =`http://localhost:3000/admin/postToGlobalProblems/${id}`
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update global status");
      setProblems(problems.map(p =>
        p._id === id ? { ...p, isGlobal: !currentStatus } : p
      ));
      alert(`Problem ${currentStatus ? 'removed from' : 'added to'} global problems successfully!`);
    } catch (error) {
      console.error("Error updating global status:", error);
      alert("Failed to update problem status. Please try again.");
    }
  };
  const handleViewProblem = (id) => navigate(`/admin/problems/${id}`);
  const handleEditProblem = (id) => navigate(`/admin/edit-problem/${id}`);
  const handleViewContest = (id) => navigate(`/admin/contests/${id}`);
  const handleEditContest = (id) => navigate(`/admin/edit-contest/${id}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage coding problems and contests</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab === "problems" ? "problems" : "contests"}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => activeTab === "problems" ? setIsProblemModalOpen(true) : setIsContestModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> New {activeTab === "problems" ? "Problem" : "Contest"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "problems" ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setActiveTab("problems");
              localStorage.setItem("adminDashboardActiveTab", "problems");
            }}
          >
            Problems
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "contests" ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setActiveTab("contests");
              localStorage.setItem("adminDashboardActiveTab", "contests");
            }}
          >
            Contests
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {activeTab === "problems" ? (
            <>
              <StatCard 
                title="Total Problems" 
                value={problems.length} 
                icon={<FileText className="w-5 h-5 text-indigo-600" />}
                color="indigo"
              />
              <StatCard 
                title="Verified" 
                value={problems.filter(p => p.isVerified).length} 
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                color="green"
              />
              <StatCard 
                title="Global" 
                value={problems.filter(p => p.isGlobal).length} 
                icon={<Globe className="w-5 h-5 text-blue-600" />}
                color="blue"
              />
              <StatCard 
                title="Drafts" 
                value={problems.filter(p => p.status === 'draft').length} 
                icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
                color="yellow"
              />
            </>
          ) : (
            <>
              <StatCard 
                title="Total Contests" 
                value={contests.length} 
                icon={<Trophy className="w-5 h-5 text-indigo-600" />}
                color="indigo"
              />
              <StatCard 
                title="Active" 
                value={contests.filter(c => new Date(c.startTime) <= new Date() && new Date(c.endTime) >= new Date()).length} 
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                color="green"
              />
              <StatCard 
                title="Upcoming" 
                value={contests.filter(c => new Date(c.startTime) > new Date()).length} 
                icon={<Clock className="w-5 h-5 text-blue-600" />}
                color="blue"
              />
              <StatCard 
                title="Global" 
                value={contests.filter(c => c.isGlobal).length} 
                icon={<Globe className="w-5 h-5 text-yellow-600" />}
                color="yellow"
              />
            </>
          )}
        </div>

        {/* Problems/Contests List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                activeTab === "problems" ? (
                  <ProblemCard
                    key={item._id}
                    problem={item}
                    onView={() => handleViewProblem(item._id)}
                    onEdit={() => handleEditProblem(item._id)}
                    onVerify={() => handleVerifyProblem(item._id)}
                    onDelete={() => handleDeleteProblem(item._id)}
                    onToggleGlobal={() => toggleGlobalStatus(item._id, item.isGlobal)}
                  />
                ) : (
                  <ContestCard
                    key={item._id}
                    contest={item}
                    onView={() => handleViewContest(item._id)}
                    onEdit={() => handleEditContest(item._id)}
                    onVerify={() => handleVerifyContest(item._id)}
                    onDelete={() => handleDeleteContest(item._id)}
                    onToggleGlobal={() => toggleContestGlobalStatus(item._id, item.isGlobal)}
                  />
                )
              ))}
            </div>
          </div>
        ) : (
          <EmptyState 
            searchTerm={searchTerm} 
            onCreateNew={() => activeTab === "problems" ? setIsProblemModalOpen(true) : setIsContestModalOpen(true)}
            type={activeTab}
          />
        )}
      </main>

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
    </div>
  );
}

// Problem Card Component (unchanged)
function ProblemCard({ problem, onView, onEdit, onVerify, onDelete, onToggleGlobal }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-150 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {problem.title || 'Untitled Problem'}
            </h3>
            <div className="flex gap-2">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                problem.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {problem.isVerified ? 'Verified' : 'Unverified'}
              </span>
              {problem.isGlobal && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Global
                </span>
              )}
              {problem.status === 'draft' && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Draft
                </span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {problem.statement || 'No description available'}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Updated: {new Date(problem.updatedAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Created: {new Date(problem.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-shrink-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ActionButton 
            icon={<Eye className="h-4 w-4" />} 
            onClick={onView}
            tooltip="View Problem"
            variant="primary"
          />
          <ActionButton 
            icon={<Edit className="h-4 w-4" />} 
            onClick={onEdit}
            tooltip="Edit Problem"
            variant="primary"
          />
          {!problem.isVerified && (
            <ActionButton 
              icon={<CheckCircle className="h-4 w-4" />} 
              onClick={onVerify}
              tooltip="Verify Problem"
              variant="success"
            />
          )}
          <ActionButton 
            icon={problem.isGlobal ? <XCircle className="h-4 w-4" /> : <Globe className="h-4 w-4" />} 
            onClick={onToggleGlobal}
            tooltip={problem.isGlobal ? "Make Non-Global" : "Make Global"}
            variant={problem.isGlobal ? "danger" : "info"}
          />
          <ActionButton 
            icon={<Trash2 className="h-4 w-4" />} 
            onClick={onDelete}
            tooltip="Delete Problem"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
}

// New Contest Card Component
function ContestCard({ contest, onView, onEdit, onVerify, onDelete, onToggleGlobal }) {
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);
  
  const status = now < startTime ? 'upcoming' : now > endTime ? 'ended' : 'running';
  
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-150 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {contest.title || 'Untitled Contest'}
            </h3>
            <div className="flex gap-2">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                status === 'running' ? 'bg-green-100 text-green-800' :
                status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status === 'running' ? 'Running' : status === 'upcoming' ? 'Upcoming' : 'Ended'}
              </span>
              {contest.isVerified && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Verified
                </span>
              )}
              {contest.isGlobal && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Global
                </span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {contest.description || 'No description available'}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Start: {startTime.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>End: {endTime.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-shrink-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ActionButton 
            icon={<Eye className="h-4 w-4" />} 
            onClick={onView}
            tooltip="View Contest"
            variant="primary"
          />
          <ActionButton 
            icon={<Edit className="h-4 w-4" />} 
            onClick={onEdit}
            tooltip="Edit Contest"
            variant="primary"
          />
          {!contest.isVerified && (
            <ActionButton 
              icon={<CheckCircle className="h-4 w-4" />} 
              onClick={onVerify}
              tooltip="Verify Contest"
              variant="success"
            />
          )}
          <ActionButton 
            icon={contest.isGlobal ? <XCircle className="h-4 w-4" /> : <Globe className="h-4 w-4" />} 
            onClick={onToggleGlobal}
            tooltip={contest.isGlobal ? "Make Non-Global" : "Make Global"}
            variant={contest.isGlobal ? "danger" : "info"}
          />
          <ActionButton 
            icon={<Trash2 className="h-4 w-4" />} 
            onClick={onDelete}
            tooltip="Delete Contest"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component (unchanged)
function StatCard({ title, value, icon, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-start gap-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

// Action Button Component (unchanged)
function ActionButton({ icon, onClick, tooltip, variant = 'primary' }) {
  const variantClasses = {
    primary: 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700',
    success: 'text-green-600 hover:bg-green-50 hover:text-green-700',
    danger: 'text-red-600 hover:bg-red-50 hover:text-red-700',
    info: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
  };

  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg ${variantClasses[variant]} transition-colors duration-200`}
      title={tooltip}
    >
      {icon}
    </button>
  );
}

// Updated Empty State Component
function EmptyState({ searchTerm, onCreateNew, type = "problems" }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg
        className="mx-auto h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-4 text-xl font-medium text-gray-900">
        {searchTerm ? `No matching ${type} found` : `No ${type} created yet`}
      </h3>
      <p className="mt-2 text-gray-600 max-w-md mx-auto">
        {searchTerm 
          ? "Try adjusting your search or filter to find what you're looking for."
          : `Get started by creating your first ${type === "problems" ? "coding problem" : "contest"}.`}
      </p>
      <div className="mt-6">
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Create New {type === "problems" ? "Problem" : "Contest"}
        </button>
      </div>
    </div>
  );
}