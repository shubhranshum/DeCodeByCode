const nodemailer = require('nodemailer');
require('dotenv').config(); 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use the variable
    pass: process.env.EMAIL_PASS    // The 16-character App Password you generated
  }
});

module.exports = transporter;