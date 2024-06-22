const mongoose = require('mongoose');
const Chat = require('./Chat')
const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    pp: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    vertificatonToken: {
        type: String,
        unique: true,
        required: true
    },
    
    verified: {
        type: Boolean,
        default: false
    },
    chats: [Chat.schema]
});
const User = mongoose.model('User', userSchema);
module.exports = User;
