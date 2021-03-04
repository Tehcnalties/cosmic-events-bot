const mongoose = require('mongoose')
const Guild = require('../models/guild')
const config = require('../config.json')
const Discord = require('discord.js')

module.exports = async (client, oldMessage, newMessage) => {
    const settings = await Guild.findOne({
        guildID: newMessage.guild.id
    }, (err, guild) => {
        if(err) client.logger.error(err)
        if(!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: newMessage.guild.id,
                guildName: newMessage.guild.name,
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

    if (
        !oldMessage.guild ||
        !newMessage.guild ||
        oldMessage.author.bot ||
        newMessage.author.bot
      )
        return;

    const messageLogID = settings.messagelogID
    const editmsgEmbed = new Discord.MessageEmbed()
        .setTitle('Message edited')
        .setColor('YELLOW')
        .setAuthor(newMessage.author.tag, newMessage.author.avatarURL())
        .setDescription(`**User:** ${newMessage.author}\n**Channel:** ${newMessage.channel} \`[#${newMessage.channel.name}]\``)
        .addField('Before:', oldMessage.content)
        .addField('After:', newMessage.content)
        .setFooter('Cosmic Events')
        .setTimestamp()
    
    if(!messageLogID) return

    oldMessage.guild.channels.cache.get(messageLogID).send(editmsgEmbed).catch(err => client.logger.error(err))
}