import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTheme, setTheme as setGlobalTheme } from '../../utils/theme';

// --- Helper for class names ---
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// --- ThemeToggle component (Enhanced) ---
const ThemeToggle = ({ theme, toggleTheme }) => (
    <motion.button
        onClick={toggleTheme}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 shadow-md hover:shadow-lg transition-colors duration-200"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme"
    >
        {theme === 'light' ? (
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.816 5.485a.75.75 0 01.077 1.05l-1.144 1.143a.75.75 0 11-1.061-1.061l1.143-1.144a.75.75 0 011.05-.077zm-14.162 1.144a.75.75 0 011.061-1.061l1.143 1.144a.75.75 0 01-1.061 1.061L4.654 6.629zm13.137 13.137a.75.75 0 01-1.061-1.061l1.144-1.143a.75.75 0 011.05.077l-1.132 1.132zM5.385 18.816a.75.75 0 01-1.05-.077l-1.143-1.144a.75.75 0 011.061-1.03l1.144 1.143a.75.75 0 01-.078 1.05zM12 18.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM15 12a3 3 0 11-6 0 3 3 0 016 0zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zM20.25 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V2.468a.75.75 0 01.75-.75zm4.943 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V2.468a.75.75 0 01.75-.75zm-9.358 4.298a.75.75 0 01.057 1.056l-1.13 1.096a.75.75 0 11-1.061-1.03l1.13-1.096a.75.75 0 011.004-.026zm1.143 13.893a.75.75 0 01-1.004-.026l-1.13-1.096a.75.75 0 011.061-1.03l1.13 1.096a.75.75 0 01-.057 1.056zm9.358-14.195a.75.75 0 01-.057-1.056l1.13-1.096a.75.75 0 011.061 1.03l-1.13 1.096a.75.75 0 01-1.004.026zm-1.143 13.893a.75.75 0 011.004.026l1.13 1.096a.75.75 0 01-1.061 1.03l-1.13-1.096a.75.75 0 01.057-1.056zM12 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM2.336 10.72a.75.75 0 01-.585-.743.75.75 0 01.722-.806l1.5-.205a.75.75 0 01.118 1.493l-1.5.205a.75.75 0 01-.255-.74zm19.328 0a.75.75 0 01-.255.74l-1.5.205a.75.75 0 01.118-1.493l1.5-.205a.75.75 0 01.722.806zm-12 2.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
        )}
    </motion.button>
);

// AuthorProfile component (Enhanced)
const AuthorProfile = ({ author, navigate, blog, theme }) => {
    const isDark = theme === 'dark';
    // Use DiceBear for consistent and appealing avatars
    const profilePicture = author?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${author?.username || 'Anonymous'}`; 

    return (
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <img
                    src={profilePicture}
                    alt={author?.username || 'Anonymous'}
                    className={`w-12 h-12 rounded-full object-cover ring-2 ${isDark ? 'ring-indigo-600' : 'ring-purple-400'}`}
                />
            </div>
            <div className="ml-4">
                <a 
                    onClick={(e) => {
                        e.preventDefault();
                        if (author?.username) {
                            navigate(`/profile/u/${author.username}`);
                        } else {
                            navigate('/blog'); // Fallback for anonymous
                        }
                    }}
                    className={`font-semibold text-lg hover:underline cursor-pointer transition-colors ${isDark ? 'text-gray-100 hover:text-indigo-400' : 'text-slate-800 hover:text-indigo-600'}`}
                >
                    {author?.username || 'Anonymous Author'}
                </a>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </p>
            </div>
        </div>
    );
};

// TableOfContents component (Enhanced with dynamic styling and active heading logic)
const TableOfContents = ({ headings, showToc, setShowToc, scrollToHeading, theme }) => {
    const isDark = theme === 'dark';
    const activeLinkColor = isDark ? 'text-indigo-400 font-bold' : 'text-indigo-700 font-bold';
    const linkColor = isDark ? 'text-gray-300 hover:text-indigo-300' : 'text-slate-700 hover:text-indigo-600';
    const closeButtonColor = isDark ? 'text-gray-400 hover:text-gray-100' : 'text-slate-500 hover:text-slate-700';

    const [activeHeadingId, setActiveHeadingId] = useState('');

    // Highlight active heading on scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveHeadingId(entry.target.id);
                }
            });
        }, {
            rootMargin: '-10% 0px -80% 0px', // Adjust active heading when it's ~10% from top
        });

        headings.forEach(heading => {
            const el = document.getElementById(heading.id);
            if (el) {
                observer.observe(el);
            }
        });

        return () => observer.disconnect();
    }, [headings]);


    return (
        <AnimatePresence>
            {showToc && (
                <motion.div 
                    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowToc(false)}
                >
                    <motion.div 
                        className={`w-full max-w-xs h-full overflow-y-auto p-6 md:p-8 shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>Table of Contents</h3>
                            <button 
                                onClick={() => setShowToc(false)}
                                className={`${closeButtonColor} transition-colors p-1 rounded-md`}
                                aria-label="Close Table of Contents"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <ul className="space-y-3">
                            {headings.map((heading) => (
                                <li key={heading.id} className="relative">
                                    <a 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToHeading(heading.id);
                                        }}
                                        className={classNames(
                                            'block py-2 rounded-md transition-colors text-ellipsis overflow-hidden whitespace-nowrap',
                                            activeHeadingId === heading.id ? activeLinkColor : linkColor,
                                            heading.level === 1 ? 'font-bold text-lg' : 
                                            heading.level === 2 ? 'font-medium text-base ml-2' : 
                                            heading.level >= 3 ? 'text-sm ml-4' : ''
                                        )}
                                    >
                                        {heading.text}
                                    </a>
                                    {activeHeadingId === heading.id && (
                                        <motion.div 
                                            className={`absolute left-0 top-0 h-full w-1 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`}
                                            layoutId="activeTocIndicator"
                                            transition={{ type: "spring", stiffness: 500, damping: 50 }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const BlogDetails = () => {
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
    const [imageError, setImageError] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [theme, setTheme] = useState(getTheme);
    const [readingProgress, setReadingProgress] = useState(0);
    const [showToc, setShowToc] = useState(false);
    const [headings, setHeadings] = useState([]);
    const contentRef = useRef(null);

    // State to manage visibility of replies for each comment
    const [showRepliesState, setShowRepliesState] = useState({});

    // Toggle theme function
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setGlobalTheme(newTheme);
    }, [theme]);

    // Apply theme on initial load and whenever it changes
    useEffect(() => {
        const savedTheme = getTheme();
        setTheme(savedTheme);
        document.documentElement.classList.toggle('light', savedTheme === 'light');
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, [theme]);

    // Check if user is logged in
    const checkLoginStatus = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/check/auth', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setIsLoggedIn(data.isAuthenticated);
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            console.error('Failed to check login status:', err);
            setIsLoggedIn(false);
        }
    }, []);

    const fetchBlogAndComments = useCallback(async () => {
        setLoading(true);
        try {
            const [blogRes, commentRes] = await Promise.all([
                fetch(`http://localhost:3000/blog/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                }),
                fetch(`http://localhost:3000/blog/comments/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                })
            ]);

            if (!blogRes.ok) {
                setBlog(null);
                setLoading(false);
                return;
            }

            const blogData = await blogRes.json();
            setBlog(blogData);
            
            const commentData = await commentRes.json();
            setComments(Array.isArray(commentData) ? commentData : []);
            
            checkIfLiked(blogData._id); 
            checkIfBookmarked(blogData._id);
        } catch (err) {
            console.error('Failed to load blog or comments:', err);
            setBlog(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        checkLoginStatus();
        fetchBlogAndComments();
    }, [id, checkLoginStatus, fetchBlogAndComments]);
    
    // Extract headings for table of contents
    useEffect(() => {
        if (blog && contentRef.current) {
            const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            
            const tocItems = headings.map((heading, index) => {
                if (!heading.id) {
                    heading.id = `section-${index}-${heading.textContent.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
                }
                return {
                    id: heading.id,
                    text: heading.textContent,
                    level: parseInt(heading.tagName.substring(1), 10)
                };
            });
            setHeadings(tocItems);
        }
    }, [blog, loading]);

    // Handle HTML content rendering safely
    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
    };
    
    // Handle scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (documentHeight === 0) {
                setReadingProgress(0);
                return;
            }
            const progress = (window.scrollY / documentHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Add copy buttons to code blocks
    useEffect(() => {
        if (!blog || !contentRef.current) return;

        contentRef.current.querySelectorAll('.copy-btn-wrapper').forEach(wrapper => wrapper.remove());

        const codeBlocks = contentRef.current.querySelectorAll('pre');
        codeBlocks.forEach(block => {
            const wrapper = document.createElement('div');
            wrapper.className = 'relative copy-btn-wrapper';
            
            block.parentNode.insertBefore(wrapper, block);
            wrapper.appendChild(block);
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn absolute top-2 right-2 bg-gray-600/70 text-white rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200';
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="copy-icon h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span class="copy-tooltip">Copy</span>
            `;
            
            copyBtn.addEventListener('click', () => {
                const code = block.querySelector('code') || block;
                navigator.clipboard.writeText(code.textContent || '');
                
                const tooltip = copyBtn.querySelector('.copy-tooltip');
                if (tooltip) {
                    tooltip.textContent = 'Copied!';
                    setTimeout(() => {
                        tooltip.textContent = 'Copy';
                    }, 2000);
                }
            });
            
            wrapper.appendChild(copyBtn);
            wrapper.classList.add('group');
        });
    }, [blog]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newComment }),
            });
            if (res.ok) {
                setNewComment('');
                fetchBlogAndComments();
            } else {
                console.error('Failed to post comment, status:', res.status);
            }
        } catch (err) {
            console.error('Failed to post comment:', err);
        }
    };

    const handleReplySubmit = async (parentCommentId) => {
        const replyText = replyTexts[parentCommentId];
        if (!replyText?.trim()) return;

        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/reply`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: replyText, parentCommentId }),
            });
            if (res.ok) {
                setReplyTexts(prev => ({ ...prev, [parentCommentId]: '' }));
                setReplyToggles(prev => ({ ...prev, [parentCommentId]: false }));
                fetchBlogAndComments();
            } else {
                console.error('Failed to post reply, status:', res.status);
            }
        } catch (err) {
            console.error('Failed to post reply:', err);
        }
    };

    const handleDeleteReply = useCallback(async (replyId) => {
        if (!window.confirm("Are you sure you want to delete this reply?")) {
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/blog/comment/${replyId}`, { // Assuming an endpoint like /blog/comment/:id for deleting comments/replies
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                fetchBlogAndComments(); // Re-fetch comments to update UI
            } else {
                const errorData = await res.json();
                console.error('Failed to delete reply:', errorData.message);
                alert(`Failed to delete reply: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Network error deleting reply:', err);
            alert('Network error. Could not delete reply.');
        }
    }, [fetchBlogAndComments]);


    const checkIfLiked = useCallback(async() => {
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/like`, {
                method: 'GET',
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setLiked(data.liked);
            }
        } catch (err) {
            console.error('Failed to check if liked', err);
        }
    }, [id]);

    const checkIfBookmarked = useCallback(async() => {
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/bookmarkStatus`, {
                method: 'GET',
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setBookmarked(data.bookmarked);
            }
        } catch (err) {
            console.error('Failed to check if bookmarked', err);
        }
    }, [id]);

    const handleLike = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/like`, {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                setLiked(prev => !prev);
                setBlog(prev => ({
                    ...prev,
                    likesCount: liked ? prev.likesCount - 1 : prev.likesCount + 1
                }));
            }
        } catch (err) {
            console.error('Failed to like blog', err);
        }
    };

    const handleBookmark = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/blog/${id}/bookmark`, {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                setBookmarked(prev => !prev);
            }
        } catch (err) {
            console.error('Failed to bookmark blog', err);
        }
    };

    const scrollToHeading = (headingId) => {
        const element = document.getElementById(headingId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - headerOffset,
                behavior: 'smooth'
            });
            setShowToc(false);
        }
    };

    const toggleRepliesVisibility = useCallback((commentId) => {
        setShowRepliesState(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    }, []);

    const renderComments = (commentList, level = 0) => {
        const isDark = theme === 'dark';
        const commentBgColor = isDark ? 'bg-gray-700/30' : 'bg-slate-50';
        const commentBorderColor = isDark ? 'border-gray-700' : 'border-slate-200';
        const authorNameColor = isDark ? 'text-gray-100' : 'text-slate-800';
        const timeColor = isDark ? 'text-gray-400' : 'text-slate-500';
        const textColor = isDark ? 'text-gray-300' : 'text-slate-700';
        const replyBtnColor = isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800';
        const inputBg = isDark ? 'bg-gray-800' : 'bg-white';
        const inputBorder = isDark ? 'border-gray-700' : 'border-slate-300';
        const inputTextColor = isDark ? 'text-gray-300' : 'text-slate-700';
        const inputPlaceholderColor = isDark ? 'placeholder:text-gray-500' : 'placeholder:text-slate-400';
        const inputFocusRing = isDark ? 'focus:ring-indigo-600' : 'focus:ring-indigo-300';
        const submitBtnBg = isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700';
        const submitBtnText = 'text-white';
        const submitBtnDisabledBg = isDark ? 'bg-gray-700' : 'bg-slate-200';
        const submitBtnDisabledText = isDark ? 'text-gray-400' : 'text-slate-500';
        const deleteBtnColor = isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800';

        return commentList.map(comment => (
            <motion.div
                key={comment._id}
                className={classNames(
                    'mt-6 p-4 rounded-lg',
                    commentBgColor,
                    level > 0 ? `ml-6 md:ml-8 ${commentBorderColor} border-l` : ''
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-start gap-4">
                    <div className={classNames(
                        `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`,
                        isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'
                    )}>
                        <span className={classNames(
                            `font-medium text-lg`,
                            isDark ? 'text-indigo-300' : 'text-indigo-700'
                        )}>
                            {(comment.username || 'A').charAt(0).toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="mb-1 flex justify-between items-center">
                            <span className={`font-semibold ${authorNameColor}`}>
                                {comment.username || 'Anonymous'}
                            </span>
                            <span className={`text-xs ${timeColor}`}>
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        
                        <p className={`${textColor} mb-3`}>{comment.text}</p>
                        
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    if (!isLoggedIn) {
                                        navigate('/login');
                                        return;
                                    }
                                    setReplyToggles(prev => ({
                                        ...prev,
                                        [comment._id]: !prev[comment._id],
                                    }))
                                }}
                                className={`text-sm ${replyBtnColor} font-medium flex items-center gap-1 transition-colors`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                {replyToggles[comment._id] ? 'Cancel' : 'Reply'}
                            </button>

                            {level > 0 && isLoggedIn && ( // Only show delete button for replies and if logged in
                                <button
                                    onClick={() => handleDeleteReply(comment._id)}
                                    className={`text-sm ${deleteBtnColor} font-medium flex items-center gap-1 transition-colors`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            )}
                        </div>

                        {replyToggles[comment._id] && isLoggedIn && (
                            <motion.div 
                                className="mt-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                            >
                                <textarea
                                    rows="2"
                                    value={replyTexts[comment._id] || ''}
                                    onChange={e => setReplyTexts(prev => ({
                                        ...prev,
                                        [comment._id]: e.target.value,
                                    }))}
                                    className={`w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${inputBg} ${inputBorder} ${inputTextColor} ${inputPlaceholderColor} ${inputFocusRing}`}
                                    placeholder="Write your reply..."
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => handleReplySubmit(comment._id)}
                                        disabled={!replyTexts[comment._id]?.trim()}
                                        className={classNames(
                                            `px-6 py-2 rounded-lg text-sm font-medium transition-colors`,
                                            replyTexts[comment._id]?.trim() ? `${submitBtnBg} ${submitBtnText}` : `${submitBtnDisabledBg} ${submitBtnDisabledText}`
                                        )}
                                    >
                                        Post Reply
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {comment.replies?.length > 0 && (
                    <div className="mt-4">
                        <button
                            onClick={() => toggleRepliesVisibility(comment._id)}
                            className={`text-sm font-medium ${replyBtnColor} flex items-center gap-1 transition-colors ml-14`} // Align with comment content
                        >
                            {showRepliesState[comment._id] ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Hide {comment.replies.length} Replies
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
                                    </svg>
                                    Show {comment.replies.length} Replies
                                </>
                            )}
                        </button>
                        <AnimatePresence>
                            {showRepliesState[comment._id] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderComments(comment.replies, level + 1)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        ));
    };

    const isDark = theme === 'dark';

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
                <div className={`w-16 h-16 border-4 rounded-full animate-spin ${isDark ? 'border-indigo-500 border-t-transparent' : 'border-purple-600 border-t-transparent'}`}></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center px-4 text-center ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
                <div className={`rounded-full p-4 mb-6 ${isDark ? 'bg-gray-800' : 'bg-slate-100'}`}>
                    <svg className={`w-16 h-16 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>Article Not Found</h2>
                <p className={`text-lg mb-8 max-w-md ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    The article you're looking for doesn't exist or may have been removed.
                </p>
                <button
                    onClick={() => navigate('/blog')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                >
                    Browse All Articles
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-slate-50'} transition-colors duration-200 relative`}>
            {/* Reading progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 z-50">
                <motion.div 
                    className={`h-full ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                    style={{ width: `${readingProgress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>
            
            {/* Floating TOC button */}
            <button
                onClick={() => setShowToc(true)}
                className={`fixed right-6 bottom-6 md:right-8 md:bottom-8 p-3 md:p-4 rounded-full shadow-xl z-40 transition-colors duration-200 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-white hover:bg-slate-100 text-slate-700'}`}
                aria-label="Table of Contents"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            {/* Table of Contents Overlay */}
            <TableOfContents 
                headings={headings} 
                showToc={showToc} 
                setShowToc={setShowToc} 
                scrollToHeading={scrollToHeading} 
                theme={theme}
            />
            
            <div className="pt-20 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
                {/* Top bar with back button and theme toggle */}
                <div className="flex justify-between items-center mb-10">
                    <button
                        onClick={() => navigate('/blog')}
                        className={`flex items-center text-lg font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-gray-100' : 'text-slate-600 hover:text-slate-800'}`}
                    >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to articles
                    </button>
                    
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>

                {/* Blog Content Section */}
                <motion.article 
                    className={`rounded-2xl shadow-xl p-6 md:p-10 mb-12 transition-colors duration-200 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags?.map(tag => (
                            <span 
                                key={tag} 
                                className={`text-sm px-4 py-1.5 rounded-full font-medium ${isDark ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>
                        {blog.title}
                    </h1>
                    
                    {/* Featured Image */}
                    {blog.thumbnailUrl && !imageError ? (
                        <motion.div 
                            className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <img 
                                src={blog.thumbnailUrl} 
                                alt={blog.title} 
                                className="w-full h-auto max-h-[500px] object-cover"
                                onError={() => setImageError(true)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div 
                            className={`mb-8 border-2 border-dashed rounded-xl w-full h-64 flex flex-col items-center justify-center text-center ${isDark ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-slate-100 border-slate-300 text-slate-500'}`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-lg">Featured image not available</span>
                        </motion.div>
                    )}
                    
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                        <AuthorProfile author={blog.author} navigate={navigate} blog={blog} theme={theme} />
                        
                        <div className="flex items-center gap-6">
                            <div className={`flex items-center text-base ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{blog.readTime || 5} min read</span>
                            </div>
                            
                            <div className={`flex items-center text-base ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{blog.viewsCount || 0} views</span>
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        ref={contentRef}
                        className="blog-content prose max-w-none mb-8"
                        dangerouslySetInnerHTML={createMarkup(blog.content)}
                    />
                    
                    <div className="flex gap-4 mb-8 justify-center">
                        <motion.button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${liked ? (isDark ? 'bg-red-500 text-white' : 'bg-red-500 text-white') : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className={`w-5 h-5 ${liked ? 'fill-current' : 'stroke-current'}`} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{blog.likesCount || 0} {blog.likesCount === 1 ? 'Like' : 'Likes'}</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={handleBookmark}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${bookmarked ? (isDark ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white') : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className={`w-5 h-5 ${bookmarked ? 'fill-current' : 'stroke-current'}`} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                        </motion.button>
                    </div>
                    
                    <div className="border-t border-slate-200 dark:border-gray-700 pt-8">
                        <div className="flex flex-wrap gap-2">
                            {blog.tags?.map(tag => (
                                <span 
                                    key={tag} 
                                    className={`text-sm px-4 py-1.5 rounded-full font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-700'}`}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.article>

                {/* Comment Section */}
                {blog.allowComments && (
                    <motion.section 
                        className={`rounded-2xl shadow-xl p-6 md:p-10 transition-colors duration-200 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>
                                Discussion ({comments.length})
                            </h2>
                            <div className={`text-base ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                {comments.length === 0 ? 'Be the first to comment' : 'Join the conversation'}
                            </div>
                        </div>

                        {/* New Top-Level Comment */}
                        <div className="mb-8">
                            {isLoggedIn ? (
                                <>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                                            <span className={`text-lg font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                                U {/* Placeholder for user initial/avatar */}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                rows="4"
                                                value={newComment}
                                                onChange={e => setNewComment(e.target.value)}
                                                placeholder="What are your thoughts?"
                                                className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-500 focus:ring-indigo-600' : 'bg-white border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-indigo-300'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <motion.button
                                            onClick={handleCommentSubmit}
                                            disabled={!newComment.trim()}
                                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${newComment.trim() ? (isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md') : (isDark ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-slate-200 text-slate-500 cursor-not-allowed')}`}
                                            whileHover={newComment.trim() ? { scale: 1.05 } : {}}
                                            whileTap={newComment.trim() ? { scale: 0.95 } : {}}
                                        >
                                            Post Comment
                                        </motion.button>
                                    </div>
                                </>
                            ) : (
                                <div className={`border rounded-xl p-8 text-center ${isDark ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-100'}`}>
                                    <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className={`text-xl font-medium mb-3 ${isDark ? 'text-gray-100' : 'text-slate-800'}`}>
                                        Join the discussion
                                    </h3>
                                    <p className={`mb-6 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                                        Please log in to leave a comment and participate in the conversation.
                                    </p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className={`px-8 py-3 rounded-xl font-medium transition-colors shadow-md ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                                    >
                                        Log In Now
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Comments Tree */}
                        <div className={comments.length > 0 ? `border-t ${isDark ? 'border-gray-700' : 'border-slate-200'} pt-8` : ''}>
                            {comments.length > 0 ? (
                                renderComments(comments)
                            ) : isLoggedIn ? (
                                <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                    <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-xl font-medium">No comments yet.</p>
                                    <p className="mt-2">Be the first to share your thoughts!</p>
                                </div>
                            ) : null}
                        </div>
                    </motion.section>
                )}
            </div>
            
            {/* Custom CSS for TinyMCE content */}
            <style jsx global>{`
                /* General Prose Styling */
                .blog-content {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.8;
                    font-size: 1.15rem; /* Slightly larger base font */
                }
                
                /* Headings */
                .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6 {
                    scroll-margin-top: 100px; /* Offset for fixed header */
                    font-weight: 700;
                    margin-top: 2.5rem; /* Adjusted margin-top for headings */
                    margin-bottom: 1.2rem; /* Adjusted margin-bottom for headings */
                    line-height: 1.3;
                }
                .blog-content h1 { font-size: 2.8rem; color: #1a202c; }
                .blog-content h2 { font-size: 2.2rem; color: #1a202c; }
                .blog-content h3 { font-size: 1.8rem; color: #1a202c; }
                .blog-content h4 { font-size: 1.5rem; color: #1a202c; }
                .blog-content h5 { font-size: 1.25rem; color: #1a202c; }
                .blog-content h6 { font-size: 1rem; color: #1a202c; }

                .dark .blog-content h1, .dark .blog-content h2, .dark .blog-content h3, .dark .blog-content h4, .dark .blog-content h5, .dark .blog-content h6 { 
                    color: #f8fafc; 
                }

                /* Paragraphs */
                .blog-content p { 
                    margin-bottom: 1.5rem; 
                    color: #374151; 
                }
                .dark .blog-content p { 
                    color: #d1d5db; 
                }

                /* Links */
                .blog-content a {
                    color: #4f46e5;
                    text-decoration: underline;
                    text-underline-offset: 4px;
                    transition: all 0.2s ease-in-out;
                }
                .dark .blog-content a { color: #818cf8; }
                .blog-content a:hover { color: #3730a3; text-decoration-color: #4f46e5; }
                .dark .blog-content a:hover { color: #a5b4fc; }

                /* Lists */
                .blog-content ul, .blog-content ol { 
                    margin-left: 2rem; 
                    margin-bottom: 1.5rem; 
                    list-style-position: outside;
                }
                .blog-content ul { list-style-type: disc; }
                .blog-content ol { list-style-type: decimal; }
                .blog-content li { margin-bottom: 0.75rem; }

                /* Blockquotes */
                .blog-content blockquote {
                    border-left: 5px solid #818cf8;
                    padding-left: 1.5rem;
                    margin: 2rem 0;
                    color: #4b5563;
                    font-style: italic;
                    background-color: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                }
                .dark .blog-content blockquote {
                    color: #9ca3af;
                    border-left-color: #6366f1;
                    background-color: #1f2937;
                }
                
                /* Code Blocks (pre) */
                .blog-content pre {
                    background: #1f2937;
                    color: #e2e8f0;
                    padding: 1.8rem 1.5rem;
                    border-radius: 0.75rem;
                    overflow: auto;
                    margin: 2rem 0;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    border: 1px solid #334155;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    position: relative;
                }
                .dark .blog-content pre {
                    background: #0f172a;
                    border-color: #475569;
                }

                /* Inline Code */
                .blog-content code {
                    background: #eff6ff;
                    color: #1e3a8a;
                    padding: 0.3em 0.5em;
                    border-radius: 0.25rem;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.95em;
                    border: 1px solid #dbeafe;
                }
                .dark .blog-content code {
                    background: #1f2937;
                    color: #93c5fd;
                    border-color: #3b82f6;
                }
                .blog-content pre code {
                    background: transparent;
                    padding: 0;
                    border: none;
                    color: inherit;
                    font-size: 1em;
                }
                
                /* Images */
                .blog-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 2rem auto;
                    display: block;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease-out;
                }
                .blog-content img:hover {
                    transform: scale(1.01);
                }
                .dark .blog-content img {
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }

                /* Tables */
                .blog-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 2rem 0;
                    font-size: 0.95rem;
                }
                .blog-content th, .blog-content td {
                    border: 1px solid #e5e7eb;
                    padding: 1rem;
                    text-align: left;
                    vertical-align: top;
                }
                .dark .blog-content th, .dark .blog-content td {
                    border-color: #4b5563;
                }
                .blog-content th {
                    background-color: #f3f4f6;
                    font-weight: 700;
                    color: #374151;
                }
                .dark .blog-content th {
                    background-color: #1f2937;
                    color: #e5e7eb;
                }
                .blog-content tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                .dark .blog-content tr:nth-child(even) {
                    background-color: #111827;
                }

                /* Copy button styles */
                .blog-content pre .copy-btn {
                    top: 0.75rem;
                    right: 0.75rem;
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.375rem;
                    padding: 0.4rem 0.75rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    color: #f1f5f9;
                    transition: all 0.2s ease;
                    font-size: 0.85rem;
                }
                .blog-content pre .copy-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
                .blog-content pre .copy-icon {
                    width: 1.1rem;
                    height: 1.1rem;
                    margin-right: 0.4rem;
                    stroke-width: 2;
                }
                .blog-content pre .copy-tooltip {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </div>
    );
};

export default BlogDetails;