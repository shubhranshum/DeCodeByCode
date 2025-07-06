const Problem = require('../../../models/problem');

async function postToGlobalProblems(req, res) {
    const id = req.params.problemId; // Assuming the problem ID is passed as a URL parameter
    // console.log('Fetching all problems');
    try {
        const toTestIsVerified = await Problem.findById(id)
        if(!toTestIsVerified){
            return res.status(404).json({ message: 'Problem not found' });
        }
        if(toTestIsVerified.isGlobal === true){
            const problem = await Problem.findByIdAndUpdate(id,{
                $set: { isGlobal: false } // Set the problem as verified
            }, { new: true }) // Return the updated document
            .populate('user', 'username');
            return res.status(200).json({ message: 'Problem is removed from global'});
        }
        if(toTestIsVerified.isVerified === false){
            return res.status(400).json({ message: 'Problem is not verified yet' });
        }
        const problem = await Problem.findByIdAndUpdate(id,{
            $set: { isGlobal: true } // Set the problem as verified
        }, { new: true }) // Return the updated document
        .populate('user', 'username'); // Populate user details
        // console.log('Problems fetched:', problems);
        if(!problem){
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json(problem);
    } catch (err) {
        console.error('Error fetching problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = postToGlobalProblems;