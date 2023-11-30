const mongoose = require('mongoose');

const Conversations = new mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
    question: String,
    bot: String,
    callType: {enum: ['audio', 'chat'], type: String, default: 'chat'}
}, {timestamps: true})

module.exports = mongoose.model('conversations', Conversations);