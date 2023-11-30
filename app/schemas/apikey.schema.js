const mongoose = require('mongoose');

const ApiKeys = new mongoose.Schema({
    user: {required: true, type: mongoose.Types.ObjectId, ref: 'User'},
    secret: {required: true, type: String} 
}, {timestamps: true})

module.exports = mongoose.model('apikey', ApiKeys);