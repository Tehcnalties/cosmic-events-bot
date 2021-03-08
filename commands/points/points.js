const Discord = require('discord.js')
const mongoose = require('mongoose')
const Points = require('../../models/points')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'points',
    category: 'points',
    args: true,
    guildOnly: true,
    usage: '[User] [Action]',
    description: 'Manage points for players',
    async execute(client, message, args) {
        let mentionedMember = message.mentions.users.first()
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(':x: You are lacking the necessary permission `ADMINISTRATOR` to run this command!')

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
                return message.channel.send(`That user is not registered yet!`)
            }
        })

        if(args[1].toLowerCase() === 'add') {
            let addNumber = args[2]
            let balance = points.balance

            if(Number.isInteger(addNumber)) return message.channel.send(':x: That\'s not a whole number!')
            if(addNumber < 1) return message.channel.send(':x: You can\'t add a negative value!')

            let newBalance = Number(balance) + Number(addNumber)

            await points.updateOne({
                balance: newBalance
            }).then(result => client.logger.log(`Updated points for ${mentionedMember}.`)).catch(err => client.logger.error(err))

            client.users.fetch(mentionedMember).then((user) => {
                message.channel.send(`Updated points balance for ${user.tag}.\n\n**Old Balance:** ${balance}\n**New Balance:** ${newBalance}`)
            })
        } else if(args[1].toLowerCase() === 'remove' || args[1].toLowerCase() === 'subtract') {
            let removeNumber = args[2]
            let balance = points.balance

            if(Number.isInteger(removeNumber)) return message.channel.send(':x: That\'s not a whole number!')
            if(removeNumber < 1) return message.channel.send(':x: You can\'t remove a negative value!')
            if(removeNumber > balance) return message.channel.send(':x: You can\'t remove more than someone\'s current balance!')

            let newBalance = Number(balance) - Number(removeNumber)

            await points.updateOne({
                balance: newBalance
            }).then(result => client.logger.log(`Updated points for ${mentionedMember}.`)).catch(err => client.logger.error(err))

            client.users.fetch(mentionedMember).then((user) => {
                message.channel.send(`Updated points balance for ${user.tag}.\n\n**Old Balance:** ${balance}\n**New Balance:** ${newBalance}`)
            })
        }
    }
}