const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true,index:true },

  // Dynamic reference to various collections
  refId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  refModel: {
    type: String,
    required: true,
    enum: ['Problem', 'BlogPost', 'Comment'] // Add any model names you want to support
  },

  type: {
    type: String,
    enum: [
      'PROBLEM_SOLVED',
      'PROBLEM_ATTEMPTED',
      'PROBLEM_CREATED',
      'BLOG_POSTED',
      'BLOG_EDITED',
      'BLOG_DELETED',
      'COMMENT_ADDED',
      'LIKE_GIVEN',
      

      'FOLLOW_GIVEN',
      'FOLLOW_ACCEPTED',
      'FOLLOW_REJECTED',
      'FOLLOW_REQUESTED',

      
    ],
    required: true
  },

  details: {
    type: Schema.Types.Mixed
  },

  
},{
  timestamps: true
}
);

// Dynamic population setup (optional utility, not in schema)
activitySchema.virtual('ref', {
  ref: doc => doc.refModel,
  localField: 'refId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Activity', activitySchema);
