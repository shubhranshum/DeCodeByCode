const { default: mongoose } = require("mongoose");

mongoose
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['NEW_FOLLOWER', 'BLOG_COMMENT', 'PROBLEM_ACCEPTED', 'ACHIEVEMENT', 'SYSTEM']
    },
    message: String,
    read: { type: Boolean, default: false },
    link: String,
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);