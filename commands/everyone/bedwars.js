const config = require('../../config.json')
const apikey = config.hypixel_api_key
const fetch = require('node-fetch')
const Discord = require('discord.js')

module.exports = {
    name: 'bedwars',
    category: 'general',
    args: true,
    guildOnly: true,
    usage: '[IGN]',
    description: 'Shows you the bedwars stats of a player',
    aliases: ['bw'],
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

                let coins = resultJSON.stats.BedWars.coins.toLocaleString()
                let bwStars = resultJSON.stats.BedWars.level.toLocaleString()
                let winsTotal = resultJSON.stats.BedWars.wins.toLocaleString()
                let kills = resultJSON.stats.BedWars.kills.toLocaleString()
                let deaths = resultJSON.stats.BedWars.deaths.toLocaleString()
                let killDeath = resultJSON.stats.BedWars.k_d.toLocaleString()
                let winLose = resultJSON.stats.BedWars.w_l.toLocaleString()
                let bedBreak = resultJSON.stats.BedWars.beds_broken.toLocaleString()
                let killsFinal = resultJSON.stats.BedWars.final_kills.toLocaleString()
                let killDeathFinal = resultJSON.stats.BedWars.final_k_d.toLocaleString()
                let winstreak = resultJSON.stats.BedWars.winstreak.toLocaleString()

                const bwStats = new Discord.MessageEmbed()
                    .setTitle(`Bedwars stats for [${prefix}] ${playerNameCases}`)
                    .setThumbnail(`https://crafatar.com/renders/body/${playerUUID}?overlay`)
                    .setDescription(`Now showing statiscs for ${playerNameCases} (\`${playerUUID}\`)`)
                    .setColor(embedColor)
                    .addField('Total Coins', coins, true)
                    .addField('Stars', bwStars, true)
                    .addField('Wins', winsTotal, true)
                    .addField('Win/Lose Ratio', winLose, true)
                    .addField('Beds Broken', bedBreak, true)
                    .addField('Current Winstreak', winstreak, true)
                    .addField('Kills', kills, true)
                    .addField('Deaths', deaths, true)
                    .addField('Kill/Death Ratio', killDeath, true)
                    .addField('Final Kills', killsFinal, true)
                    .addField('Final Kill/Death Ratio', killDeathFinal, true)
                    .setFooter('Cosmic Events')
                    .setTimestamp()

                message.channel.send(bwStats)
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