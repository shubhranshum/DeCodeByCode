const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

// Public Routes - Blog
router.get('/blogs', blogController.getAllBlogs);
router.get('/blog/:id', blogController.getBlogById);

router.get('/blog/slug/:slug', blogController.getBlogBySlug);

// Public Routes - Comments (using new nested comment controller)
router.get('/blog/comments/:blogId', commentController.getComments);

// Protected Routes - Blog Management
router.post('/create-blog', auth, blogController.createBlog);
router.put('/update-blog/:id', auth, blogController.updateBlog);
// router.put('/blog/:id', auth, blogController.createBlog);
router.delete('/blog/:id', auth, blogController.deleteBlog);

// Public Routes - Blog Interactions (no auth required for likes/views)
router.post('/blog/:id/like', blogController.likeBlog);
router.post('/blog/:id/view', blogController.viewBlog);

// Protected Routes - Comment Management (using new nested comment controller)
router.post('/blog/:blogId', auth, commentController.addComment);
router.post('/blog/:blogId/reply', auth, commentController.addReply);
router.delete('/comment/:commentId', auth, commentController.deleteComment);



// Optional: Keep old comment route for backward compatibility (if needed)
// router.post('/blog/:blogId/comment', auth, blogController.createComment);

module.exports = router;