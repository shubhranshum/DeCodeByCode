import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  const [imageError, setImageError] = useState(false); // Track image loading errors

  const fetchBlogAndComments = async () => {
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

      const blogData = await blogRes.json();
      setBlog(blogData);
      
      const commentData = await commentRes.json();
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (err) {
      console.error('Failed to load blog or comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogAndComments();
  }, [id]);

  // Handle HTML content rendering safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`http://localhost:3000/blog/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });
      setNewComment('');
      fetchBlogAndComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    const replyText = replyTexts[parentCommentId];
    if (!replyText?.trim()) return;

    try {
      await fetch(`http://localhost:3000/blog/${id}/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText, parentCommentId }),
      });

      setReplyTexts(prev => ({ ...prev, [parentCommentId]: '' }));
      setReplyToggles(prev => ({ ...prev, [parentCommentId]: false }));
      fetchBlogAndComments();
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/blog/${id}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        setLiked(!liked);
        setBlog(prev => ({
          ...prev,
          likesCount: liked ? prev.likesCount - 1 : prev.likesCount + 1
        }));
      }
    } catch (err) {
      console.error('Failed to like blog', err);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const renderComments = (commentList, level = 0) => {
    return commentList.map(comment => (
      <motion.div
        key={comment._id}
        className={`mt-4 ${level > 0 ? 'ml-8 pl-4 border-l border-slate-200' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-700 font-medium">
              {(comment.username || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="mb-1 flex justify-between">
              <div>
                <span className="font-medium text-slate-800">
                  {comment.username || 'Anonymous'}
                </span>
                <span className="ml-2 text-xs text-slate-500">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="text-slate-700 mb-3">{comment.text}</div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setReplyToggles(prev => ({
                  ...prev,
                  [comment._id]: !prev[comment._id],
                }))}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                {replyToggles[comment._id] ? 'Cancel' : 'Reply'}
              </button>
            </div>

            {replyToggles[comment._id] && (
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
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  placeholder="Write your reply..."
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Post Reply
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {comment.replies?.length > 0 && renderComments(comment.replies, level + 1)}
      </motion.div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-slate-100 rounded-full p-4 mb-6">
          <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          The article you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/blog')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Browse Articles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-8 font-medium"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to articles
        </button>

        {/* Blog Header */}
        <motion.article 
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-wrap gap-4 mb-6">
            {blog.tags?.map(tag => (
              <span 
                key={tag} 
                className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight">
            {blog.title}
          </h1>
          
          {/* Featured Image */}
          {blog.thumbnailUrl && !imageError ? (
            <motion.div 
              className="mb-6 rounded-xl overflow-hidden shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
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
              className="mb-6 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl w-full h-64 flex flex-col items-center justify-center text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Featured image not available</span>
            </motion.div>
          )}
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-medium">
                {blog.author?.username?.charAt(0) || 'A'}
              </div>
              <div className="ml-3">
                <p className="font-medium text-slate-800">{blog.author?.username || 'Anonymous'}</p>
                <p className="text-sm text-slate-500">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{blog.readTime || 5} min read</span>
              </div>
              
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{blog.viewsCount || 0} views</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium ${liked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <svg className={`w-5 h-5 ${liked ? 'fill-indigo-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likesCount || 0}</span>
            </button>
            
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium ${bookmarked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <svg className={`w-5 h-5 ${bookmarked ? 'fill-indigo-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
          
          {/* HTML Content Rendering */}
          <div 
            className="prose prose-lg max-w-none text-slate-700 mb-8"
            dangerouslySetInnerHTML={createMarkup(blog.content)}
          />
          
          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium"
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
            className="bg-white rounded-xl shadow-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Discussion ({comments.length})
              </h2>
              <div className="text-sm text-slate-500">
                {comments.length === 0 ? 'Be the first to comment' : 'Join the conversation'}
              </div>
            </div>

            {/* New Top-Level Comment */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-700 font-medium">Y</span>
                </div>
                <div className="flex-1">
                  <textarea
                    rows="3"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${newComment.trim() ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-500'}`}
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments Tree */}
            <div className={comments.length > 0 ? 'border-t border-slate-200 pt-6' : ''}>
              {comments.length > 0 ? (
                renderComments(comments)
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;