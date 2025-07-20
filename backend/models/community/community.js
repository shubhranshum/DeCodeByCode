// models/community.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommunitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  logoUrl: {
    type: String // optional community logo or avatar
  },
  numberOfUsers: {
    type: Number,
    default: 0
  },

  

  

  

  // Community Stats
  totalBlogs: {
    type: Number,
    default: 0
  },
  totalProblems: {
    type: Number,
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },

  // Optional tagging or topics
  

  

  
});

module.exports = mongoose.model('Community', CommunitySchema);
