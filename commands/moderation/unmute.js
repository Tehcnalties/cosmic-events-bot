const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const Discord = require('discord.js')
const { execute } = require('./kick')

module.exports = {
    name: 'unmute',
    category: 'moderator',
    description: 'unmutes the chosen member',
    args: true,
    guildOnly: true,
    usage: '[Member]',
    async execute(client, message, args) {
        if(!(message.member.hasPermission('KICK_MEMBERS'))) return message.channel.send(':x: You can\'t use this command!')

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

        const mutedRoleID = settings.mutedID
        const logChannelID = settings.modlogID

        let user = message.mentions.users.first();
        const userMember = message.mentions.members.first()
        const params = message.content.split(' ').slice(1)

        if (!user) {
            try {
                // Check if a valid userID has been entered instead of a Discord user mention
                if (!message.guild.members.fetch(params.slice(0, 1).join(' '))) throw new Error('Can\'t find a member with that userID')
                // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
                user = message.guild.members.fetch(params.slice(0, 1).join(' '))
                user = user.user
            } catch (error) {
                console.log(error)
                return message.reply('Can\'t find a member with that user ID!')
            }
        }

        if(!userMember.roles.cache.has(mutedRoleID)) return message.channel.send(':x: This user is not muted!')
        if(userMember.roles.cache.has(mutedRoleID)) {
            userMember.roles.remove(mutedRoleID).catch(err => {
                client.logger.error(err)
                message.channel.send(`Couldn't mute ${user}!`)
                return
            })
            message.channel.send(`:white_check_mark: Unmuted ${user} successfully!`)
        }

        const unmuteEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setThumbnail(user.avatarURL())
            .setAuthor(`${user.username} has been unmuted.`)
            .addField('Person unmuted:', `${user.username}`, true)
            .addField('Unmuted by:', `${message.author}`, true)
            .addField('User ID:', `${user.id}`)
            .setFooter('Cosmic Events')
            .setTimestamp()

        if(!settings.modlogID) {
            message.channel.send(`You do not have a punishment logs channel set yet! Use \`${settings.prefix}modlog\` to set one.`)
        } else {
            message.guild.channels.cache.get(logChannelID).send(unmuteEmbed).catch(err => client.logger.error(err))
        }
    }
}