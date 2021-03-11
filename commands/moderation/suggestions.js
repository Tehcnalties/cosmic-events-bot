const Suggestion = require('../../models/suggestions')
const Guild = require('../../models/guild')
const mongoose = require('mongoose')
const config = require('../../config.json')
const Discord = require('discord.js')
const { execute } = require('./kick')
const suggestions = require('../../models/suggestions')

module.exports = {
    name: 'suggestions',
    description: 'Accepts or denies a suggestion',
    args: true,
    guildOnly: true,
    usage: '[Deny/Accept/View] [Suggestion ID]',
    async execute(client, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(':x: You are missing the necessary permissions `MANAGE_MESSAGES` to use this command!')

        const status = args[0]
        const suggestionID = args[1]

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if(err) client.logger.error(err)
            if(!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.prefix,
                    modlogID: '',
                    mutedID: '',
                    messagelogID: '',
                    suggestionID: '',
                    autoroleID: '',
                    welcomeChannel: '',
                    verifiedRole: ''
                })
    
                newGuild.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))
    
                return message.channel.send(':x: This server was not registered in our database, and was just registered.')
            }
        })

        const suggestionChannelID = settings.suggestionID

        const suggestion = await Suggestion.findOne({
            suggestionID: suggestionID
        }, (err, suggestion) => {
            if(err) client.logger.error(err)
            if(!suggestion) return message.channel.send(':x: Couldn\'t find a suggestion with that ID!')
        })

        const suggestionAuthor = suggestion.userID
        const suggestionMessage = suggestion.suggestion
        const suggestionStatus = suggestion.status
        const suggestionMessageID = suggestion.messageID

        if(!suggestionMessageID) {
            message.channel.send(`This suggestion was sent in our old database system and does not have a message link.`)
        }

        if(status.toLowerCase() === 'deny') {
            if(suggestionStatus === 'denied') return message.channel.send(':x: This suggestion has already been denied.')

            client.users.fetch(suggestionAuthor).then((user) => {
                user.send(`Your suggestion [${suggestionID}] of \`${suggestionMessage}\` was denied.`).catch(() => client.logger.error(`Couldn't send message to ${suggestionAuthor}`))
            })
            
            await suggestion.updateOne({
                status: 'denied'
            }).then(result => client.logger.log(`Suggestion ${suggestionID} was denied`)).catch(err => client.logger.error(err))

            message.guild.channels.cache.get(suggestionChannelID).messages.fetch({around: suggestionMessageID, limit: 1}).then(msg => {
                const fetchedMsg = msg.first()
                
                client.users.fetch(suggestionAuthor).then((user) => {
                    const denyEmbed = new Discord.MessageEmbed()
                        .setTitle('Suggestion Denied')
                        .setAuthor(user.tag, user.avatarURL())
                        .setDescription(suggestionMessage)
                        .addField('Suggestion ID', suggestionID)
                        .setColor('RED')
                        .setFooter('Cosmic Events | React with 👍 or 👎 to vote')
                        .setTimestamp()
                    
                    fetchedMsg.edit(denyEmbed)
                })
            })

            message.channel.send(`Suggestion \`[${suggestionID}]\` was denied.`)
        } else if(status.toLowerCase() === 'accept') {
            if(suggestionStatus === 'accepted') return message.channel.send(':x: This suggestion has already been accepted.')

            client.users.fetch(suggestionAuthor).then((user) => {
                user.send(`Your suggestion [${suggestionID}] of \`${suggestionMessage}\` was accepted!`).catch(() => client.logger.error(`Couldn't send message to ${suggestionAuthor}`))
            })

            await suggestion.updateOne({
                status: 'accepted'
            }).then(result => client.logger.log(`Suggestion ${suggestionID} was accepted`)).catch(err => client.logger.error(err))

            message.guild.channels.cache.get(suggestionChannelID).messages.fetch({around: suggestionMessageID, limit: 1}).then(msg => {
                const fetchedMsg = msg.first()
                
                client.users.fetch(suggestionAuthor).then((user) => {
                    const acceptEmbed = new Discord.MessageEmbed()
                        .setTitle('Suggestion Accepted')
                        .setAuthor(user.tag, user.avatarURL())
                        .setDescription(suggestionMessage)
                        .addField('Suggestion ID', suggestionID)
                        .setColor('GREEN')
                        .setFooter('Cosmic Events | React with 👍 or 👎 to vote')
                        .setTimestamp()
                    
                    fetchedMsg.edit(acceptEmbed)
                })
            })

            message.channel.send(`Suggestion \`[${suggestionID}]\` was accepted.`)
        } else if(status.toLowerCase() === 'view') {
            client.users.fetch(suggestionAuthor).then((user) => {
                const suggestEmbed = new Discord.MessageEmbed()
                    .setTitle(`Suggestion ${suggestionID}`)
                    .setAuthor(user.tag, user.avatarURL())
                    .setDescription(suggestionMessage)
                    .addField('Submitted by', user)
                    .setColor('c186ff')
                    .setFooter('Cosmic Events')
                    .setTimestamp()
                if(status) suggestEmbed.addField('Status', suggestionStatus)
                message.channel.send(suggestEmbed)
            })
        } else return message.channel.send('The first argument must be accept, deny, or view!')
    }
}