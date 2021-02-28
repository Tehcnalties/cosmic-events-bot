const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'purge',
    description: 'Clears the specified number of messages',
    guildOnly: true,
    args: true,
    cooldown: 2,
    aliases: ['clear', 'delmsg'],
    usage: '[amount to clear]',
    execute(client, message, args) {
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

                    const strF = curr.author.username + ' ' + str + '\n'
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
                    
                    if(!(message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'deleted-messages'))) return message.channel.send('Please create a channel called `deleted-messages` to log purge logs!')
                    message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'deleted-messages').send(logEmbed)
                }).catch(error => message.reply('There was an error while deleting the messages!'))
            }).catch(err => client.logger.error(err))
        } else return message.channel.send(':x: You can\'t use this command!')
    }
}