const mongoose = require('mongoose')

const statusSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    type: String,
    message: String,
    id: String
})

module.exports = mongoose.model('Status', statusSchema, 'statuses')