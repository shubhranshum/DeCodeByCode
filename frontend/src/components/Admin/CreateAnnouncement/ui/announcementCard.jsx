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
export const AnnouncementCard = ({
  announcement,
  onView,
  onEdit,
  onVerify,
  onDelete,
  onToggleGlobal,
}) => {
  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-150 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {announcement.title || "Untitled Announcement"}
            </h3>
            <div className="flex gap-2">
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  announcement.isVerified
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                }`}
              >
                {announcement.isVerified ? "Verified" : "Unverified"}
              </span>
              {announcement.isGlobal && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                  Global
                </span>
              )}
              {announcement.importance === "high" && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                  High Priority
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {announcement.message || "No content available"}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Created:{" "}
                {new Date(
                  announcement.createdAt || Date.now()
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Author: {announcement.createdBy.username || "Admin"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            onClick={onView}
            tooltip="View Announcement"
            variant="primary"
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            onClick={onEdit}
            tooltip="Edit Announcement"
            variant="primary"
          />
          {!announcement.isVerified && (
            <ActionButton
              icon={<CheckCircle className="h-4 w-4" />}
              onClick={onVerify}
              tooltip="Verify Announcement"
              variant="success"
            />
          )}
          <ActionButton
            icon={
              announcement.isGlobal ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )
            }
            onClick={onToggleGlobal}
            tooltip={announcement.isGlobal ? "Make Non-Global" : "Make Global"}
            variant={announcement.isGlobal ? "danger" : "info"}
          />
          <ActionButton
            icon={<Trash2 className="h-4 w-4" />}
            onClick={onDelete}
            tooltip="Delete Announcement"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
};