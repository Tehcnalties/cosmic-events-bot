const mongoose = require('mongoose')
const Guild = require('../models/guild')
const config = require('../config.json')
const Discord = require('discord.js')

module.exports = async (client, member) => {
    const settings = await Guild.findOne({
        guildID: member.guild.id
    }, (err, guild) => {
        if(err) client.logger.error(err)
        if(!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: member.guild.id,
                guildName: member.guild.name,
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

    const autoRoleID = settings.autoroleID
    const welcomeChannelID = settings.welcomeChannel
    const welcomeEmbed = new Discord.MessageEmbed()
        .setTitle('Entering Space...')
        .setAuthor(member.user.tag, member.user.avatarURL())
        .setThumbnail(member.user.avatarURL())
        .setColor('c186ff')
        .setDescription(`Welcome to the server, ${member}! Make sure to read <#814715613544841217> and <#814711211039653972> to learn more about us.`)
        .addField('Member Count', member.guild.memberCount)
        .setFooter('Cosmic Events')
        .setTimestamp()

    if(!autoRoleID) return
    if(!welcomeChannelID) return

    member.roles.add(autoRoleID).catch(err => client.logger.error(err))
    member.guild.channels.cache.get(welcomeChannelID).send(member, { embed: welcomeEmbed})
}