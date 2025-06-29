const Question = require('../models/question');

async function createQuestion(req, res) {
    console.log("I am in createQuestion controller");
    console.log(req.body,req.user);
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    const { title, description, tags } = req.body;
    try {
        const newQuestion = new Question({
            title,
            description,
            tags,
            createdAt: new Date()
        });
        if(req.user) newQuestion.user = req.user;// Set the user ID from the authenticated user
        await newQuestion.save();
        res.status(201).json({ message: 'Question created successfully', question: newQuestion });
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = createQuestion;