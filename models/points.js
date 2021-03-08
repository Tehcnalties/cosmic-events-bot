const mongoose = require('mongoose')

const pointsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    balance: Number,
    IGN: String
})

module.exports = mongoose.model('Point', pointsSchema, 'points')