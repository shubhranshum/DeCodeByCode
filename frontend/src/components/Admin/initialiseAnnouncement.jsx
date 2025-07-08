
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const AnnouncementTitleModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTitle("");
      setError("");
     
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Announcement title cannot be empty");
      return;
    }

    

    onSubmit(title);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Announcement
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Announcement Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Enter announcement title"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

         

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-violet-600 rounded-lg hover:bg-indigo-700 dark:hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-violet-500 dark:focus:ring-offset-gray-800 flex items-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementTitleModal;