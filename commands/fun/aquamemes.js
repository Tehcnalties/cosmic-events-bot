const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'aquamemes',
    args: false,
    guildOnly: false,
    aliases: ['macro','macros'],
    async execute(client, message, args) {
        if(!(message.guild.id === '813578802801541131')) return message.channel.send('This command may only be used in the test server!')

        const memeArray = ['https://i.imgur.com/ebAXuH4.png','https://i.imgur.com/wPKitF8.png','https://i.imgur.com/Ix9wP8W.png','https://i.imgur.com/Du5aCaq.png','https://i.imgur.com/BI16h8D.png','https://i.imgur.com/0ND7cFc.png','https://i.imgur.com/jB26CTD.png','https://i.imgur.com/VWUmC7D.png','https://i.imgur.com/hbTwjQt.png','https://i.imgur.com/4SVITw2.png']

        const macroMeme = memeArray[Math.floor(Math.random()*memeArray.length)]

        const memeEmbed = new Discord.MessageEmbed()
            .setTitle('AquaKat Macros Meme')
            .setImage(`${macroMeme}`)
            .setColor('d4f1f9')

        message.channel.send(memeEmbed)
    }
}