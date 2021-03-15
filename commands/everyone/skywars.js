const config = require('../../config.json')
const apikey = config.hypixel_api_key
const fetch = require('node-fetch')
const Discord = require('discord.js')

module.exports = {
    name: 'skywars',
    category: 'general',
    args: true,
    guildOnly: true,
    usage: '[IGN]',
    description: 'Shows you the skywars stats of a player',
    aliases: ['sw'],
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

                let coins = resultJSON.stats.SkyWars.coins.toLocaleString()
                let swStars = resultJSON.stats.SkyWars.level.toLocaleString()
                let winsTotal = resultJSON.stats.SkyWars.wins.toLocaleString()
                let kills = resultJSON.stats.SkyWars.kills.toLocaleString()
                let deaths = resultJSON.stats.SkyWars.deaths.toLocaleString()
                let killDeath = resultJSON.stats.SkyWars.kill_death_ratio.toLocaleString()
                let winLose = resultJSON.stats.SkyWars.win_loss_ratio.toLocaleString()
                let assists = resultJSON.stats.SkyWars.assists.toLocaleString()
                let soulsGather = resultJSON.stats.SkyWars.souls_gathered.toLocaleString()
                let soulsCurrent = resultJSON.stats.SkyWars.souls.toLocaleString()
                let soulWellUse = resultJSON.stats.SkyWars.soul_well_uses.toLocaleString()

                const swStats = new Discord.MessageEmbed()
                    .setTitle(`Skywars stats for [${prefix}] ${playerNameCases}`)
                    .setThumbnail(`https://crafatar.com/renders/body/${playerUUID}?overlay`)
                    .setDescription(`Now showing statiscs for ${playerNameCases} (\`${playerUUID}\`)`)
                    .setColor(embedColor)
                    .addField('Total Coins', coins, true)
                    .addField('Stars', swStars, true)
                    .addField('Soul Well Uses', soulWellUse, true)
                    .addField('Assists', assists, true)
                    .addField('Wins', winsTotal, true)
                    .addField('Win/Lose Ratio', winLose, true)
                    .addField('Kills', kills, true)
                    .addField('Deaths', deaths, true)
                    .addField('Kill/Death Ratio', killDeath, true)
                    .addField('Total souls gathered', soulsGather, true)
                    .addField('Current souls gatherd', soulsCurrent, true)
                    .setFooter('Cosmic Events')
                    .setTimestamp()

                message.channel.send(swStats)
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