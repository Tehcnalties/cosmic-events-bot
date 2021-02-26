const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'stream',
    aliases: ['streaminfo','schedule','streamschedule'],
    args: false,
    guildOnly: false,
    async execute(client, message, args) {
        if(!(message.guild.id === '813578802801541131')) return message.channel.send('This command may only be used in the test server!')

        const streamEmbed = new Discord.MessageEmbed()
            .setTitle('Ameston\'s Stream Schedule')
            .setColor('5181B1')
            .setDescription('Ameston\'s Twitch channel is https://www.twitch.tv/amestonmc.')
            .setThumbnail('https://i.imgur.com/dW2dxT4.png')
            .addField('Sunday', '8PM CDT')
            .addField('Monday', 'No Stream')
            .addField('Tuesday', '8PM CDT')
            .addField('Wedsnesday', '8PM CDT')
            .addField('Thursday', 'No Stream')
            .addField('Friday', '8PM CDT')
            .addField('Saturdays', '8PM CDT')
            .addField('Stream Information', 'Ameston\'s streams typically last around 3 1/2 hours, although actual length may vary by an hour.')
            .addField('What\'s CDT in my timezone?', 'If you\'re unsure of timezone conversion, check [here](https://www.timeanddate.com/worldclock/converter.html?iso=20201128T000000&p1=tz_ct).')
            .setFooter('Botston')

        message.react('👍').catch(err => client.logger.error(err))    
        message.author.send(streamEmbed).catch(() => message.reply('I can\'t message you!'))
    }
}