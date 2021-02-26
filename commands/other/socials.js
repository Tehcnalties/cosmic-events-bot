const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'socials',
    args: false,
    guildOnly: false,
    async execute(client, message, args) {
        if(!(message.guild.id === '813578802801541131')) return message.channel.send('This command may only be used in the test server!')

        const socialsEmbed = new Discord.MessageEmbed()
            .setTitle('Ameston\'s Socials')
            .setColor('5181B1')
            .setThumbnail('https://i.imgur.com/dW2dxT4.png')
            .addField('Discord Invite', 'https://discord.com/invite/NQRQVyz')
            .addField('Twitter', 'https://twitter.com/Ameston_Hypixel')
            .addField('Hypixel', 'https://hypixel.net/members/ameston.364915/')
            .addField('TikTok', 'https://www.tiktok.com/@amestonmc')
            .addField('Twitch', 'https://www.twitch.tv/amestonmc')
            .addField('Minecraft IGN', 'Ameston')
            .setFooter('Botston')

        message.react('👍').catch(err => client.logger.error(err))
        message.author.send(socialsEmbed).catch(() => message.reply('I can\'t message you!'))
    }
}