import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProblemTitleModal from "./initialiseProblem.jsx";
import { getAdminProblems } from "../Tasks/getAdminProblems.jsx";
import { Edit, Eye, Trash2, CheckCircle, Plus, Globe, Search, FileText, Clock, AlertCircle, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch problems
  useEffect(() => {
    async function loadProblems() {
      try {
        setIsLoading(true);
        const data = await getAdminProblems();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProblems();
  }, []);

  // Filter problems
  const filteredProblems = problems.filter(problem =>
    problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.statement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Problem actions
  const handleCreateProblem = (title) => {
    fetch(`http://localhost:3000/admin/createProblem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
      credentials: "include",
    }).then(() => window.location.reload());
  };

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
      await fetch(`http://localhost:3000/admin/edit-problem/${id}/verify`, {
        method: "POST",
        credentials: "include",
      });
      setProblems(problems.map(p =>
        p._id === id ? { ...p, isVerified: true } : p
      ));
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const toggleGlobalStatus = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus 
        ? `http://localhost:3000/admin/makeProblemNonGlobal/${id}`
        : `http://localhost:3000/admin/makeProblemGlobal/${id}`;
      
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

  const handleViewProblem = (id) => navigate(`/admin/problem/${id}`);
  const handleEditProblem = (id) => navigate(`/admin/edit-problem/${id}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Problem Management</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage coding problems</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> New Problem
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        </div>

        {/* Problems List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredProblems.length > 0 ? (
          <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  onView={() => handleViewProblem(problem._id)}
                  onEdit={() => handleEditProblem(problem._id)}
                  onVerify={() => handleVerifyProblem(problem._id)}
                  onDelete={() => handleDeleteProblem(problem._id)}
                  onToggleGlobal={() => toggleGlobalStatus(problem._id, problem.isGlobal)}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState 
            searchTerm={searchTerm} 
            onCreateNew={() => setIsModalOpen(true)}
          />
        )}
      </main>

      {/* Create Problem Modal */}
      <ProblemTitleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProblem}
      />
    </div>
  );
}

// Problem Card Component
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
          {problem.isVerified && (
            <ActionButton 
              icon={problem.isGlobal ? <XCircle className="h-4 w-4" /> : <Globe className="h-4 w-4" />} 
              onClick={onToggleGlobal}
              tooltip={problem.isGlobal ? "Make Non-Global" : "Make Global"}
              variant={problem.isGlobal ? "danger" : "info"}
            />
          )}
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

// Stat Card Component
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

// Action Button Component
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

// Empty State Component
function EmptyState({ searchTerm, onCreateNew }) {
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
        {searchTerm ? "No matching problems found" : "No problems created yet"}
      </h3>
      <p className="mt-2 text-gray-600 max-w-md mx-auto">
        {searchTerm 
          ? "Try adjusting your search or filter to find what you're looking for."
          : "Get started by creating your first coding problem."}
      </p>
      <div className="mt-6">
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Create New Problem
        </button>
      </div>
    </div>
  );
}