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
export const StatCard = ({ title, value, icon, color = "indigo" }) => {
  const colorClasses = {
    indigo:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300",
    emerald:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
    amber:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300",
    violet:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-start gap-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
      </div>
    </div>
  );
};