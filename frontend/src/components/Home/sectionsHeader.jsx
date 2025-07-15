import { Link } from "react-router-dom";
const SectionHeader = ({ title, action, icon }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold flex items-center gap-2">
      {icon && <span>{icon}</span>}
      {title}
    </h2>
    {action && (
      <Link
        to={action.link || "#"}
        className="text-orange-300 hover:underline text-sm flex items-center gap-1"
      >
        {action.text}
        <span>→</span>
      </Link>
    )}
  </div>
);
export default SectionHeader;