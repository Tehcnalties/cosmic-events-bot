const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')

module.exports = {
    name: 'kick',
    category: 'moderator',
    description: 'Kicks a player from the server',
    args: true,
    guildOnly: true,
    usage: '[Member] [reason]',
    async execute(client, message, args) {
        if(!(message.member.hasPermission('KICK_MEMBERS'))) return message.channel.send(':x: You can\'t use this command!')

        let invite = await message.channel.createInvite(
            {
              maxAge: 604800, // maximum time for the invite, in milliseconds
              maxUses: 1 // maximum times it can be used
            }
        )

        const params = message.content.split(' ').slice(1)
        let user = message.mentions.users.first()
        let reason = params.slice(1).join(' ')
        const mmember = message.mentions.members.first()

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

        if(user === message.author) return message.channel.send('Why are you trying to kick yourself?')
        if(user === undefined) return message.channel.send('Please specify a user!')
        if(!reason) {
            reason = 'No reason specified'
        }
        if (message.member.roles.highest.position < mmember.roles.highest.position) return message.channel.send('You cannot kick someone with a higher role than you.')

        if(!message.guild.member(user).kickable) return message.channel.send(':x: I can\'t kick this user!')
        user.send(`You have been kicked from \`${message.guild.name}\` with reason: ${reason}.\nRejoin the server at ${invite}.`).catch(() => client.logger.log(`Can't send DM to ${user.username}!`))
        message.guild.member(user).kick(`${message.author.username} - ${reason}`)
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
    }
}