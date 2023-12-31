const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter email"],
        unique: true,
        trim: true,
        // match: [
        //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     "Please enter a valid email",
        // ],
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
        // minLength: [6, "Password must be upto 6 characters"],
    },
    role: {
        type: String,
        default: "User",
    },

    isVoted: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        default: "+91",
        // length: [10, "Please enter a valid phone number"]
    },
},
    {
        timestamp: true
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;