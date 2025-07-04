const Blog = require('../models/blogPost.js');
const Comment = require('../models/Comments.js');
const User = require('../models/user.js');
const UserProfile = require('../models/profile/userProfile.js');


 // or User if you're using that

const { param } = require('../routes/blog.js');
const { logActivity, getUserActivities, deleteUserActivities } = require('./activityController.js');

// Increment likesCount
// controllers/blogController.js (or similar)


exports.getBlogsByUserId = async (req, res) => {
  console.log("Hello from getBlogsByUserId");
  try {
    const userId = req.user._id;
    

    const blogs = await Blog.find({ author: userId });
    return res.json(blogs);

  } catch (err) {
    console.error('getBlogsByUserId error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    console.log("Hello from create blog")
    const { title, content, slug, summary, thumbnailUrl, tags, category, status, allowComments, isFeatured } = req.body;
    const author = req.user._id;

    // Ensure slug is provided and unique in frontend or DB schema
    const blog = new Blog({
      title,
      content,
      slug,
      summary,
      thumbnailUrl,
      tags,
      category,
      status,
      allowComments,
      isFeatured,
      author,
    });
    const user = await User.findOne({ _id: author });
    username = user.username;
    const savedBlog = await blog.save();
    const profile = await UserProfile.findOne({ username: username });
    if(blog.status=="Published")
    {
      profile.Blog.push(blog._id);
    }
    if(blog.status=="Draft")
    {
      profile.DraftBlogs.push(blog._id);
    }
    if(blog.status=="Archived")
    {
      profile.ArchivedBlogs.push(blog._id);
    }
    if(blog.status == "Published")
    {
      profile.stats.blogCount += 1;
    }
    await profile.save();
    
    await logActivity(author, savedBlog._id,"BlogPost", "BLOG_POSTED", savedBlog.title);

    
    

    
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Error saving blog:', err);
    res.status(500).json({ error: err.message });
  }
};


// Get all blog posts
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username email');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
    
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username email');
        console.log(blog);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, slug, summary, thumbnailUrl, tags, category, status, allowComments, isFeatured } = req.body;
        const author = req.user._id;

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });
        if (blog.author.toString() !== author.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        blog.title = title;
        blog.content = content;
        blog.slug = slug;
        blog.summary = summary;
        blog.thumbnailUrl = thumbnailUrl;
        blog.tags = tags;
        blog.category = category;
        blog.status = status;
        blog.allowComments = allowComments;
        blog.isFeatured = isFeatured;
        const updatedBlog = await blog.save();
        
        await logActivity(author, updatedBlog._id,"BlogPost", "BLOG_EDITED", "Blog Edited with title : "+updatedBlog.title);
         

        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a blog post


exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // 1. Delete the blog
    
    const profile = await UserProfile.findOne({ _id: req.user._id });
    
    switch(blog.status){
      case "Published":
        profile.Blog.pull(blogId);
        profile.stats.blogCount -= 1;
        break;
      case "Draft":
        profile.DraftBlogs.pull(blogId);
        break;
      case "Archived":
        profile.ArchivedBlogs.pull(blogId);
        break;
    }
    await blog.deleteOne(
      { _id: blogId }
    );
   

    await profile.save();

    // 2. Delete all related comments
    await Comment.deleteMany({ blogId: blogId });
    await logActivity(req.user._id, blogId,"BlogPost", "BLOG_DELETED", "Blog Deleted with title : "+blog.title);


    // 3. Update UserProfile: pull the blogId from arrays
    await UserProfile.updateOne(
      { _id: req.user._id },
      {
        $pull: {
          Blog: blogId,
          DraftBlogs: blogId,
          ArchivedBlogs: blogId,
        },
      }
    );

    return res.json({ message: 'Blog and associated data deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getBlogBySlug = async (req, res) => {
  
  const {slug} = req.params;
  
  try {
    const blog = await BlogPost.findOne({ slug })
      .populate('author', 'username email') // populate author details
      .exec();
      console.log(blog);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog by slug:', err);
    res.status(500).json({ error: 'Server error while fetching blog' });
  }
};
// controllers/commentController.js




// exports.createComment = async (req, res) => {
//   const { blogId } = req.params; // URL param
//   const { text } = req.body; // Request body
//   const userId = req.user._id; // Authenticated user's ID (assuming you have auth middleware)

//   if (!text || !text.trim()) {
//     return res.status(400).json({ error: 'Comment text is required' });
//   }

//   try {
//     // Check if the blog exists
//     const blog = await Blog.findById(blogId);

//     if (!blog) return res.status(404).json({ error: 'Blog not found' });

//     // Create and save the comment
//     const newComment = new Comment({
//       blog: blogId,
//       user: userId,
//       text,
//       parentComment:  null
//     });
    
//     const author = req.user._id;
//     const savedComment = await newComment.save();
//     console.log(savedComment);
    // const log = await logActivity(author, savedComment._id,"Comment", "COMMENT_ADDED", "Comment on a blog with title : "+blog.title);
//     console.log(log);
//     const populatedComment = await newComment.populate('user', 'username');

//     res.status(201).json(populatedComment);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create comment' });
//   }
// };
// exports.getCommentsByBlogId = async (req, res) => {
//   const {blogId} = req.params;

//   try {
//     const comments = await Comment.find({ blog: blogId })
//       .populate('user', 'username') // fetch username from User
//       .sort({ createdAt: 1 }); // sort oldest to newest
//       console.log(comments)

//     const formattedComments = comments.map(comment => ({
//       _id: comment._id,
//       content: comment.text,
//       username: comment.user?.username || 'Anonymous',
//       createdAt: comment.createdAt,
//       parentComment: comment.parentComment
//     }));

//     res.json(formattedComments);
//   } catch (err) {
//     console.error('Error fetching comments:', err);
//     res.status(500).json({ error: 'Failed to load comments' });
//   }
// };



exports.likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;
    console.log(blogId, userId);

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Prevent duplicate likes
    if (blog.likedBy.includes(userId)) {
      blog.likesCount -= 1;
      blog.likedBy.pull(userId);
      await blog.save()
      return res.status(200).json({ likesCount: blog.likesCount });
      
    }

    blog.likesCount += 1;
    blog.likedBy.push(userId);

    await blog.save();
    return res.status(200).json({ likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: 'Error liking blog' });
  }
};
exports.getIfLiked = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const isLiked = blog.likedBy.includes(userId);

    return res.status(200).json({ liked:isLiked });
  } catch (error) {
    res.status(500).json({ message: 'Error checking if liked' });
  }
};



exports.viewBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Prevent duplicate views
    if (blog.viewedBy.includes(userId)) {
      return res.status(200).json({ message: 'Already viewed' });
    }

    blog.viewsCount += 1;
    blog.viewedBy.push(userId);

    await blog.save();
    return res.status(200).json({ viewsCount: blog.viewsCount });
  } catch (error) {
    res.status(500).json({ message: 'Error counting view' });
  }
};


