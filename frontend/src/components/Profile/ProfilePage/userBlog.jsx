import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye, FiHeart, FiSearch, FiPlus, FiFileText } from 'react-icons/fi';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonDangerBg: "bg-rose-400 hover:bg-rose-500",
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
    accentBg: "bg-amber-100",
    status: {
        Published: "bg-emerald-200 text-emerald-800",
        Draft: "bg-amber-200 text-amber-800",
        Archived: "bg-stone-200 text-stone-800",
    },
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-3 py-1.5 text-sm' : 'px-5 py-2.5 text-base';
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : type === 'danger' ? retroThemeColors.buttonDangerBg : retroThemeColors.buttonSecondaryBg;
    return (
        <button onClick={onClick} disabled={disabled} className={`border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold ${sizeStyle} ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

const TabButton = ({ label, count, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-base md:text-lg border-2 ${retroThemeColors.panelBorder} font-bold transition-all flex items-center gap-2 ${isActive ? `bg-teal-400 text-white shadow-chunky` : `bg-stone-200 text-stone-800 shadow-chunky hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`}`}>
        <span>{label}</span>
        <span className={`px-2 py-0.5 text-xs border-2 ${retroThemeColors.panelBorder} ${isActive ? 'bg-white/20' : 'bg-white'}`}>{count}</span>
    </button>
);

// --- Page Specific Components ---
const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
            <RetroCard key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-stone-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-stone-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-stone-200 rounded w-5/6 mb-6"></div>
                <div className="border-t-2 border-dashed border-stone-300 pt-4 flex justify-end gap-2">
                    <div className="h-8 bg-stone-200 rounded w-20"></div>
                    <div className="h-8 bg-stone-200 rounded w-20"></div>
                </div>
            </RetroCard>
        ))}
    </div>
);

const EmptyState = ({ activeTab, searchQuery }) => (
    <RetroCard className="p-12 text-center">
        <FiFileText className={`mx-auto h-16 w-16 mb-4 ${retroThemeColors.textSecondary}`} />
        <h3 className="text-2xl font-bold">{searchQuery ? "No Matches Found" : "Your Creative Space is Empty"}</h3>
        <p className={`text-lg mt-2 ${retroThemeColors.textSecondary}`}>
            {searchQuery ? `We couldn't find any blogs matching "${searchQuery}".` : `You haven't created any ${activeTab === 'Blog' ? 'published articles' : activeTab.replace('Blogs', '').toLowerCase() + 's'} yet.`}
        </p>
    </RetroCard>
);

const DeleteConfirmModal = ({ onConfirm, onCancel, isDeleting }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
        <RetroCard as={motion.div} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="p-6 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2">Confirm Deletion</h3>
            <p className="text-lg text-stone-600 mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
                <Button onClick={onCancel} type="secondary">Cancel</Button>
                <Button onClick={onConfirm} type="danger" className={retroThemeColors.buttonDangerBg}>
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </RetroCard>
    </motion.div>
);

// ================
// MAIN COMPONENT
// ================
export default function UserBlogs() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Blog');
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // --- LOGIC (Functionality Unchanged) ---
    const fetchUserBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3000/profile/user-blogs', { credentials: 'include' });
            const data = await res.json();
            setAllBlogs(Array.isArray(data) ? data : []);
        } catch (err) { console.error('Error fetching user blogs:', err); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchUserBlogs(); }, [fetchUserBlogs]);

    const filteredBlogs = useMemo(() => {
        return allBlogs
            .filter(blog => {
                if (activeTab === 'Blog') return blog.status === 'Published';
                if (activeTab === 'DraftBlogs') return blog.status === 'Draft';
                if (activeTab === 'ArchivedBlogs') return blog.status === 'Archived';
                return false;
            })
            .filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [allBlogs, activeTab, searchQuery]);

    const tabs = useMemo(() => [
        { key: 'Blog', label: 'Published', count: allBlogs.filter(b => b.status === 'Published').length },
        { key: 'DraftBlogs', label: 'Drafts', count: allBlogs.filter(b => b.status === 'Draft').length },
        { key: 'ArchivedBlogs', label: 'Archived', count: allBlogs.filter(b => b.status === 'Archived').length },
    ], [allBlogs]);

    const handleDeleteBlog = useCallback(async (blogId) => {
        setDeletingId(blogId);
        try {
            const res = await fetch(`http://localhost:3000/blog/${blogId}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                setAllBlogs(prev => prev.filter(blog => blog._id !== blogId));
            } else { console.error('Failed to delete blog'); }
        } catch (err) { console.error('Error deleting blog:', err); } 
        finally {
            setDeletingId(null);
            setShowDeleteConfirm(null);
        }
    }, []);

    return (
        <div className="min-h-screen py-12 px-4 bg-stone-100 font-retro">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-800">Your Content Hub</h1>
                        <p className="text-stone-600 text-lg">Manage all your blog posts in one place.</p>
                    </div>
                    <Button onClick={() => navigate('/create-blog')}>
                        <FiPlus /> Create New Blog
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map(tab => (
                            <TabButton key={tab.key} label={tab.label} count={tab.count} isActive={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
                        ))}
                    </div>
                    <div className="relative w-full md:w-72">
                        <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input type="text" placeholder="Search your blogs..." className={`w-full pl-12 pr-4 py-3 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                {loading ? <LoadingState /> : 
                 filteredBlogs.length === 0 ? <EmptyState activeTab={activeTab} searchQuery={searchQuery} /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {filteredBlogs.map((blog) => (
                                <motion.div
                                    key={blog._id} layout
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="border-4 border-stone-800 bg-white shadow-chunky flex flex-col relative"
                                >
                                    {deletingId === blog._id && <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20"><div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin"></div></div>}
                                    <div className="p-5 flex-1 flex flex-col cursor-pointer" onClick={() => navigate(`/blog/${blog._id}`)}>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-3 py-1 text-xs font-bold border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.status[blog.status]}`}>{blog.status}</span>
                                            <span className="text-xs text-stone-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-stone-800 mb-2 line-clamp-2">{blog.title}</h3>
                                        <p className="text-stone-600 mb-4 line-clamp-3 flex-1">{blog.summary || 'No summary.'}</p>
                                        <div className="flex items-center text-sm text-stone-500 mt-auto">
                                            <span className="flex items-center mr-4"><FiEye className="w-4 h-4 mr-1.5" />{blog.viewsCount || 0}</span>
                                            <span className="flex items-center"><FiHeart className="w-4 h-4 mr-1.5" />{blog.likesCount || 0}</span>
                                        </div>
                                    </div>
                                    <div className={`border-t-4 ${retroThemeColors.panelBorder} p-2 bg-stone-50 flex justify-end gap-2`}>
                                        <Button onClick={(e) => { e.stopPropagation(); navigate(`/edit-blog/${blog._id}`); }} small type="secondary"><FiEdit2 /> Edit</Button>
                                        <Button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(blog._id); }} small type="secondary" className={retroThemeColors.unfollowButtonBg}><FiTrash2 /> Delete</Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <DeleteConfirmModal 
                        onCancel={() => setShowDeleteConfirm(null)}
                        onConfirm={() => handleDeleteBlog(showDeleteConfirm)}
                        isDeleting={deletingId === showDeleteConfirm}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
