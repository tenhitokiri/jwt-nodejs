const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 256,
        min: 6,
        required: true
    },
    email: {
        type: String,
        max: 256,
        min: 6,
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;