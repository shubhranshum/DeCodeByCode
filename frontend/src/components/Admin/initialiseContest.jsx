import { useState } from "react";

export default function ContestTitleModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim() === "") return;
    onSubmit(title.trim());
    setTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Enter Problem Title</h2>
        <input
          type="text"
          placeholder="e.g., GCD of Arrays"
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}


