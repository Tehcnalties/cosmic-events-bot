const config = require('../../config.json')
const apikey = config.hypixel_api_key
const fetch = require('node-fetch')
const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const guild = require('../../models/guild')

module.exports = {
    name: 'verify',
    description: 'Verifies the user',
    args: true,
    guildOnly: true,
    usage: '[IGN]',
    async execute(client, message, args) {
        const playerName = args[0]

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if(err) client.logger.error(err)
            if(!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.prefix,
                    modlogID: '',
                    mutedID: '',
                    messagelogID: '',
                    suggestionID: '',
                    autoroleID: '',
                    welcomeChannel: '',
                    verifiedRole: ''
                })
    
                newGuild.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))
    
                return message.channel.send(':x: Your server was not registered in our database, and was just registered.')
            }
        })

        if(!settings.verifiedRole) return message.channel.send(':x: This server has not set a verified role yet.')
        if(message.member.roles.cache.has(settings.verifiedRole)) return message.channel.send(':x: You are already verified!')

        const socials = fetch(`https://api.slothpixel.me/api/players/${playerName}?key=${apikey}`).then(result => {
            result.json().then(async resultJSON => {
                const playerDiscord = resultJSON.links.DISCORD

                if(!playerDiscord) return message.channel.send(`:x: This account does not have a linked discord!`)
                if(!(playerDiscord === message.author.tag)) message.channel.send(`:x: That account is linked to \`${playerDiscord}\`!`)
                if(playerDiscord === message.author.tag) {
                    const verifyEmbed = new Discord.MessageEmbed()
                        .setTitle('Verified!')
                        .setColor(config.default_color)
                        .setDescription(`:white_check_mark: Verified you as ${resultJSON.username}!`)
                        .setFooter('Cosmic Events')
                        .setTimestamp()
                    
                    await message.member.setNickname(resultJSON.username).catch(err => message.channel.send(`:x: Couldn't change your nickname!`))
                    message.member.roles.add(settings.verifiedRole).catch(err => client.logger.error(`Failed to assign verified role to ${message.author.tag} in ${message.guild.id}`))

                    message.channel.send(verifyEmbed)
                }
            })
        })
    }
}