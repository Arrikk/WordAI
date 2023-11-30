const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    sub: {type: Number, default: null},
    displayName: {type: String, default: null},
    name: String,
    firstName: String,
    lastName: String,
    email: {type:String, required: true},
    email_verified: {type:Boolean, defaule:false},
    picture: {type:String, default: null},
    password: {type:String, default: null},
}, {timestamps: true})

module.exports = mongoose.model('users', Users);