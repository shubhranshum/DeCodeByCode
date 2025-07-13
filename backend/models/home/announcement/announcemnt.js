const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
   
    trim: true,
  },
  message: {
    type: String,
    default: '',
    
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'alert', 'update', 'success'],
    default: 'info',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isGlobal: {
    type: Boolean,
    default: false,
  },
  visibleFrom: {
    type: Date,
    default: Date.now,
  },
  visibleTill: {
    type: Date,
    default: null, // If null, show indefinitely
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Optional: track admin or system user
  },
  audience: {
    type: String,
    enum: ['all', 'admins', 'users', 'guests'],
    default: 'all',
  },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Announcement', announcementSchema);
