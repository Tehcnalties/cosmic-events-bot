const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'help',
    args: false,
    guildOnly: false,
    aliases: ['commands'],
    async execute(client, message, args) {
        message.channel.send('WIP')
    }
}