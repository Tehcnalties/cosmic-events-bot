const Discord = require('discord.js')
const mongoose = require('mongoose')
const Points = require('../../models/points')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'balance',
    category: 'points',
    description: 'Shows you the balance of a person',
    args: false,
    guildOnly: true,
    usage: '[user]',
    aliases: ['bal'],
    async execute(client, message, args) {
        if(!args[0]) {
            const points = await Points.findOne({
                userID: message.author.id
            }, (err, user) => {
                if(err) client.logger.error(err)
                if(!user) {
                    return message.channel.send(`You are not registered yet!`)
                }
            })

            let balance = points.balance
            const balEmbed = new Discord.MessageEmbed()
                .setTitle('Balance')
                .setDescription(`${message.author}, you currently have **${balance}** points.`)
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setColor('c186ff')
                .setFooter('Cosmic Events')
                .setTimestamp()
            
            message.channel.send(balEmbed)
        } else {
            let mentionedMember = message.mentions.users.first()

            if(!mentionedMember) {
                await client.users.fetch(args[0]).then((user) => {
                    mentionedMember = args[0]
                }).catch(err => message.channel.send(':x: Not a valid user ID!'))
            } else if(mentionedMember) {
                mentionedMember = mentionedMember.id
            }

            const points = await Points.findOne({
                userID: mentionedMember
            }, (err, user) => {
                if(err) client.logger.error(err)
                if(!user) {
                    return message.channel.send(`You are not registered yet!`)
                }
            })

            client.users.fetch(mentionedMember).then((user) => {
                let balance = points.balance
                const balEmbed = new Discord.MessageEmbed()
                    .setTitle('Balance')
                    .setDescription(`${user} has **${balance}** points.`)
                    .setAuthor(user.tag, user.avatarURL())
                    .setColor('c186ff')
                    .setFooter('Cosmic Events')
                    .setTimestamp()
                
                message.channel.send(balEmbed)
            })

            
        }
        
    }
}