const mongoose = require('mongoose')
const Guild = require('../models/guild')
const config = require('../config.json')
const Discord = require('discord.js')

module.exports = async (client, message) => {
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
                welcomeChannel: ''
            })

            newGuild.save()
                .then(result => client.logger.log(result))
                .catch(err => client.logger.error(err))
        }
    })

    const messageLogID = settings.messagelogID
    const delmsgEmbed = new Discord.MessageEmbed()
        .setTitle('🗑️ Message Deleted')
        .setColor('RED')
        .setAuthor(message.author.tag, message.author.avatarURL())
        .addField('Message Content', message.content)
        .addField('Message Author', message.author)
        .addField('Channel', `${message.channel} \`[#${message.channel.name}]\``)
        .setFooter('Cosmic Events')
        .setTimestamp()
    
    if(!messageLogID) return

    message.guild.channels.cache.get(messageLogID).send(delmsgEmbed)
}