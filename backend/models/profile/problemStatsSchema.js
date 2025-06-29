const problemStatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    solved: Boolean,
    attempts: Number,
    solution: String,
    solvedAt: Date,
    timeTaken: Number, // in minutes
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    }
});

const ProblemStat = mongoose.model('ProblemStat', problemStatSchema);