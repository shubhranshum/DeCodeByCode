const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

// Public Routes - Blog
router.get('/blogs', blogController.getAllBlogs);
router.get('/blog/:id', blogController.getBlogById);
router.get('/blogs/:username', blogController.getAllBlogsByUserName);
// router.get('/blog/')

router.get('/blog/slug/:slug', blogController.getBlogBySlug);


router.get('/blog/comments/:blogId', auth, commentController.getComments);

// Protected Routes - Blog Management


router.post('/create-blog', auth, blogController.createBlog);
router.put('/update-blog/:id', auth, blogController.updateBlog);
router.delete('/blog/:id', auth, blogController.deleteBlog);

// Public Routes - Blog Interactions (no auth required for likes/views)
router.post('/blog/:id/like', auth, blogController.likeBlog);
router.get('/blog/:id/like', auth,blogController.getIfLiked);

router.post('/blog/:id/view', auth,blogController.viewBlog);

// Protected Routes - Comment Management (using new nested comment controller)
router.post('/blog/:blogId', auth, commentController.addComment);
router.post('/blog/:blogId/reply', auth, commentController.addReply);
router.delete('/comment/:commentId', auth, commentController.deleteComment);
 


//getting featured blogs from home page 
router.get('/featured-blogs', blogController.getFeaturedBlogs);


// Optional: Keep old comment route for backward compatibility (if needed)
// router.post('/blog/:blogId/comment', auth, blogController.createComment);

module.exports = router;