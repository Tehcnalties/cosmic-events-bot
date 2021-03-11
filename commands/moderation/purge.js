const Discord = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')

module.exports = {
    name: 'purge',
    category: 'moderator',
    description: 'Clears the specified number of messages',
    guildOnly: true,
    args: true,
    cooldown: 2,
    aliases: ['clear', 'delmsg'],
    usage: '[amount to clear]',
    async execute(client, message, args) {
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
            }
        })

        const msglogID = settings.messagelogID

        if(message.member.hasPermission('MANAGE_MESSAGES')) {
            const deleteCount = args[0]
            message.channel.messages.fetch({
                limite: deleteCount
            }).then(async (messages) => {
                fs.writeFile('./logs/purge.log', '', function (err) {
                    if (err) client.logger.error(err)
                })
                const arr = messages.array()
                for(let i = 0; i < arr.length; i++) {
                    const curr = arr[i]
                    let str = curr.content.trim()
                    if(str.length > 500) str = str.substring(0, 499) + '...'

                    const strF = '[' + curr.author.tag + '] ' + str + '\n'
                    fs.appendFile('./logs/purge.log', strF, function (err) {
                        if (err) client.logger.error(err)
                    })
                }
                if(!deleteCount || deleteCount < 1 || deleteCount > 250) return message.reply('Please provide a number between 1 and 250 to be purged.')

                await message.delete()

                await message.channel.bulkDelete(deleteCount).then(() => {
                    message.channel.send(`Deleted ${deleteCount} messages!`)
                    const logEmbed = new Discord.MessageEmbed()
                        .setTitle('🗑️ Messages Deleted')
                        .setColor('RED')
                        .addField('Deleted by', `${message.author}`)
                        .addField('In channel', `${message.channel.toString()}`)
                        .addField('Amount Deleted', `${deleteCount}`)
                        .setFooter('botston')
                        .attachFiles(['./logs/purge.log'])
                    
                        if(!settings.messagelogID) {
                            message.channel.send(`You do not have a message logs channel set yet! Use \`${settings.prefix}msglog\` to set one.`)
                        } else {
                            message.guild.channels.cache.get(msglogID).send(logEmbed).catch(err => client.logger.error(err))
                        }
                }).catch(error => message.reply('There was an error while deleting the messages!'))
            }).catch(err => client.logger.error(err))
        } else return message.channel.send(':x: You can\'t use this command!')
    }
}