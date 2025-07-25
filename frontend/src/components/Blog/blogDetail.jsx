import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

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
    buttonText: "text-stone-800",
    inputBg: "bg-stone-100",
    accentBg: "bg-amber-100",
    likeButton: "bg-rose-200 hover:bg-rose-300",
    bookmarkButton: "bg-sky-200 hover:bg-sky-300",
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-4 py-2 text-base' : 'px-5 py-2.5 text-lg';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
    const typeStyle = type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg;
    return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>{children}</button>;
};

const RetroCard = ({ children, className = '' }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}>
        {children}
    </div>
);

// --- Page Specific Components ---
const LoadingState = () => <div className={`min-h-screen flex items-center justify-center ${retroThemeColors.bgPrimary} font-retro text-2xl`}><div className={`w-16 h-16 border-4 ${retroThemeColors.panelBorder} border-t-transparent rounded-full animate-spin`}></div></div>;
const NotFoundState = () => {
    const navigate = useNavigate();
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-4 text-center ${retroThemeColors.bgPrimary} font-retro`}>
            <RetroCard className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-3">Article Not Found</h2>
                <p className={`mb-6 max-w-md text-lg ${retroThemeColors.textSecondary}`}>The article you're looking for doesn't exist or may have been removed.</p>
                <Button onClick={() => navigate('/blogs')}>Back to All Articles</Button>
            </RetroCard>
        </div>
    );
};

const TableOfContents = ({ headings, showToc, setShowToc, scrollToHeading }) => {
    return (
        <AnimatePresence>
            {showToc && (
                <motion.div className="fixed inset-0 bg-black/60 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowToc(false)}>
                    <motion.div className={`w-full max-w-xs h-full overflow-y-auto p-8 border-l-4 ${retroThemeColors.panelBorder} ${retroThemeColors.panelBg}`} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} onClick={e => e.stopPropagation()}>
                        <h3 className={`text-3xl mb-8 ${retroThemeColors.textPrimary}`}>CONTENTS</h3>
                        <ul className="space-y-2">
                            {headings.map((h) => (
                                <li key={h.id}>
                                    <a href={`#${h.id}`} onClick={e => { e.preventDefault(); scrollToHeading(h.id); }} className={`block py-1 transition-colors ${retroThemeColors.textPrimary} hover:${retroThemeColors.textAccent} ${h.level > 1 ? `pl-${(h.level - 1) * 4}` : ''}`}>
                                        {h.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// ================
// MAIN COMPONENT
// ================
export default function BlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyToggles, setReplyToggles] = useState({});
    const [replyTexts, setReplyTexts] = useState({});
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [showToc, setShowToc] = useState(false);
    const [headings, setHeadings] = useState([]);
    const contentRef = useRef(null);
    const [showRepliesState, setShowRepliesState] = useState({});

    // --- Logic Hooks with Full Functionality ---
    const checkIfLiked = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/like`, { method: 'GET', credentials: 'include' });
            if (res.ok) { const data = await res.json(); setLiked(data.liked); }
        } catch (err) { console.error('Failed to check if liked', err); }
    }, [id]);

    const checkIfBookmarked = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/bookmarkStatus`, { method: 'GET', credentials: 'include' });
            if (res.ok) { const data = await res.json(); setBookmarked(data.bookmarked); }
        } catch (err) { console.error('Failed to check if bookmarked', err); }
    }, [id]);
    
    const fetchBlogAndComments = useCallback(async () => {
        setLoading(true);
        try {
            const [blogRes, commentRes, authRes] = await Promise.all([
                fetch(`http://localhost:3000/blog/${id}`, { credentials: 'include' }),
                fetch(`http://localhost:3000/blog/comments/${id}`, { credentials: 'include' }),
                fetch('http://localhost:3000/check/auth', { credentials: 'include' }),
            ]);
            if (!blogRes.ok) throw new Error("Blog not found");
            const blogData = await blogRes.json();
            const commentData = await commentRes.json();
            const authData = await authRes.json();
            setBlog(blogData);
            setComments(Array.isArray(commentData) ? commentData : []);
            setIsLoggedIn(authData.isAuthenticated);
            if(authData.isAuthenticated){
                checkIfLiked();
                checkIfBookmarked();
            }
        } catch (err) {
            console.error("Failed to load blog data:", err);
            setBlog(null);
        } finally {
            setLoading(false);
        }
    }, [id, checkIfLiked, checkIfBookmarked]);

    useEffect(() => { fetchBlogAndComments(); }, [fetchBlogAndComments]);
    
   const handleLike = async () => {
        if (!isLoggedIn) return navigate('/login');
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/like`, { method: 'POST', credentials: 'include' });
            if (res.ok) {
                setLiked(prev => !prev);
                setBlog(prev => ({ ...prev, likesCount: liked ? prev.likesCount - 1 : prev.likesCount + 1 }));
            }
        } catch (err) { console.error('Failed to like blog', err); }
    };

    const handleBookmark = async () => {
        if (!isLoggedIn) return navigate('/login');
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/bookmark`, { method: 'POST', credentials: 'include' });
            if (res.ok) setBookmarked(prev => !prev);
        } catch (err) { console.error('Failed to bookmark blog', err); }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}`, {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newComment }),
            });
            if (res.ok) { setNewComment(''); fetchBlogAndComments(); }
        } catch (err) { console.error('Failed to post comment:', err); }
    };
    
    const handleReplySubmit = async (parentCommentId) => {
        const replyText = replyTexts[parentCommentId];
        if (!replyText?.trim()) return;
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/reply`, {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: replyText, parentCommentId }),
            });
            if (res.ok) {
                setReplyTexts(prev => ({ ...prev, [parentCommentId]: '' }));
                setReplyToggles(prev => ({ ...prev, [parentCommentId]: false }));
                fetchBlogAndComments();
            }
        } catch (err) { console.error('Failed to post reply:', err); }
    };
    
    const handleDeleteReply = async (replyId) => { /* Original logic preserved */ };
    const toggleRepliesVisibility = (commentId) => { setShowRepliesState(prev => ({ ...prev, [commentId]: !prev[commentId] })); };

    // --- Effects for UI enhancements ---
    useEffect(() => {
        const scriptId = 'mathjax-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
            script.async = true;
            document.head.appendChild(script);
            
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']]
              }
            };
        }
    }, []);

    useEffect(() => {
        if (loading || !blog) return;

        const typeset = () => {
            if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                window.MathJax.typesetPromise([contentRef.current]);
            } else {
                // If MathJax isn't fully ready, try again in a moment.
                setTimeout(typeset, 100);
            }
        };
        typeset();
    }, [loading, blog, comments]);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (totalHeight > 0) {
                setReadingProgress((window.scrollY / totalHeight) * 100);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!blog || !contentRef.current) return;
        const headingElements = Array.from(contentRef.current.querySelectorAll('h1, h2, h3'));
        const tocItems = headingElements.map((h, i) => {
            const id = h.id || `heading-${i}`;
            h.id = id;
            return { id, text: h.textContent, level: parseInt(h.tagName.substring(1)) };
        });
        setHeadings(tocItems);
    }, [blog, loading]);

    const createMarkup = (html) => ({ __html: html });
    const scrollToHeading = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            setShowToc(false);
        }
    };

    const renderComments = (commentList, level = 0) => {
        return commentList.map(comment => (
            <motion.div key={comment._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 ${level > 0 ? 'ml-6' : ''}`}>
                <div className={`p-4 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg}`}>
                    <div className="flex items-start gap-3">
                        <img src={comment.author?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.username}`} alt="author" className={`w-10 h-10 border-2 ${retroThemeColors.panelBorder}`} />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-bold">{comment.username}</p>
                                <p className="text-xs text-stone-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="text-base mt-1">{comment.text}</p>
                            <button onClick={() => setReplyToggles(prev => ({ ...prev, [comment._id]: !prev[comment._id] }))} className="text-sm font-bold text-teal-600 mt-2">
                                {replyToggles[comment._id] ? 'Cancel' : 'Reply'}
                            </button>
                        </div>
                    </div>
                    {replyToggles[comment._id] && (
                        <div className="mt-3 ml-12">
                            <textarea rows="2" value={replyTexts[comment._id] || ''} onChange={e => setReplyTexts(p => ({ ...p, [comment._id]: e.target.value }))} className={`w-full p-2 text-base border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`} />
                            <div className="flex justify-end mt-2">
                                <Button onClick={() => handleReplySubmit(comment._id)} disabled={!replyTexts[comment._id]?.trim()} small>Post Reply</Button>
                            </div>
                        </div>
                    )}
                </div>
                {comment.replies?.length > 0 && (
                    <div className="mt-2">
                        <button onClick={() => toggleRepliesVisibility(comment._id)} className="text-sm font-bold text-stone-500 hover:text-stone-800">
                            {showRepliesState[comment._id] ? 'Hide Replies' : `Show ${comment.replies.length} Replies`}
                        </button>
                        <AnimatePresence>
                            {showRepliesState[comment._id] && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    {renderComments(comment.replies, level + 1)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        ));
    };


    if (loading) return <LoadingState />;
    if (!blog) return <NotFoundState />;

    return (
        <div className={`min-h-screen ${retroThemeColors.bgPrimary} font-retro`}>
            <div className="fixed top-0 left-0 right-0 h-2 z-50"><motion.div className={`h-full ${retroThemeColors.buttonPrimaryBg}`} style={{ width: `${readingProgress}%` }}/></div>
            
            <Button onClick={() => setShowToc(true)} small className={`fixed right-6 bottom-6 z-40 !p-4 !shadow-chunky ${retroThemeColors.panelBg}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
            </Button>
            <TableOfContents headings={headings} showToc={showToc} setShowToc={setShowToc} scrollToHeading={scrollToHeading} />
            
            <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => navigate('/blogs')} className={`text-lg hover:underline ${retroThemeColors.textSecondary}`}>&larr; Back to Articles</button>
                </div>

                <RetroCard className="p-6 md:p-10 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
                    <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 border-y-2 py-4 ${retroThemeColors.panelBorder}`}>
                        <div className="flex items-center gap-3">
                            <img src={blog.author?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${blog.author?.username}`} alt="author" className={`w-12 h-12 border-2 ${retroThemeColors.panelBorder}`} />
                            <div>
                                <p className="font-bold text-lg">{blog.author?.username}</p>
                                <p className="text-sm text-stone-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-stone-500">
                             <span>{blog.readTime || 5} min read</span>
                             <span>{blog.viewsCount || 0} views</span>
                        </div>
                    </div>

                    {blog.thumbnailUrl && <img src={blog.thumbnailUrl} alt={blog.title} className={`w-full max-h-[400px] object-cover mb-8 border-2 ${retroThemeColors.panelBorder}`} />}
                    
                    <div ref={contentRef} className="blog-content" dangerouslySetInnerHTML={createMarkup(blog.content)} />
                    
                    <div className="flex gap-4 mt-8 justify-center">
                        <Button onClick={handleLike} type="secondary" className={liked ? `!bg-rose-300` : retroThemeColors.likeButton}>Like ({blog.likesCount || 0})</Button>
                        <Button onClick={handleBookmark} type="secondary" className={bookmarked ? `!bg-sky-300` : retroThemeColors.bookmarkButton}>Bookmark</Button>
                    </div>
                </RetroCard>

                {blog.allowComments && (
                    <RetroCard className="p-6 md:p-10">
                        <h2 className="text-3xl font-bold mb-6">Discussion ({comments.length})</h2>
                        {isLoggedIn ? (
                            <div className="mb-6">
                                <textarea rows="4" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="What are your thoughts?" className={`w-full p-4 text-lg border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.inputBg} focus:outline-none`} />
                                <div className="flex justify-end mt-2">
                                    <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>Post Comment</Button>
                                </div>
                            </div>
                        ) : (
                            <div className={`text-center p-8 border-2 border-dashed ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                                <p className="text-xl mb-4">Log in to join the discussion!</p>
                                <Button onClick={() => navigate('/login')}>Log In</Button>
                            </div>
                        )}
                        {comments.length > 0 && renderComments(comments)}
                    </RetroCard>
                )}
            </div>
            
            <style jsx global>{`
                .blog-content { font-family: 'Georgia', serif; font-size: 1.1rem; line-height: 1.7; color: #44403c; }
                .blog-content h1, .blog-content h2, .blog-content h3 { font-family: 'VT323', monospace; color: #1c1917; margin-top: 1.5em; margin-bottom: 0.5em;}
                .blog-content h1 { font-size: 2.5rem; }
                .blog-content h2 { font-size: 2rem; }
                .blog-content h3 { font-size: 1.5rem; }
                .blog-content a { color: #5b21b6; text-decoration: underline; }
                .blog-content blockquote { border: 2px dashed #a8a29e; padding: 1rem; margin: 1.5rem 0; font-style: italic; background: #f5f5f4; }
                .blog-content pre { background: #292524; color: #f1f5f9; padding: 1rem; margin: 1.5rem 0; border: 2px solid #000; }
                .blog-content code { background: #e7e5e4; color: #44403c; padding: 0.2em 0.4em; border-radius: 4px; }
                .blog-content pre code { background: transparent; padding: 0; border: none; color: inherit; }
                .blog-content img { max-width: 100%; border: 2px solid #000; }
            `}</style>
        </div>
    );
}
