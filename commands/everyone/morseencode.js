const Discord = require('discord.js')
const mongoose = require('mongoose')
const morse = require('morse')

module.exports = {
    name: 'encode',
    description: 'Encodes into morse',
    category: 'general',
    args: true,
    guildOnly: true,
    usage: '[message]',
    async execute(client, message, args) {
        let toBeEncoded = args.join(' ')

        let encoded = morse.encode(toBeEncoded)

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('Encoded')
                .setDescription(`\`\`\`${encoded}\`\`\``)
                .setFooter('Cosmic Events')
                .setColor('c186ff')
                .setTimestamp()
        )
    }
}