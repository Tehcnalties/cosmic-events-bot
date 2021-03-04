const mongoose = require('mongoose')

const suggestionsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    suggestion: String,
    suggestionID: String,
    status: String,
    messageID: String
})

module.exports = mongoose.model('Suggestion', suggestionsSchema, 'suggestions')