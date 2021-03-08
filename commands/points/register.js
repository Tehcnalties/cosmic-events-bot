const Discord = require('discord.js')
const mongoose = require('mongoose')
const Points = require('../../models/points')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'register',
    category: 'points',
    args: false,
    guildOnly: true,
    description: 'Registers you into the points system',
    async execute(client, message, args) {
        points = new Points({
            _id: mongoose.Types.ObjectId(),
            userID: message.author.id,
            balance: 0,
            IGN: ''
        })

        await Points.findOne({
            userID: message.author.id
        }, (err, user) => {
            if(err) client.logger.error(err)
            if(user) return message.channel.send(':x: You\'re already registered!')
            if(!user) {
                points.save()
                    .then(result => client.logger.log(result))
                    .catch(err => {
                        client.logger.error(err)
                        message.channel.send(':x: Failed to register you; please try again later.')
                    })
        
                message.channel.send(':white_check_mark: Successfully registered you into our points system!')
            }
        })

        
    }
}