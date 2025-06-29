const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const JWT_SECRET="shubh@123#1234#12345#";
// const auth = require('../middlewares/auth');

async function userLogin(req,res){
    // console.log("In userLogin controller");
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        console.log("User found:", user);
    if(!user){
        return res.status(400).json({message: 'User Not found with this email'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id , email: user.email }, JWT_SECRET, { expiresIn: '2d' });
    // req._id = token;
    console.log('Token generated:', token);
    await res.cookie('token',token,
        {httpOnly: true,      // Prevent JS from accessing it (recommended for security)
            secure: false,       // Set to true in production if using HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000}
    ).status(200).json({msg : 'User logged in successfully', user: user, token: token});
    // res.set(token); // Set the token in the headers
    // console.log(res.header('x-auth-token')); // Set the token in the headers
    }
    catch(err){
        console.error('Error creating user:', err);
        res.status(500).json({message: err});
    }
}

module.exports = userLogin;