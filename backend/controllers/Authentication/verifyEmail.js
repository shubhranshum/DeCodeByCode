const User = require('../../models/user');
verify = async (req, res) => {
    console.log("Hello from verifyEmail");
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully' });
}
module.exports = { verify };
