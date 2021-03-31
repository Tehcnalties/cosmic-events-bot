const mongoose = require('mongoose')

const blacklistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    reason: String
})

module.exports = mongoose.model('Blacklist', blacklistSchema, 'blacklists')