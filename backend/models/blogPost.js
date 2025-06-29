const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // URL-safe
  content: { type: String, required: true }, // markdown or HTML
  summary: { type: String }, // short excerpt
  thumbnailUrl: { type: String }, // cover image

  tags: [{ type: String }],
  category: { type: String }, // optional broader classification

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
    
  },
  viewedBy:{
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  likedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },

  viewsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }, // updated on new comment

  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft'
  },
  readTime: { type: Number }, // minutes, calculate from content

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },

  allowComments: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },

  // SEO and Sharing metadata
  metaTitle: { type: String },
  metaDescription: { type: String },
  ogImage: { type: String },
  canonicalUrl: { type: String }
});
BlogPostSchema.pre('findOneAndDelete', async function (next) {
  const blogId = this.getQuery()["_id"]; // Blog being deleted

  try {
    const Comment = mongoose.model('Comment');
    const UserProfile = mongoose.model('UserProfile');

    // 1. Delete associated comments
    await Comment.deleteMany({ blog: blogId });

    // 2. Remove blog reference from all UserProfile arrays
    await UserProfile.updateMany(
      { Blog: blogId },
      { $pull: { Blog: blogId } }
    );
    await UserProfile.updateMany(
      { LikedBlogs: blogId },
      { $pull: { LikedBlogs: blogId } }
    );
    await UserProfile.updateMany(
      { DraftBlogs: blogId },
      { $pull: { DraftBlogs: blogId } }
    );
    await UserProfile.updateMany(
      { ArchivedBlogs: blogId },
      { $pull: { ArchivedBlogs: blogId } }
    );

    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model('BlogPost', BlogPostSchema);
