const apikey = config.hypixel_api_key
const fetch = require('node-fetch')
const Discord = require('discord.js')

module.exports = {
    name: 'player',
    args: true,
    guildOnly: true,
    usage: '[IGN]',
    description: 'Shows you the Hypixel information on a player',
    aliases: ['playerinfo'],
    async execute(client, message, args) {
        const playerName = args[0]

        
    }
}