const Problem = require('../../models/problem');

async function deleteTestCaseById(req, res) {
    if(req.user === undefined) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    try {
        const problem = await Problem.findById(req.params.id);
        const testCase = problem.testCases;
        updateTestCase = testCase.filter((testCase) => {
            // console.log("TestCase ID:", testCase._id.toString(), "Request Body TestCase ID:", req.params.testCaseId);
            return testCase._id.toString() !== req.params.testCaseId;
        })
        // console.log("Update TestCase:", updateTestCase);
        await Problem.findByIdAndUpdate(req.params.id, { testCases: updateTestCase }, { new: true });
        res.status(201).json({ message: 'TestCase deleted successfully', problem });
    } catch (err) {
        console.error('Error deleting problem:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = deleteTestCaseById;