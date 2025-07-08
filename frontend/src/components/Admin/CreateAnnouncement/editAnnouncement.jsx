import { useState, useEffect } from "react";
import { getAnnouncementById } from "./hooks/getAnnouncementById";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const typeOptions = [
  { value: "info", label: "Info", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "warning", label: "Warning", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "alert", label: "Alert", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { value: "update", label: "Update", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { value: "success", label: "Success", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
];

const audienceOptions = [
  { value: "all", label: "All Users" },
  { value: "admins", label: "Admins Only" },
  { value: "users", label: "Registered Users" },
  { value: "guests", label: "Guests Only" },
];

export default function EditAnnouncementForm() {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  
  // Get theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Apply theme class to document element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [announcement, setAnnouncement] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    isPinned: false,
    isVisible: true,
    isGlobal: false,
    visibleFrom: "",
    visibleTill: "",
    audience: "all",
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await getAnnouncementById(announcementId);
        setAnnouncement(response);
        
        setFormData({
          title: response.title || "",
          message: response.message || "",
          type: response.type || "info",
          isPinned: response.isPinned || false,
          isVisible: response.isVisible ?? true,
          isGlobal: response.isGlobal || false,
          visibleFrom: response.visibleFrom?.slice(0, 16) || "",
          visibleTill: response.visibleTill?.slice(0, 16) || "",
          audience: response.audience || "all",
        });
      } catch (error) {
        console.error("Error fetching announcement:", error);
        toast.error("Failed to load announcement");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncement();
  }, [announcementId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    if (formData.visibleFrom && formData.visibleTill && 
        new Date(formData.visibleFrom) > new Date(formData.visibleTill)) {
      newErrors.dateRange = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      const res = await fetch(`http://localhost:3000/admin/edit-announcement/${announcementId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        toast.success("Announcement updated successfully");
        navigate("/announcements", { replace: true });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update announcement");
      }
    } catch (error) {
      console.error("Error submitting announcement:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-900 dark:to-orange-800 p-6 text-white">
          <h2 className="text-2xl font-bold">Edit Announcement</h2>
          <p className="opacity-90">Update the announcement details below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Announcement title"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Detailed announcement message"
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                errors.message ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.message && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className={opt.color}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audience
              </label>
              <select
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {audienceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPinned"
                name="isPinned"
                checked={formData.isPinned}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 dark:text-orange-500 focus:ring-purple-500 dark:focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              />
              <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Pin to top
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVisible"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 dark:text-orange-500 focus:ring-purple-500 dark:focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              />
              <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Visible
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isGlobal"
                name="isGlobal"
                checked={formData.isGlobal}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 dark:text-orange-500 focus:ring-purple-500 dark:focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              />
              <label htmlFor="isGlobal" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Global announcement
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="visibleFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visible From
              </label>
              <input
                type="datetime-local"
                id="visibleFrom"
                name="visibleFrom"
                value={formData.visibleFrom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="visibleTill" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visible Till
              </label>
              <input
                type="datetime-local"
                id="visibleTill"
                name="visibleTill"
                value={formData.visibleTill}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-orange-500 dark:focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          {errors.dateRange && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.dateRange}</p>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-orange-500 ${
                submitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}