const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['PROBLEM_SOLVED', 'BLOG_POSTED', 'COMMENT_ADDED', 'LIKE_GIVEN', 'ACHIEVEMENT_EARNED']
    },
    details: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);