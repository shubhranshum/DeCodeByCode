const Problem = require('../../../models/problem');
const { createNotification } = require('../../Notification/notificationController');
const User = require('../../../models/user');
const createPotd = async (req, res) => {
    try {
        console.log("Hello from createPotd");
        const { problemId } = req.body;
        
        const alreadyPotd = await Problem.findOne({ isPotd: true });
       
        //check if POTD date has crossed 24 hours of time
        // if (alreadyPotd && alreadyPotd.dateofPotd + 86400000 < Date.now()) {
        //     return res.status(400).json({ message: 'POTD has already been set for today' });
        // }
        if (alreadyPotd) {
            alreadyPotd.isPotd = false;
            await alreadyPotd.save();
        }
        
        
        const problem = await Problem.findById(problemId);

        console.log(problem?._id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        if (problem.hasBeenPotd) return res.status(400).json({ message: 'Problem has already been marked as POTD' });
        // if (problem.isVerified === false) return res.status(400).json({ message: 'Problem is not verified yet' });
        problem.isPotd = true;
        problem.hasBeenPotd = true;
        problem.dateofPotd = Date.now();
        await problem.save();


        return res.status(200).json({ message: 'Problem marked as POTD successfully' });
    } catch (error) {
        console.error('Error marking problem as POTD:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const createRandomPotd = async (req, res) => {
    //find problems where problem is global and has not been marked as potd
    try {
        const alreadyPotd = await Problem.findOne({ isPotd: true });
        //check if POTD date has crossed 24 hours of time
        if (alreadyPotd && alreadyPotd.dateofPotd + 86400000 < Date.now()) {
            return res.status(400).json({ message: 'POTD has already been set for today' });
        }

        alreadyPotd.isPotd = false;
        await alreadyPotd.save();
        const problems = await Problem.find({ isGlobal: true, hasBeenPotd: false });
        if (problems.length === 0) {
            return res.status(404).json({ message: 'No global problems available' });
        }
        const randomProblem = problems[Math.floor(Math.random() * problems.length)];
        if (!randomProblem) {
            return res.status(404).json({ message: 'No problem found' });
        }
        randomProblem.isPotd = true;
        randomProblem.hasBeenPotd = true;
        randomProblem.dateofPotd = Date.now();
        randomProblem.save();
    }
    catch (error) {
        console.error('Error marking problem as POTD:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
const getPotd = async (req, res) => {
    try {
        console.log("Hello from getPotd");
        const problem = await Problem.findOne({ isPotd: true });
        console.log(problem?._id);
        if (!problem) {
            return res.status(404).json({ message: 'No problem marked as POTD' });
        }
         console.log(problem?._id);
        return res.status(200).json(problem);
    } catch (error) {
        console.error('Error getting POTD:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getPotd, createPotd };

