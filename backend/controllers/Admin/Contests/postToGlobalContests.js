const Contest = require('../../../models/contest/contest');
const Notification = require('../../../models/notification/notification');
const User = require('../../../models/user');
async function postToGlobalContests(req, res) {
    const id = req.params.contestId;
    console.log('Contest ID:', id);
    try {
        const toTestIsVerified = await Contest.findById(id)
        if(!toTestIsVerified){
            return res.status(404).json({ message: 'Contest not found' });
        }
        if(toTestIsVerified.isGlobal === true){
            await Contest.findByIdAndUpdate(id,{
                $set: { isGlobal: false } // Set the problem as verified
            }, { new: true }) // Return the updated document
            return res.status(200).json({ message: 'Contest is removed from global'});
        }
        if(toTestIsVerified.isVerified === false){
            return res.status(400).json({ message: 'Contest is not verified yet' });
        }
        const contest = await Contest.findByIdAndUpdate(id,{
            $set: { isGlobal: true } // Set the problem as verified
        }, { new: true })


        //this is logic to send notification upon contest publish
        const users = await User.find({});
        
        for (let user of users) {
            
                const notification = new Notification({
                    sender: req.user._id,
                    recipient: user._id,
                    type: 'SYSTEM',
                    message: 'A new contest has been published. Register now!',
                    isRead: false,
                    link: `/contests/${contest._id}`


                });
                await notification.save();
            
        }

         // Return the updated document
        res.status(200).json(contest);
    } catch (err) {
        console.error('Error fetching contest', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = postToGlobalContests;