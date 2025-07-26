const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "shubh@123#1234#12345#";
const transporter = require('../../utils/emailService');


const sendResetPasswordEmail = async (req, res) => {


  try {
    console.log("Hello from sendResetPasswordEmail");
    const emailid = req.params.emailId;
    const user = await User.findOne({ email: emailid });
    const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: '10m' });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetPasswordLink = 'http://localhost:5173/reset-password/' + token;
    const mailOptions = {
      from: 'decodebycode.pvt.ltd@gmail.com',
      to: emailid,
      subject: 'Reset Password',
      html: `
      <p>Click the following link to reset your password:</p>

<a href="${resetPasswordLink}" style="
  display: inline-block;
  padding: 10px 20px;
  background-color: #007BFF;
  color: #ffffff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  font-family: Arial, sans-serif;
">
  Reset Password
</a>

<p style="font-size: 14px; color: #555; margin-top: 10px;">
  This link will expire in 10 minutes for your security.
</p>
`
    };
    await transporter.sendMail(mailOptions);
    console.log("Send message successfully");

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
}
const handlePasswordChange = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    console.log("Hello from handlePasswordChange");
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (!decodedToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const user = await User.findById(decodedToken.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error changing password' });
  }
};
module.exports = { sendResetPasswordEmail, handlePasswordChange }