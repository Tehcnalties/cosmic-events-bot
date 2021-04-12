const Discord = require('discord.js')
const { execute } = require('./kick')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')

module.exports = {
    name: 'kick',
    category: 'moderator',
    description: 'Kicks a specific player',
    args: true,
    guildOnly: true,
    usage: '[Member] [Reason]',
    async execute(client, message, args) {
        if(!(message.member.hasPermission('KICK_MEMBERS'))) return message.channel.send(':x: You can\'t use this command!')

        let reason = args.slice(1).join(' ')
        let mentionedUser = message.mentions.users.first()
        let mentionedMember = message.mentions.members.first()

        if(!mentionedUser) {
            await client.users.fetch(args[0]).then((user) => {
                mentionedUser = args[0]
            }).catch(err => message.channel.send(':x: Not a valid user ID!'))
        } else if(mentionedUser) {
            mentionedUser = mentionedUser.id
        }

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
    
                return message.channel.send(':x: Your server was not registered in our database, and was just registered.')
            }
        })

        const logChannelID = settings.modlogID

        

        if(mentionedUser === message.author.id) return message.channel.send(':x: You cannot kick yourself.')
        if(mentionedUser === message.guild.ownerid) return message.channel.send(':x: You cannot kick the guild owner.')
        // message.guild.members.fetch(mentionedUser).then((member) => {
        //     if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1) return message.channel.send(':x: Your role is not high enough to ban this member.')
        // })
        if(!reason) reason = 'No reason given'

        const member = message.guild.members.cache.get(mentionedUser)
        if(!member.kickable) return message.channel.send(':x: You cannot kick that user.')

        member.kick({
            reason: `${message.author.tag} - ${reason}`
        })

        client.users.fetch(mentionedUser).then((user) => {
            const kickEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setThumbnail(user.avatarURL())
            .setAuthor(`${user.username} has been kicked!`)
            .addField('Person kicked:', `${user.username}`, true)
            .addField('Kicked by:', `${message.author}`, true)
            .addField('Reason:', `${reason}`, true)
            .setTimestamp()

            message.channel.send(`${user} has been kicked!`)

            if(!settings.modlogID) {
                message.channel.send(`You do not have a punishment logs channel set yet! Use \`${settings.prefix}modlog\` to set one.`)
            } else {
                message.guild.channels.cache.get(logChannelID).send(kickEmbed).catch(err => client.logger.error(err))
            }
        })
    }
}