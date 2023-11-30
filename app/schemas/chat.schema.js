const mongoose = require('mongoose');


const Chat = new mongoose.Schema({
    title: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
}, {timestamps: true})

module.exports = mongoose.model('chat', Chat);