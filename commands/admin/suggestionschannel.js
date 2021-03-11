const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const config = require('../../config.json')

module.exports = {
    name: 'suggestionschannel',
    category: 'admin',
    description: 'Sets the suggestions channel',
    args: true,
    guildOnly: true,
    usage: '[Channel]',
    async execute(client, message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(':x: You are missing the necessary permissions `ADMINISTRATOR` to use this command!')

        const channel = message.mentions.channels.first();

        if(!channel) return message.channel.send(':x: I cannot find that channel!')

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, async (err, guild) => {
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
                    suggestionID: channel.id,
                    autoroleID: '',
                    welcomeChannel: '',
                    verifiedRole: ''
                })

                await newGuild.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))

                return message.channel.send(`Suggestions channel has been set to ${channel}.`)
            }
            
            await settings.updateOne({
                suggestionID: channel.id
            }).then(result => client.logger.log(`Updated suggestions channel for ${message.guild.name} (${message.guild.id})`)).catch(err => client.logger.error(err))

            return message.channel.send(`Suggestions channel has been set to ${channel}.`)
        })
    }
}