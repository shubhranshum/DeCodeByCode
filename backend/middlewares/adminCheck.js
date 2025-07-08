const User = require('../models/user');

const adminCheck = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        next();
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminCheck;