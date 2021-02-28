const Discord = require('discord.js')
const mongoose = require('mongoose')
const Status = require('../../models/status')
const config = require('../../config.json')

module.exports = {
    name: 'status',
    category: 'admin',
    args: true,
    guildOnly: true,
    usage: '[PLAYING/WATCHING/STREAMING] [Message]',
    async execute(client, message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(':x: You are missing the necessary permissions `ADMINISTRATOR` to use this command!')
        if(args.slice(1).join(' ') === '') return message.channel.send('The status cannot be empty!')
        const typeArray = ['playing','watching','streaming']
        if(typeArray.some(word => args[0].toLowerCase() === word)) {
            const settings = await Status.findOne({
                id: 'COSMIC_BOT_STATUS'
            }, (err, guild) => {
                if(err) client.logger.error(err)
                if(!guild) {
                    const newStatus = new Status({
                        _id: mongoose.Types.ObjectId(),
                        guildID: message.guild.id,
                        type: '',
                        message: '',
                        id: 'COSMIC_BOT_STATUS'
                    })
    
                    newStatus.save()
                        .then(result => client.logger.log(result))
                        .catch(err => client.logger.error(err))
    
                    return message.channel.send(':x: Your server was not registered in our database, and was just registered. Run this command again to set the prefix.')
                }
            })
    
            await settings.updateOne({
                type: args[0].toUpperCase(),
                message: args.slice(1).join(' ')
            })

            client.user.setActivity(args.slice(1).join(' '), {
                type: args[0].toUpperCase()
            })

            message.channel.send(':white_check_mark: The bot status has been updated!')
        } else return message.channel.send('The first argument must be PLAYING, WATCHING, or STREAMING!')
    }
}