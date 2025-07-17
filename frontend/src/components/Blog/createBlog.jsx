import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const CreateBlogForm = ({ blogId }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // Default to light theme
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    thumbnailUrl: "",
    tags: "",
    category: "",
    status: "Draft",
    allowComments: true,
    isFeatured: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  // Apply theme to the document root
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/check/auth", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.isAuthenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to check authentication:", err);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // If we're editing, fetch existing blog and prefill
  useEffect(() => {
    if (!blogId || !isAuthenticated) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/blog/${blogId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setFormData({
          title: data.title,
          content: data.content,
          summary: data.summary || "",
          thumbnailUrl: data.thumbnailUrl || "",
          tags: (data.tags || []).join(","),
          category: data.category || "",
          status: data.status,
          allowComments: data.allowComments,
          isFeatured: data.isFeatured,
        });
      } catch (err) {
        console.error("Failed to load blog for edit:", err);
      }
    };

    fetchBlog();
  }, [blogId, isAuthenticated]);

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (event, editor) => {
    const newContent = editor.getData();
    setFormData((prev) => ({
      ...prev,
      content: newContent,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      setIsSubmitting(false);
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: tagsArray,
      slug: generateSlug(formData.title),
    };

    try {
      const url = blogId
        ? `http://localhost:3000/update-blog/${blogId}`
        : "http://localhost:3000/create-blog";
      const method = blogId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Save failed");
      }

      navigate("/blogs");
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme-specific classes
  const bgGradient =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 to-slate-900"
      : "bg-gradient-to-br from-slate-50 to-white";

  const cardBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-slate-100";

  const textColor = theme === "dark" ? "text-slate-200" : "text-slate-700";

  const headingColor = theme === "dark" ? "text-white" : "text-slate-800";

  const inputBg =
    theme === "dark"
      ? "bg-slate-700 border-slate-600 text-slate-100"
      : "bg-slate-50 border-slate-200 text-slate-700";

  const accentColor = theme === "dark" ? "text-indigo-400" : "text-indigo-600";

  const buttonPrimary =
    theme === "dark"
      ? "bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900"
      : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800";

  const buttonSecondary =
    theme === "dark"
      ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
      : "bg-slate-100 hover:bg-slate-200 text-slate-700";

  const tipsBg =
    theme === "dark"
      ? "bg-indigo-900/30 border-indigo-800"
      : "bg-indigo-50 border-indigo-100";

  const tipsText = theme === "dark" ? "text-indigo-300" : "text-indigo-700";

  const errorBg =
    theme === "dark"
      ? "bg-red-900/30 border-red-800"
      : "bg-red-50 border-red-200";

  const errorText = theme === "dark" ? "text-red-300" : "text-red-700";

  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}
      >
        <div
          className={`w-16 h-16 border-4 ${accentColor} border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen ${bgGradient} flex flex-col items-center justify-center px-4 py-12`}
      >
        <div className="max-w-md w-full text-center">
          <div className={`${cardBg} rounded-2xl shadow-lg p-8 border`}>
            <div
              className={`${
                theme === "dark" ? "bg-indigo-900/50" : "bg-indigo-100"
              } w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <svg
                className={`w-10 h-10 ${accentColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h2 className={`text-2xl font-bold ${headingColor} mb-3`}>
              Authentication Required
            </h2>
            <p className={`${textColor} mb-6`}>
              You need to be logged in to {blogId ? "edit" : "create"} blog
              posts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/login")}
                className={`px-6 py-3 ${buttonPrimary} text-white rounded-lg font-medium flex items-center justify-center gap-2`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Log In
              </button>

              <button
                onClick={() => navigate("/blogs")}
                className={`px-6 py-3 ${buttonSecondary} rounded-lg font-medium`}
              >
                Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgGradient}`}>
      {/* Header */}
      <div
        className={`${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-100"
        } border-b sticky top-0 z-10 shadow-sm`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-indigo-700 to-purple-800"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600"
                } rounded-lg flex items-center justify-center`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${headingColor}`}>
                  {blogId ? "Edit Blog Post" : "Create New Blog Post"}
                </h1>
                <p
                  className={`${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  } text-sm`}
                >
                  {blogId
                    ? "Update your existing content"
                    : "Share your knowledge with the community"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/blogs")}
              className={`p-2 rounded-full ${
                theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-100"
              } transition-colors`}
            >
              <svg
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Main Form Card */}
        <div
          className={`${cardBg} rounded-2xl shadow-sm border overflow-hidden`}
        >
          <div className="p-8">
            {error && (
              <div
                className={`mb-6 p-4 ${errorBg} rounded-xl flex items-start gap-3`}
              >
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-red-300" : "text-red-800"
                    }`}
                  >
                    Error
                  </h3>
                  <p className={`text-sm ${errorText} mt-1`}>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Section */}
              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${textColor} mb-3`}
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter your article title..."
                    className={`w-full px-4 py-4 text-lg ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200 placeholder:text-slate-400`}
                  />
                  {formData.title && (
                    <div
                      className={`mt-2 p-3 ${
                        theme === "dark"
                          ? "bg-indigo-900/30 border-indigo-800"
                          : "bg-indigo-50 border-indigo-100"
                      } rounded-lg border`}
                    >
                      <p
                        className={`text-xs ${
                          theme === "dark"
                            ? "text-indigo-400"
                            : "text-indigo-600"
                        } font-medium`}
                      >
                        URL Preview:{" "}
                        <span
                          className={`font-mono ${
                            theme === "dark"
                              ? "bg-indigo-900/50"
                              : "bg-indigo-100"
                          } px-2 py-1 rounded`}
                        >
                          {generateSlug(formData.title)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${textColor} mb-3`}
                  >
                    Summary
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Brief description of your article (appears on blog listing pages)..."
                    className={`w-full px-4 py-4 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 resize-none`}
                  />
                  <div
                    className={`text-right text-sm ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    } mt-1`}
                  >
                    {formData.summary.length}/300 characters
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="border-t border-slate-700 pt-8">
                <div className="flex justify-between items-center mb-3">
                  <label className={`block text-sm font-medium ${textColor}`}>
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {formData.content.replace(/<[^>]*>/g, "").length} characters
                  </div>
                </div>

                <div
                  className={`editor-container border ${
                    theme === "dark" ? "border-slate-700" : "border-slate-200"
                  } rounded-lg overflow-hidden`}
                >
                  <Editor
                    apiKey="xfy31sy8ugnbx53as6d1eturl2idrzmpe9sujc9pixrpqpqu"
                    value={formData.content}
                    onEditorChange={(newValue) => {
                      setFormData({ ...formData, content: newValue });

                      // Delay renderMath to allow DOM update
                      setTimeout(() => {
                        if (window.renderMath) window.renderMath();
                      }, 0);
                    }}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        "lists",
                        "link",
                        "anchor",
                        "autosave",
                        "emoticons",
                        "visualblocks",
                        "autolink",
                        "codesample",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic underline | alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist outdent indent | link anchor codesample | " +
                        "emoticons visualblocks | removeformat",
                      content_style: `body { 
          font-family:Urbanist,sans-serif; 
          font-size:14px; 
          background: ${theme === "dark" ? "#1e293b" : "#f8fafc"}; 
          color: ${theme === "dark" ? "#e2e8f0" : "#334155"};
         }`,
                      skin: theme === "dark" ? "oxide-dark" : "oxide",
                      content_css: theme === "dark" ? "dark" : "default",
                    }}
                  />
                </div>
              </div>

              {/* Metadata Section */}
              <div className="border-t border-slate-700 pt-8 space-y-6">
                <h3
                  className={`text-lg font-semibold ${headingColor} flex items-center gap-2`}
                >
                  <svg
                    className={`w-5 h-5 ${accentColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Article Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium ${textColor} mb-3`}
                    >
                      Category
                    </label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g., Technology, Lifestyle..."
                      className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200 placeholder:text-slate-400`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${textColor} mb-3`}
                    >
                      Tags
                    </label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="tag1, tag2, tag3..."
                      className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200 placeholder:text-slate-400`}
                    />
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                      } mt-2`}
                    >
                      Separate multiple tags with commas
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${textColor} mb-3`}
                  >
                    Thumbnail Image URL
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={(e) => {
                          setThumbnailError(false);
                          handleChange(e);
                        }}
                        placeholder="https://example.com/image.jpg"
                        className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200 placeholder:text-slate-400`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          thumbnailUrl:
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
                        }));
                        setThumbnailError(false);
                      }}
                      className={`text-sm px-4 py-2 ${buttonSecondary} rounded-xl`}
                    >
                      Use Sample
                    </button>
                  </div>
                  {(formData.thumbnailUrl || thumbnailError) && (
                    <div className="mt-3">
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-slate-400" : "text-slate-500"
                        } mb-2`}
                      >
                        Preview:
                      </div>
                      <div
                        className={`relative w-64 h-36 rounded-lg border ${
                          theme === "dark"
                            ? "border-slate-700"
                            : "border-slate-200"
                        } overflow-hidden`}
                      >
                        {thumbnailError ? (
                          <div
                            className={`${
                              theme === "dark" ? "bg-slate-700" : "bg-slate-100"
                            } border-2 border-dashed ${
                              theme === "dark"
                                ? "border-slate-600"
                                : "border-slate-300"
                            } rounded-lg w-full h-full flex flex-col items-center justify-center ${
                              theme === "dark"
                                ? "text-slate-500"
                                : "text-slate-400"
                            }`}
                          >
                            <svg
                              className="w-8 h-8 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-xs">Invalid image URL</span>
                          </div>
                        ) : (
                          <img
                            src={formData.thumbnailUrl}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={() => setThumbnailError(true)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div className="border-t border-slate-700 pt-8">
                <h3
                  className={`text-lg font-semibold ${headingColor} mb-6 flex items-center gap-2`}
                >
                  <svg
                    className={`w-5 h-5 ${accentColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  Publishing Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium ${textColor} mb-3`}
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200`}
                    >
                      <option value="Draft">📝 Draft</option>
                      <option value="Published">🌟 Published</option>
                      <option value="Archived">📁 Archived</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="allowComments"
                          checked={formData.allowComments}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-200 ${
                            formData.allowComments
                              ? theme === "dark"
                                ? "bg-indigo-700"
                                : "bg-indigo-500"
                              : `${
                                  theme === "dark"
                                    ? "bg-slate-600 group-hover:bg-slate-500"
                                    : "bg-slate-300 group-hover:bg-slate-400"
                                }`
                          }`}
                        >
                          <div
                            className={`${
                              theme === "dark" ? "bg-slate-300" : "bg-white"
                            } w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              formData.allowComments ? "translate-x-4" : ""
                            }`}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${textColor}`}>
                        Allow Comments
                      </span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-200 ${
                            formData.isFeatured
                              ? "bg-amber-500"
                              : `${
                                  theme === "dark"
                                    ? "bg-slate-600 group-hover:bg-slate-500"
                                    : "bg-slate-300 group-hover:bg-slate-400"
                                }`
                          }`}
                        >
                          <div
                            className={`${
                              theme === "dark" ? "bg-slate-300" : "bg-white"
                            } w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              formData.isFeatured ? "translate-x-4" : ""
                            }`}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${textColor}`}>
                        Featured Article
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-700 pt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 ${buttonPrimary} text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:${
                      theme === "dark" ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>
                          {blogId ? "Saving Changes..." : "Publishing..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        <span>
                          {blogId ? "Save Changes" : "Publish Article"}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/blogs")}
                    className={`px-8 py-4 ${buttonSecondary} font-semibold rounded-xl transition-all duration-200`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Tips Panel */}
        <div className={`mt-8 ${tipsBg} rounded-2xl p-6 border`}>
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-indigo-300" : "text-indigo-800"
            } mb-4 flex items-center gap-2`}
          >
            <svg
              className={`w-5 h-5 ${accentColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Writing Tips
          </h3>
          <ul className={`space-y-2 text-sm ${tipsText}`}>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Keep titles clear and descriptive (50-70 characters)</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Summaries should be 120-160 characters for SEO</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Use 3-5 relevant tags to increase discoverability</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Featured images should be at least 1200×630 pixels</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogForm;
