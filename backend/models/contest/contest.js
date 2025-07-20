const mongoose = require("mongoose");

// contest.model.js
const contestSchema = new mongoose.Schema({
    title: { type: String, required: true , unique: true},
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    description: String,
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number, default: 120 }, // Duration in minutes
    Problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPrivate: { type: Boolean, default: false },
    registrationOpen: { type: Boolean, default: false },
    contestType: { type: String, enum: ['ICPC', 'IOI', 'CF'], default: 'ICPC' },
    isVerified: { type: Boolean, default: false }, // Default to false
    isGlobal: { type: Boolean, default: false }, // Default to false
  }, { timestamps: true });



module.exports = mongoose.model("Contest", contestSchema);