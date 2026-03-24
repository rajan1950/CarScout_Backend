const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["buyer", "seller", "admin"],
        default: 'buyer'
    },
    profilepic:{
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "banned", "pending", "suspended", "deleted", "verified", "unverified"]
    },
    passwordChangedAt: {
        type: Date,
        default: null
    },
    passwordAuditLogs: [
        {
            action: {
                type: String,
                default: "reset-password"
            },
            changedAt: {
                type: Date,
                default: Date.now
            },
            ip: {
                type: String,
                default: ""
            },
            userAgent: {
                type: String,
                default: ""
            }
        }
    ]
});{ timestamps: true }


const User = mongoose.model('Users', userSchema);

module.exports = User;


