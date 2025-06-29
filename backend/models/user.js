const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

        index: true

       // Ensure usernames are unique

    },
    email: {
        type: String,
        required: true,

        index: true

    },
    password:{
        type: String,
        required: true,
    },
    college: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    
    
},{timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;