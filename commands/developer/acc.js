const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'acc',
    category: 'developer',
    description: 'Alerts members about a scheduled maintenance',
    args: false,
    guildOnly: true,
    async execute(client, message, args) {
        if(message.author.id === '359163540050804738') {
            let h1 = args[0]
            let h2 = args[1]
            let h3 = args[2]
            let h4 = args[3]
            let h5 = args[4]
            let h6 = args[5]
            let h7 = args[6]
            let h8 = args[7]
            let h9 = args[8]
            let h10 = args[9]
            let h11 = args[10]

            let c1 = h2 - h1
            let c2 = h3 - h2
            let c3 = h4 - h3
            let c4 = h5 - h4
            let c5 = h6 - h5
            let c6 = h7 - h6
            let c7 = h8 - h7
            let c8 = h9 - h8
            let c9 = h10 - h9
            let c10 = h11 - h10

            let a1 = c1 / 0.05
            let a2 = c2 / 0.05
            let a3 = c3 / 0.05
            let a4 = c4 / 0.05
            let a5 = c5 / 0.05
            let a6 = c6 / 0.05
            let a7 = c7 / 0.05
            let a8 = c8 / 0.05
            let a9 = c9 / 0.05
            let a10 = c10 /0.05

            message.channel.send(
                new Discord.MessageEmbed()
                    .addField('0 to 5', a1)
                    .addField('5 to 10', a2)
                    .addField('10 to 15', a3)
                    .addField('15 to 20', a4)
                    .addField('20 to 25', a5)
                    .addField('25 to 30', a6)
                    .addField('30 to 35', a7)
                    .addField('35 to 40', a8)
                    .addField('40 to 45', a9)
                    .addField('45 to 50', a10)
                )


            
        } else return message.channel.send(':no_entry: Sorry, only developers can use this command! If you think this is an error, contact a developer.')
    }
}