import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProblemTitleModal from "./initialiseProblem.jsx";
import { getAdminProblems } from "../Tasks/getAdminProblems.jsx";
import { Edit, Eye, Trash2, CheckCircle, Plus } from "lucide-react";

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
      }).then(() => window.location.reload());;
      // setProblems(problems.filter(p => p._id !== id));
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
        p._id === id ? { ...p, verified: true } : p
      ));
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleViewProblem = (id) => navigate(`/admin/problem/${id}`);
  const handleEditProblem = (id) => navigate(`/admin/edit-problem/${id}`);


  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Problem Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage coding problems</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Problem
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="relative max-w-md mb-6">
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Problems" value={problems.length} />
            <StatCard title="Verified" value={problems.filter(p => p.verified).length} />
            <StatCard title="Drafts" value={problems.filter(p => p.status === 'draft').length} />
            <StatCard title="Active" value={problems.filter(p => p.status === 'active').length} />
          </div>
        </div>

        {/* Problems List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredProblems.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  onView={() => handleViewProblem(problem._id)}
                  onEdit={() => handleEditProblem(problem._id)}
                  onVerify={() => handleVerifyProblem(problem._id)}
                  onDelete={() => handleDeleteProblem(problem._id)}
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
function ProblemCard({ problem, onView, onEdit, onVerify, onDelete }) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {problem.title || 'Untitled Problem'}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              problem.verified 
                ? 'bg-green-100 text-green-800' 
                : problem.status === 'draft' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
            }`}>
              {problem.isVerified ? 'Verified' : problem.status || 'Active'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {problem.statement || 'No description available'}
          </p>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
            <span className="font-mono">{problem.isVerified == false ? "Not Verified" : "Verified"}</span>
            <span>•</span>
            <span>Last updated: {new Date(problem.updatedAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex space-x-2">
          <ActionButton 
            icon={<Eye className="h-4 w-4" />} 
            onClick={onView}
            tooltip="View Problem"
          />
          <ActionButton 
            icon={<Edit className="h-4 w-4" />} 
            onClick={onEdit}
            tooltip="Edit Problem"
          />
          {!problem.verified && (
            <ActionButton 
              icon={<CheckCircle className="h-4 w-4" />} 
              onClick={onVerify}
              tooltip="Verify Problem"
              variant="success"
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
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// Action Button Component
function ActionButton({ icon, onClick, tooltip, variant = 'default' }) {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-500 hover:bg-gray-100',
    success: 'text-green-400 hover:text-green-500 hover:bg-green-50',
    danger: 'text-red-400 hover:text-red-500 hover:bg-red-50'
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full ${variantClasses[variant]}`}
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
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {searchTerm ? "No matching problems found" : "No problems created yet"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {searchTerm ? "Try a different search term" : "Get started by creating a new problem"}
      </p>
      <div className="mt-6">
        <button
          onClick={onCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Create Problem
        </button>
      </div>
    </div>
  );
}