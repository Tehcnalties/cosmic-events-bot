const Discord = require('discord.js')
const { execute } = require('../moderation/kick')
const mongoose = require('mongoose')
const blackList = require('../../models/blacklist')
const { black } = require('chalk')

module.exports = {
    name: 'blacklist',
    category: 'developer',
    description: 'Adds a member to the bot blacklist',
    args: true,
    guildOnly: true,
    usage: '[add/remove] [member] [reason]',
    async execute(client, message, args) {
        if(!(message.author.id === '359163540050804738')) return message.channel.send(':no_entry: You cannot use this command.')
            message.delete()

        let mentionedMember = message.mentions.users.first()
        let reason = args.slice(2).join(' ')
            
        if(!mentionedMember) {
            await client.users.fetch(args[0]).then((user) => {
                mentionedMember = args[0]
            }).catch(err => message.channel.send(':x: Not a valid user ID!'))
        } else if(mentionedMember) {
            mentionedMember = mentionedMember.id
        }

        if(args[0].toLowerCase() === 'add') {
            blacklist = new blackList({
                _id: mongoose.Types.ObjectId(),
                userID: mentionedMember,
                reason: reason
            })

            const BlackList = await blackList.findOne({
                userID: mentionedMember
            }, (err, user) => {
                if(err) client.logger.error(err)
                if(user) return message.channel.send(':x: That user is already blacklisted!')
            })

            blacklist.save()
                .then(result => client.logger.log(result))
                .catch(err => {
                    client.logger.error(err)
                    message.channel.send(':x: Failed to add to bot blacklist!')
                })
            
            message.channel.send(':white_check_mark: Added user into bot blacklist.')
        } else if(args[0].toLowerCase() === 'remove') {
            const BlackList = await blackList.findOne({
                userID: mentionedMember
            }, async (err, user) => {
                if(err) client.logger.error(err)
                if(!user) return message.channel.send(':x: That user is not blacklisted.')
                if(user) {
                    await blackList.findOneAndDelete({
                        userID: mentionedMember
                    }, (err) => {
                        if(err) client.logger.error(err)
                    }).then(message.channel.send(':white_check_mark: User removed from bot blacklist.'))
                }
            })
        }

        
    }
}