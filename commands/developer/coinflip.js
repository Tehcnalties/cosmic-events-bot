const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'flip',
    category: 'developer',
    description: 'Alerts members about a scheduled maintenance',
    args: false,
    guildOnly: true,
    async execute(client, message, args) {
        if(message.author.id === '359163540050804738') {
            let noOfFlips = args[0]
            let tails = ''
            let heads = ''

            for(let i = 0; i < noOfFlips; i++) {
                let flip = getRandomNumber(1, 2)
                if(flip === 1) tails++
                if(flip === 2) heads++
            }

            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('Result')
                    .addField('Heads', heads)
                    .addField('Tails', tails)
                    .addField('Total', noOfFlips)
                    .setFooter('Developer')
            )


        } else return message.channel.send(':no_entry: Sorry, only developers can use this command! If you think this is an error, contact a developer.')
    }
}

function getRandomNumber(low, high) {
    let r = Math.floor(Math.random() * (high - low + 1)) + low;
    return r;
}