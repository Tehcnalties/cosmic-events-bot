const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'kq',
    category: 'developer',
    description: 'Alerts members about a scheduled maintenance',
    args: false,
    guildOnly: true,
    async execute(client, message, args) {
        if(message.author.id === '359163540050804738') {
            const v = args[0]
            
            let k = 1 - (v * v) / 30
            let height  = k * 1.5

            let kRound = k.toFixed(3)
            let hRound = height.toFixed(3)

            message.channel.send(`**k:** ${kRound}\n**height:** ${hRound} m`)
            
        } else return message.channel.send(':no_entry: Sorry, only developers can use this command! If you think this is an error, contact a developer.')
    }
}