const config = require('../../config.json')
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
                }


                let firstLogin = resultJSON.first_login
                let lastLogin = resultJSON.last_login
                let lastLogout = resultJSON.last_logout

                if(!resultJSON.first_login) {
                    firstLogin = 0
                }
                if(!resultJSON.last_login) {
                    lastLogin = 0
                }
                if(!resultJSON.last_logout) {
                    lastLogout = 0
                }

                let firstLoginFormatted = timeConverter(firstLogin)
                let lastLoginFormatted = timeConverter(lastLogin)
                let lastLogoutFormatted = timeConverter(lastLogout)

                let playerInfoEmbed = new Discord.MessageEmbed()
                    .setTitle(`[${prefix}] ${playerNameCases}`)
                    .setThumbnail(`https://crafatar.com/renders/body/${playerUUID}?overlay`)
                    .setDescription(`Player information for ${playerNameCases} (\`${playerUUID}\`)`)
                    .setColor(embedColor)
                    .addField('Rank', playerRank, true)
                    .addField('Level', resultJSON.level.toLocaleString(), true)
                    .addField('Karma', resultJSON.karma.toLocaleString(), true)
                    .addField('First Login', firstLoginFormatted, true)
                    .addField('Last Login', lastLoginFormatted, true)
                    .addField('Last Logout', lastLogoutFormatted, true)
                    .addField('Achievement Points', resultJSON.achievement_points.toLocaleString(), true)
                    .addField('Quests Completed', resultJSON.quests_completed.toLocaleString(), true)
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

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();

    if(min < 10) {
        min = '0' + min
    }
    if(sec < 10) {
        sec = '0' + sec
    }

    var time = month + ' ' + date + ', ' + year + '; ' + hour + ':' + min + ':' + sec ;
    return time;
  }