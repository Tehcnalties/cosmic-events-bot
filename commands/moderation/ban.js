const Discord = require('discord.js')
const { execute } = require('./kick')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')

module.exports = {
    name: 'ban',
    category: 'moderator',
    description: 'Bans a specific player',
    args: true,
    guildOnly: true,
    usage: '[Member] [Reason]',
    async execute(client, message, args) {
        if(!(message.member.hasPermission('BAN_MEMBERS'))) return message.channel.send(':x: You can\'t use this command!')

        const params = message.content.split(' ').slice(1)
        let user = message.mentions.users.first()
        const mmember = message.mentions.members.first()
        let reason = params.slice(1).join(' ')

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

        // Check if an user mention exists in this message
        if (!user) {
            try {
                // Check if a valid userID has been entered instead of a Discord user mention
                if (!message.guild.members.cache.get(params.slice(0, 1).join(' '))) throw new Error('Can\'t find a member with that userID')
                // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
                user = message.guild.members.cache.get(params.slice(0, 1).join(' '))
                user = user.user
            } catch (error) {
                return message.reply('Can\'t find a member with that user ID!')
            }
        }

        if(user === message.guild.owner) return message.channel.send('You can\'t ban the owner!')
        if(user === message.author) return message.channel.send('Why are you trying to ban yourself?')
        if(user === undefined) return message.channel.send('Please specify a user!')
        if(!reason) {
            reason = 'No reason specified'
        }
        // if (message.member.cache.roles.highest.position < mmember.cache.roles.highest.position) return message.channel.send('You cannot ban someone with a higher role than you.')

        // Highest role check
        // const authorHighest = message.member.cache.roles.highest
        // const userHighest = mmember.cache.roles.highest

        if(!message.guild.member(user).bannable) return message.channel.send(':x: I can\'t ban this user!')
        user.send(`You have been banned from \`${message.guild.name}\` with reason: ${reason}.`).catch(() => client.logger.log(`Can't send DM to ${user.username}!`))
        message.guild.members.ban(user)
        const banEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setThumbnail(user.avatarURL())
            .setAuthor(`${user.username} has been banned!`)
            .addField('Person banned:', `${user.username}`, true)
            .addField('Banned by:', `${message.author}`, true)
            .addField('Reason:', `${reason}`, true)
            .addField('User ID:', `${user.id}`)
            .setTimestamp()

        message.channel.send(`${user} has been banned!`)

        if(!settings.modlogID) {
            message.channel.send(`You do not have a punishment logs channel set yet! Use \`${settings.prefix}modlog\` to set one.`)
        } else {
            message.guild.channels.cache.get(logChannelID).send(banEmbed).catch(err => client.logger.error(err))
        }
    }
}