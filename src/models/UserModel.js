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
        enum: ['user', 'admin','Customer - Buy Cars','Dealer - Sell Cars'],
        default: 'user'
    },
    profilepic:{
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "banned", "pending", "suspended", "deleted", "verified", "unverified"]
    }
});
// }, { timestamps: true });

const User = mongoose.model('Users', userSchema);


module.exports = User;


