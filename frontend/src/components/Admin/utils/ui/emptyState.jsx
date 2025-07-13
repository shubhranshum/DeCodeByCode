import {
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  Plus,
  Globe,
  Search,
  FileText,
  Clock,
  AlertCircle,
  XCircle,
  Trophy,
  Megaphone,
  Calendar,
  User,
  Users,
  BookOpen,
  BarChart2,
} from "lucide-react";
export const EmptyState = ({ searchTerm, onCreateNew, type = "problems" }) => {
  const typeLabels = {
    problems: "coding problem",
    contests: "contest",
    announcements: "announcement",
    users: "user",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
        {searchTerm ? `No matching ${type} found` : `No ${type} created yet`}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md mx-auto">
        {searchTerm
          ? "Try adjusting your search or filter to find what you're looking for."
          : `Get started by creating your first ${typeLabels[type] || type}.`}
      </p>
      <div className="mt-6">
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Create New{" "}
          {type === "problems"
            ? "Problem"
            : type === "contests"
            ? "Contest"
            : "Announcement"}
        </button>
      </div>
    </div>
  );
};
