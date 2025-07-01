const Comment = require('../models/Comments');
const BlogPost = require('../models/blogPost');
const { logActivity } = require('./activityController');

// Get all comments for a blog post (with nested structure)
const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    // First, get all comments for this blog post
    const allComments = await Comment.find({ blog: blogId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    // Build nested structure
    const commentMap = new Map();
    const topLevelComments = [];

    // First pass: create map of all comments
    allComments.forEach(comment => {
      commentMap.set(comment._id.toString(), {
        _id: comment._id,
        text: comment.text,
        username: comment.user?.username || 'Anonymous',
        createdAt: comment.createdAt,
        parentComment: comment.parentComment,
        replies: []
      });
    });

    // Second pass: build nested structure
    allComments.forEach(comment => {
      const commentObj = commentMap.get(comment._id.toString());
      
      if (comment.parentComment) {
        // This is a reply, add it to parent's replies
        const parent = commentMap.get(comment.parentComment.toString());
        if (parent) {
          parent.replies.push(commentObj);
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(commentObj);
      }
    });

    // Sort replies by creation date (oldest first for replies)
    topLevelComments.forEach(comment => {
      comment.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    res.json(topLevelComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text } = req.body;
    const userId = req.user.id; // Assuming you have auth middleware that sets req.user

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    // Verify blog post exists
    const blogPost = await BlogPost.findById(blogId);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if comments are allowed
    if (!blogPost.allowComments) {
      return res.status(403).json({ message: 'Comments are not allowed on this post' });
    }
    console.log(blogPost);
    const newComment = new Comment({
      blog: blogId,
      user: userId,
      text: text.trim(),
      parentComment: null // Top-level comment
    });
    // blogPost.commentCount += 1;
    // blogPost.save();

    await newComment.save();
    const blog = await BlogPost.findById(blogId);
    blog.commentCount += 1;
    blog.save();
    const log = await logActivity(userId, newComment._id,"Comment", "COMMENT_ADDED", "Comment on a blog with title : "+blogPost.title);
    console.log("Comment added successfully");
    
    
    res.status(201).json({ 
      message: 'Comment added successfully',
      commentId: newComment._id 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Add a reply to a comment
const addReply = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text, parentCommentId } = req.body;
    const userId = req.user.id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    if (!parentCommentId) {
      return res.status(400).json({ message: 'Parent comment ID is required' });
    }

    // Verify blog post exists and allows comments
    const blogPost = await BlogPost.findById(blogId);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (!blogPost.allowComments) {
      return res.status(403).json({ message: 'Comments are not allowed on this post' });
    }

    // Verify parent comment exists and belongs to this blog
    const parentComment = await Comment.findOne({ 
      _id: parentCommentId, 
      blog: blogId 
    });
    
    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    const newReply = new Comment({
      blog: blogId,
      user: userId,
      text: text.trim(),
      parentComment: parentCommentId
    });

    await newReply.save();
    
    res.status(201).json({ 
      message: 'Reply added successfully',
      replyId: newReply._id 
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Failed to add reply' });
  }
};

// Delete a comment (and all its replies)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Delete the comment and all its replies
    await Comment.deleteMany({
      $or: [
        { _id: commentId },
        { parentComment: commentId }
      ]
    });

    res.json({ message: 'Comment and replies deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = {
  getComments,
  addComment,
  addReply,
  deleteComment
};