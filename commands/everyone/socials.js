const config = require('../../config.json')
const apikey = config.hypixel_api_key
const fetch = require('node-fetch')
const Discord = require('discord.js')

module.exports = {
    name: 'socials',
    category: 'general',
    args: true,
    guildOnly: true,
    usage: '[IGN]',
    description: 'Shows you the socials of a player',
    aliases: ['playerinfo'],
    async execute(client, message, args) {
        const playerName = args[0]

        if(isValidName(playerName) === false) return message.channel.send('That\'s not a valid IGN!')
        
        await fetch(`https://api.slothpixel.me/api/players/${playerName}?key=${apikey}`).then(result => {
            result.json().then(async resultJSON => {
                const playerUUID = resultJSON.uuid
                const playerNameCases = resultJSON.username
                let playerRank = ''
                let embedColor = ''
                let prefix = ''
                
                if(resultJSON.rank === 'VIP') {
                    playerRank = 'VIP'
                    embedColor = '55ff55'
                    prefix = playerRank
                } else if(resultJSON.rank === 'VIP_PLUS') {
                    playerRank = 'VIP+'
                    embedColor = '55ff55'
                    prefix = playerRank
                } else if(resultJSON.rank === 'MVP') {
                    playerRank = 'MVP'
                    embedColor = '55ffff'
                    prefix = playerRank
                } else if(resultJSON.rank === 'MVP_PLUS') {
                    playerRank = 'MVP+'
                    embedColor = '55ffff'
                    prefix = playerRank
                } else if(resultJSON.rank === 'MVP_PLUS_PLUS') {
                    playerRank = 'MVP++'
                    embedColor = 'ffaa00'
                    prefix = playerRank
                } else if(resultJSON.rank === 'YOUTUBER') {
                    playerRank = 'Youtuber'
                    embedColor = 'aa0000'
                    prefix = 'YOUTUBER'
                } else if(resultJSON.rank === 'HELPER') {
                    playerRank = 'Helper'
                    embedColor = '5555ff'
                    prefix = 'HELPER'
                } else if(resultJSON.rank === 'MODERATOR') {
                    playerRank = 'Moderator'
                    embedColor = '00aa00'
                    prefix = 'MOD'
                } else if(resultJSON.rank === 'ADMIN') {
                    playerRank = 'Admin'
                    embedColor = 'aa0000'
                    prefix = 'ADMIN'
                } else {
                    playerRank = 'Non'
                    embedColor = 'c186ff'
                    prefix = 'NON'
                }

                let twitter = resultJSON.links.TWITTER
                let youtube = resultJSON.links.YOUTUBE
                let instagram = resultJSON.links.INSTAGRAM
                let twitch = resultJSON.links.TWITCH
                let discord = resultJSON.links.DISCORD
                let hypixel = resultJSON.links.HYPIXEL

                if(!twitter) twitter = 'Not Linked'
                if(!youtube) youtube = 'Not Linked'
                if(!instagram) instagram = 'Not Linked'
                if(!twitch) twitch = 'Not Linked'
                if(!discord) discord = 'Not Linked'
                if(!hypixel) hypixel = 'Not Linked'

                let playerInfoEmbed = new Discord.MessageEmbed()
                    .setTitle(`[${prefix}] ${playerNameCases}`)
                    .setThumbnail(`https://crafatar.com/renders/body/${playerUUID}?overlay`)
                    .setDescription(`Socials for ${playerNameCases} (\`${playerUUID}\`)`)
                    .addField('Twitter', twitter)
                    .addField('Youtube', youtube)
                    .addField('Instagram', instagram)
                    .addField('Twitch', twitch)
                    .addField('Discord', discord)
                    .addField('Hypixel', hypixel)
                    .setColor(embedColor)
                    .setFooter('Cosmic Events')
                    .setTimestamp()

                message.channel.send(playerInfoEmbed)
            })
        })
    }
}

function isValidName(string) {
    let validCharacters = /^[0-9a-zA-Z_]+$/
    if(string.match(validCharacters)) {
        return true
    } else {
        return false
    }
}