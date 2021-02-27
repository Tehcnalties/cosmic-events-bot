const Discord = require('discord.js')

module.exports = {
    name: 'slowmode',
    aliases: 'sm',
    usage: '[Seconds]',
    args: true,
    guildOnly: true,
    async execute(client, message, args) {
        if(!(message.member.hasPermission('MANAGE_CHANNELS'))) return message.channel.send(':x: You can\'t use this command!')
        const seconds = args[0]

        if(seconds < 0 || seconds > 26000) return message.channel.send('The slowmode must be between 0 and 26000 seconds!')
        if(Number.isInteger(seconds) === 'false') return message.channel.send('The slowmode must be an integer number between 0 and 26000!')

        message.channel.setRateLimitPerUser(seconds).then(message.channel.send(`Channel slowmode set to ${seconds} seconds.`))
    }
}