import { Link } from "react-router-dom";
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
import { ActionButton } from "../../utils/ActionButton";

export const ProblemCard = ({
  problem,
  onView,
  onEdit,
  onVerify,
  onDelete,
  onToggleGlobal,
}) => {
  // Get theme from local storage (default to light if not set)
  const theme = localStorage.getItem('theme') || 'light';

  // Theme-based colors
  const colors = {
    light: {
      cardBg: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      title: 'text-purple-800',
      content: 'text-gray-700',
      border: 'border-gray-200',
      meta: 'text-gray-500',
      icon: 'text-purple-600',
    },
    dark: {
      cardBg: 'bg-gray-900',
      cardHover: 'hover:bg-gray-800',
      title: 'text-orange-300',
      content: 'text-gray-300',
      border: 'border-gray-700',
      meta: 'text-gray-400',
      icon: 'text-orange-400',
    }
  };

  const currentColors = colors[theme];

  return (
    <div className={`p-6 rounded-lg border ${currentColors.border} ${currentColors.cardBg} ${currentColors.cardHover} transition-all duration-300 group shadow-sm hover:shadow-md`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title and Status Row */}
          <div className="flex flex-col space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className={`text-xl font-bold ${currentColors.title} tracking-tight`}>
                {problem.title || "Untitled Problem"}
              </h3>
              <div className="flex gap-2">
                <span
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    problem.isVerified
                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {problem.isVerified ? "Verified" : "Unverified"}
                </span>
                {problem.isGlobal && (
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                    Global
                  </span>
                )}
                {problem.status === "draft" && (
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                    Draft
                  </span>
                )}
              </div>
            </div>
            
            {/* Divider */}
            <div className={`h-px w-full ${currentColors.border} opacity-70`}></div>
          </div>

          {/* Problem Statement */}
          <p className={`text-sm ${currentColors.content} mb-3 line-clamp-2 leading-relaxed`}>
            {problem.statement || "No description available"}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className={`flex items-center gap-2 ${currentColors.meta}`}>
              <Clock className={`w-4 h-4 ${currentColors.icon}`} />
              <span>
                Updated: {new Date(problem.updatedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className={`flex items-center gap-2 ${currentColors.meta}`}>
              <Clock className={`w-4 h-4 ${currentColors.icon}`} />
              <span>
                Created: {new Date(problem.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            icon={
              problem.isGlobal ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )
            }
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
};