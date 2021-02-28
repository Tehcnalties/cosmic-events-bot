const mongoose = require('mongoose');
const config = require('../config.json')

// DO NOT TOUCH THIS FILE UNDER ANY CIRCUMSTANCES

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        }

        mongoose.connect(config.mongodb_uri, dbOptions)
        mongoose.set('useFindAndModify', false)
        mongoose.Promise = global.Promise

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully!')
        })

        mongoose.connection.on('err', err => {
            console.error(`MongoDB connection error: \n${err.stack}`)
        })

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB connection lost!')
        })
    }
}