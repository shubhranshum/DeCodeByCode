const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true,
    index:true
    
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: { type: String, required: true },

  // Optional fields
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null // for reply threads
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Comment', CommentSchema);
