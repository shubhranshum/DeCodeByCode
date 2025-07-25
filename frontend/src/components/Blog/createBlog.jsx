import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
  bgPrimary: "bg-stone-100",
  textPrimary: "text-stone-800",
  textSecondary: "text-stone-500",
  textAccent: "text-purple-600",
  panelBg: "bg-white",
  panelBorder: "border-stone-800",
  buttonPrimaryBg: "bg-purple-400 hover:bg-purple-500",
  buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
  buttonText: "text-stone-800",
  inputBg: "bg-stone-100",
  errorBg: "bg-rose-100",
  errorText: "text-rose-800",
  infoBg: "bg-sky-100",
};

// --- Reusable Retro UI Components ---
const Button = ({ children, onClick, disabled, className = "", isSubmit = false, type = "primary" }) => {
  const typeStyle = type === "primary" ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 ${typeStyle} ${className}`}
    >
      {children}
    </button>
  );
};

const RetroCard = ({ children, className = "" }) => (
  <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
    {children}
  </div>
);

const FormInput = ({ label, name, value, onChange, placeholder, required = false, ...props }) => (
  <div>
    <label className="block text-xl mb-2 font-bold">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full p-4 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`}
      {...props}
    />
  </div>
);

const FormTextarea = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-xl mb-2 font-bold">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-4 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none resize-none`}
    />
  </div>
);

const FormToggle = ({ label, name, checked, onChange }) => (
    <label className="flex items-center gap-4 cursor-pointer group">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
        <div className={`w-14 h-8 flex items-center p-1 border-2 ${retroThemeColors.panelBorder} transition-colors ${ checked ? 'bg-purple-400' : 'bg-stone-200' }`}>
            <div className={`w-6 h-6 bg-white border-2 ${retroThemeColors.panelBorder} transition-transform duration-300 ease-in-out ${ checked ? 'translate-x-6' : '' }`}/>
        </div>
        <span className="text-xl">{label}</span>
    </label>
);

// --- Loading and Auth States ---
const LoadingState = ({ text }) => ( <div className={`min-h-screen flex items-center justify-center ${retroThemeColors.bgPrimary} font-retro`}> <div className="flex flex-col items-center"> <div className={`w-16 h-16 border-4 ${retroThemeColors.panelBorder} border-t-transparent rounded-full animate-spin`}></div> <p className={`mt-4 text-2xl animate-pulse ${retroThemeColors.textPrimary}`}>{text}</p> </div> </div> );
const AuthRequiredState = ({ blogId }) => {
  const navigate = useNavigate();
  return (
    <div className={`min-h-screen ${retroThemeColors.bgPrimary} flex items-center justify-center p-4 font-retro`}>
      <RetroCard className="p-8 text-center max-w-md">
        <h2 className={`text-3xl mb-3 ${retroThemeColors.textAccent}`}>Authentication Required</h2>
        <p className={`text-xl mb-6 ${retroThemeColors.textSecondary}`}>You need to be logged in to {blogId ? "edit" : "create"} a blog post.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/login")} className={`${retroThemeColors.buttonPrimaryBg} ${retroThemeColors.buttonText}`}>Log In</Button>
          <Button onClick={() => navigate("/blogs")} type="secondary">Back to Blogs</Button>
        </div>
      </RetroCard>
    </div>
  );
};

// ================
// MAIN COMPONENT
// ================
export default function CreateBlogForm({ blogId }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    thumbnailUrl: "",
    tags: "",
    category: "",
    status: "",
    allowComments: true,
    isFeatured: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // --- Core Logic ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    document.head.appendChild(script);
    
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // **FIX: This useEffect now handles typesetting after the content changes.**
  useEffect(() => {
    // A more robust check to ensure the MathJax library and its methods are fully loaded.
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise();
    }
  }, [formData.content]); // Reruns whenever the blog content changes

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/check/auth", { credentials: "include" });
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (err) { setIsAuthenticated(false); } 
      finally { setIsCheckingAuth(false); }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!blogId || !isAuthenticated) return;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/blog/${blogId}`, { credentials: "include" });
        const data = await res.json();
        setFormData({ ...data, tags: (data.tags || []).join(", ") });
      } catch (err) { console.error("Failed to load blog for edit:", err); }
    };
    fetchBlog();
  }, [blogId, isAuthenticated]);

  const generateSlug = (title) => title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and Content are required.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    const payload = { ...formData, tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean), slug: generateSlug(formData.title) };
    try {
      const url = blogId ? `http://localhost:3000/update-blog/${blogId}` : "http://localhost:3000/create-blog";
      const method = blogId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
      if (!res.ok) { const errData = await res.json(); throw new Error(errData.error || "Save failed"); }
      navigate(-1);
    } catch (err) { setError(err.message || "An error occurred."); } 
    finally { setIsSubmitting(false); }
  };

  if (isCheckingAuth) return <LoadingState text="Authenticating..." />;
  if (!isAuthenticated) return <AuthRequiredState blogId={blogId} />;

  return (
    <div className={`min-h-screen ${retroThemeColors.bgPrimary} font-retro p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        <RetroCard className="p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl">{blogId ? "Edit Blog Post" : "Create New Post"}</h1>
              <p className={`text-lg mt-1 ${retroThemeColors.textSecondary}`}>Share your story with the world.</p>
            </div>
            <Button onClick={() => navigate("/blogs")} type="secondary">Back to Blogs</Button>
          </div>
        </RetroCard>

        <form onSubmit={handleSubmit}>
          <RetroCard className="p-8">
            {error && <div className={`p-4 mb-6 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.errorBg} ${retroThemeColors.errorText}`}>{error}</div>}
            <div className="space-y-8">
              <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Your amazing article title..." required />
              <FormTextarea label="Summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="A short, catchy summary for the blog list." />
              <FormInput label="Thumbnail URL" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />

              <div>
                <label className="block text-xl mb-2">Content <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`border-2 ${retroThemeColors.panelBorder}`}>
                        <Editor
                            apiKey="xfy31sy8ugnbx53as6d1eturl2idrzmpe9sujc9pixrpqpqu"
                            value={formData.content}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 500, menubar: false,
                                plugins: "lists link anchor codesample emoticons",
                                toolbar: "undo redo | blocks | bold italic underline | bullist numlist | link codesample emoticons",
                                content_style: `body { font-family: 'Georgia', serif; font-size: 16px; background: #fdfdf2; color: #44403c; } h1, h2, h3 { font-family: 'VT323', monospace; color: #1c1917; } code { background: #e7e5e4; padding: 2px 4px; border-radius: 4px; } pre { background: #292524; color: #f1f5f9; padding: 1rem; border-radius: 0; }`,
                            }}
                        />
                    </div>
                    <div>
                        <div className={`p-4 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} h-full overflow-y-auto`}>
                            <h3 className="text-lg font-bold mb-2">Live Preview</h3>
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
                        </div>
                    </div>
                </div>
              </div>

              <div className={`p-6 border-2 border-dashed ${retroThemeColors.panelBorder} ${retroThemeColors.infoBg} space-y-6`}>
                <h3 className="text-2xl">Article Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Technology" />
                  <FormInput label="Tags (comma-separated)" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., react, javascript" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <FormToggle label="Allow Comments" name="allowComments" checked={formData.allowComments} onChange={handleChange} />
                  <FormToggle label="Feature this Article" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-xl mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={`w-full p-4 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`}>
                    <option value="Draft">📝 Draft</option>
                    <option value="Published">🌟 Published</option>
                    <option value="Archived">📦 Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t-2 border-dashed border-stone-300">
                <Button isSubmit={true} disabled={isSubmitting} className={`${retroThemeColors.buttonPrimaryBg} ${retroThemeColors.buttonText}`}>
                  {isSubmitting ? "Saving..." : blogId ? "Save Changes" : "Publish Article"}
                </Button>
              </div>
            </div>
          </RetroCard>
        </form>
      </div>
    </div>
  );
}
