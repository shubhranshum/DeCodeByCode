import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProblemTitleModal from "./initialiseProblem.jsx";
import { fetchAllProblems } from "../Tasks/fetchAllProblems.jsx";
import { MoreVertical, Edit, Eye, Trash2, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    async function loadProblems() {
      try {
        setIsLoading(true);
        const data = await fetchAllProblems();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProblems();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProblems = problems.filter(problem =>
    problem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.statement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProblem = (title) => {
    fetch(`http://localhost:3000/admin/createProblem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
      credentials: "include",
    }).then(() => window.location.reload());
  };

  const handleDeleteProblem = (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      fetch(`http://localhost:3000/admin/deleteProblem/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(() => {
        setProblems(problems.filter(problem => problem._id !== id));
      });
    }
  };

  const displayId = (id) => {
    if (!id) return 'N/A';
    const idStr = typeof id === 'string' ? id : String(id);
    return idStr.length > 6 ? idStr.slice(-6) : idStr;
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Problem Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage coding problems</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Problem
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
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
          <div className="flex gap-2">
            <button className="border border-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Filter
            </button>
            <button className="border border-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Sort
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Total Problems</p>
            <p className="text-2xl font-semibold text-gray-900">{problems.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Verified</p>
            <p className="text-2xl font-semibold text-gray-900">
              {problems.filter(p => p.verified).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Drafts</p>
            <p className="text-2xl font-semibold text-gray-900">
              {problems.filter(p => p.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <p className="text-2xl font-semibold text-gray-900">
              {problems.filter(p => p.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Problems Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <div key={problem._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{problem.title || 'Untitled Problem'}</h3>
                    <div className="relative" ref={el => dropdownRefs.current[problem._id] = el}>
                      <button
                        onClick={() => toggleDropdown(problem._id)}
                        className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openDropdownId === problem._id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate(`/admin/edit-problem/${problem._id}`);
                                setOpenDropdownId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/problem/${problem._id}`);
                                setOpenDropdownId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteProblem(problem._id);
                                setOpenDropdownId(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </button>
                            <button
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {problem.statement || 'No description available'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      ID: {displayId(problem._id)}
                    </span>
                    {problem.difficulty && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {problem.difficulty}
                      </span>
                    )}
                    {problem.tags?.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date(problem.updatedAt || Date.now()).toLocaleDateString()}
                  </span>
                  <button
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate(`/admin/edit-problem/${problem._id}`)}
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No problems found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try a different search term" : "Get started by creating a new problem"}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Problem
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <ProblemTitleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProblem}
      />
    </div>
  );
}