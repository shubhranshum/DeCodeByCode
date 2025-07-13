export const ActionButton = ({ icon, onClick, tooltip, variant = "primary" }) => {
  const variantClasses = {
    primary:
      "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50",
    success:
      "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50",
    danger:
      "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50",
    info: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50",
    warning:
      "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/50",
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
};