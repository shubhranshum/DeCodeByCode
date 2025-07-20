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
  numberOfProblems:{
    type: Number,
    default: 0
  },
  numberOfContests:{
    type: Number,
    default: 0
  },
  numberOfBlogs: {
    type: Number,
    default: 0
  },
  numberOfSubmissions:{
    type: Number,
    default: 0
  },
  numberOfComments: {
    type: Number,
    default: 0
  },
  numberOfLikes: {
    type: Number,
    default: 0
  },
  numberOfViews: {
    type: Number,
    default: 0
  },
  



  

  

  


  

  

  
});

module.exports = mongoose.model('Community', CommunitySchema);
