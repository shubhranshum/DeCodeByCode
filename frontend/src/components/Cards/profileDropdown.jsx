import { useState, useRef, useEffect } from "react";

export default function ProfileDropdown({ user, onSignOut }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-gray-700"
      >
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
        <span className="font-medium">{user?.username}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
          <a
            href="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            View Profile
          </a>
          <button
            onClick={onSignOut}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
