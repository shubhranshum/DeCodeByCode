// models/Notification.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null // system messages will have null sender
  },

  type: {
    type: String,
    required: true,
    enum: [
      'COMMENT',
      'REPLY',
      'LIKE',
      'FOLLOW',
      'BLOG_PUBLISHED',
      'SYSTEM'
    ]
  },

  message: {
    type: String,
    required: true
  },

  link: {
    type: String, 
    default: null
  },

  isRead: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
