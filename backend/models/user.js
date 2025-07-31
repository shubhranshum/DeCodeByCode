const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: false, 
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  //for verification of email
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: {
    type: String,
    required: false
  },
  verificationTokenExpires: {
    type: Date,
    required: false
  },
  password: {
    type: String,
    required: false // optional for OAuth users
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'github', 'facebook', null],
    default: null
  },
  oauthId: {
    type: String,
    default: null,
    index: true
  },

  // ====== Basic Profile ======
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  age: { type: String },
  skills:{
        type: [String],
        default: []
    },
    
    about:{
        type: String,
        default: ''
    },
  profilePicture: {
    type: String,
    default: 'https://i.ibb.co/ZRxg5RSS/decodebycode.png' // Default avatar as before
  },
  college: { type: String, default: '' },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  about: { type: String },
  isAdmin: { type: Boolean, default: false },

  // ====== Social Links ======
  socialLinks: {
    personalsite: { type: String , default: ''},
    github: { type: String , default: ''},
    linkedin: { type: String, default: '' },
    leetcode:{
        type: String,
        default: ''
    },
    codechef: {
        type: String,
        default: ''
    },
    codeforces: {
        type: String,
        default: ''
    },
   
    
  },

  // ====== Stats ======
  stats: {
    problemsSolved: { type: Number, default: 0 },
    blogCount: { type: Number, default: 0 },
    blogViews: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    solutionsAccepted: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 }
  },
  isOnline: { type: Boolean, default: false },

  // ====== Preferences ======
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      blogUpdates: { type: Boolean, default: true }
    }
  },

  // ====== History & Timestamps ======
  lastSeenAt: { type: Date, default: Date.now },
  joinedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // ====== Problem History ======
  ProblemHistory: [
    {
      problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
      status: { type: String, enum: ['Solved', 'Attempted'], required: true },
      solvedAt: { type: Date },
      lastTriedAt: { type: Date, required: true }
    }
  ],
  ContestHistory: [
    {
      contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
      rank: { type: Number },
      score: { type: Number },
      totalQuestion: { type: Number },
      solvedQuestion: { type: Number },
      date: { type: Date },
    }
  ],
  accountStatus: {
  type: String,
  enum: ['active', 'suspended', 'banned'],
  default: 'active'
},
achievements:{
  type: [String],
  default: []
},
notifications: [
  {
    type: String,
    message: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    link: String
  }
],
bookmarkedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem', default: [] }],
bookmarkedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' , default: [] }],



}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
