const mongoose = require('mongoose');


const submissionSchema = mongoose.Schema({
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Problem'  , required: true },
    contestId:    { type: mongoose.Schema.Types.ObjectId,    default: null, index: true },
    code:         String,
    language:     String,
    verdict:      String,
    timeTaken:    Number, // in milliseconds
    memoryTaken:  Number, // in bytes
    submissionTime: { type: Date, default: Date.now, index: true },
    timeFromStart: {type: Number},  // seconds since contest start
    // …any other fields…
  });

  // Ensure fast lookups by contest + user + problem
submissionSchema.index({ contestId: 1, userId: 1, problemId: 1 });
module.exports = mongoose.model('Submission', submissionSchema);
