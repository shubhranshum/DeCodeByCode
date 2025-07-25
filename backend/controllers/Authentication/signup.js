const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const UserProfile = require('../../models/profile/userProfile');
const JWT_SECRET = "shubh@123#1234#12345#";
const Community = require('../../models/community/community');
const transporter = require('../../utils/emailService');
const Notification = require('../../models/notification/notification');

async function userSignUp(req, res) {
    console.log("Hello from userSignUp controller");
    const { username, email, password, college } = req.body;


    try {
        const userExists = await User.findOne({ email });
        const nuserExists = await UserProfile.findOne({ username });
        if (userExists || nuserExists) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const verificationToken = await jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        console.log(verificationToken);
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now
        var newUser = new User({
            username,
            email,
            isEmailVerified: false,
            verificationToken: verificationToken,
            verificationTokenExpires: verificationTokenExpires,
            password: hashedPassword,
            college: college,
            isAdmin: false // Default to false, can be changed later
        })
        newUser = await newUser.save();
        console.log(newUser._id)
        console.log("User created successfully:", newUser.email);
         const verificationUrl = `http://localhost:3000/auth/verify-email/${verificationToken}`;
        const mailOptions = {
            from: 'decodebycode.pvt.ltd@gmail.com',
            to: newUser.email,
            subject: 'Welcome to DecodeByCode! Please Verify Your Email',
            html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Welcome to DecodeByCode!</h2>
          <p>Thank you for signing up. Please click the button below to verify your email address.</p>
          <a href="${verificationUrl}" style="background-color: #a8dadc; color: #2d2a26; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px;">Verify Email</a>
          <p style="margin-top: 20px;">If you did not sign up for this account, you can ignore this email.</p>
          <p style="margin-top: 20px;">Best regards,<br>DecodeByCode Team</p>
        </div>
      `
        };
        await transporter.sendMail(mailOptions);

        const community = await Community.findOne();
        console.log(community);
        community.numberOfUsers += 1;
        await community.save();
          const notification = new Notification({
            recipient: newUser._id,
            type: "SYSTEM",
            message: "Welcome to DecodeByCode Community",
            link: "/profile"
        });
        await notification.save();


        


        res.status(201).json({ message: 'User created successfully', user: newUser });
        
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = userSignUp;