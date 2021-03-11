const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const Discord = require('discord.js')

module.exports = {
    name: 'mute',
    category: 'moderator',
    description: 'Mutes the chosen member',
    args: true,
    guildOnly: true,
    usage: '[Member] [reason]',
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

        const logChannelID = settings.modlogID
        const mutedRoleID = settings.mutedID

        if(!mutedRoleID) return message.channel.send(`You haven't set a muted role yet! Do \`${settings.prefix}mutedrole\` to set the muted role.`)

        let user = message.mentions.users.first();
        const userMember = message.mentions.members.first()
        let reason = args.slice(1).join(' ')
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

        if(userMember.roles.cache.has(mutedRoleID)) return message.channel.send(':x: This user is already muted!')
        if(user === message.author) return message.channel.send('Why are you trying to mute yourself?')
        if(user === undefined) return message.channel.send('Please specify a user!')
        if(!reason) {
            reason = 'No reason specified'
        }

        const muteEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setThumbnail(user.avatarURL())
            .setAuthor(`${user.username} has been muted!`)
            .addField('Person muted:', `${user.username}`, true)
            .addField('muted by:', `${message.author}`, true)
            .addField('Reason:', `${reason}`, true)
            .addField('User ID:', `${user.id}`)
            .setTimestamp()


        let muteRole = message.guild.roles.cache.get(mutedRoleID);

        userMember.roles.add(muteRole).catch(err => {
            client.logger.error(err)
            message.channel.send(`Couldn't mute ${user}!`)
            return
        })
        user.send(`You have been muted in \`${message.guild.name}\` with reason: ${reason}.`).catch(() => client.logger.log(`Couldn't send DM to user ${user.username}`))
        message.channel.send(`${user} has been muted.`);

        if(!settings.modlogID) {
            message.channel.send(`You do not have a punishment logs channel set yet! Use \`${settings.prefix}modlog\` to set one.`)
        } else {
            message.guild.channels.cache.get(logChannelID).send(muteEmbed).catch(err => client.logger.error(err))
        }
    }
};
