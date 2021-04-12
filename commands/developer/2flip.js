const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'flip2',
    category: 'developer',
    description: 'Alerts members about a scheduled maintenance',
    args: false,
    guildOnly: true,
    async execute(client, message, args) {
        if(message.author.id === '359163540050804738') {
            let noOfFlips = args[0]
            let tailstails = ''
            let headsheads = ''
            let headtails = ''

            for(let i = 0; i < noOfFlips; i++) {
                let flipOne = getRandomNumber(1, 2)
                let flipTwo = getRandomNumber(1, 2)
                
                if(flipOne === 1 && flipTwo === 1) tailstails++
                if(flipOne === 2 && flipTwo === 2) headsheads++
                if((flipOne === 1 && flipTwo === 2) || (flipOne === 2 && flipTwo === 1)) headtails++
            }

            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('Result')
                    .addField('Heads & Heads', headsheads)
                    .addField('Tails & Tails', tailstails)
                    .addField('Tails & Heads or Heads & Tails', headtails)
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