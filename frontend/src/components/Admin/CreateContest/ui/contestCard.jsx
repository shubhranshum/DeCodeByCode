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
export const ContestCard = ({
  contest,
  onView,
  onEdit,
  onVerify,
  onDelete,
  onToggleGlobal,
}) => {
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);

  const status =
    now < startTime ? "upcoming" : now > endTime ? "ended" : "running";

  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-150 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {contest.title || "Untitled Contest"}
            </h3>
            <div className="flex gap-2">
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  status === "running"
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                    : status === "upcoming"
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                }`}
              >
                {status === "running"
                  ? "Running"
                  : status === "upcoming"
                  ? "Upcoming"
                  : "Ended"}
              </span>
              {contest.isVerified && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                  Verified
                </span>
              )}
              {contest.isGlobal && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                  Global
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {contest.description || "No description available"}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Start: {startTime.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
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
            icon={
              contest.isGlobal ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )
            }
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
};