const Discord = require('discord.js')
const mongoose = require('mongoose')
const morse = require('morse')

module.exports = {
    name: 'decode',
    description: 'Decodes from morse',
    category: 'general',
    args: true,
    guildOnly: true,
    usage: '[message]',
    async execute(client, message, args) {
        let toBeDecoded = args.join(' ')

        let decoded = morse.decode(toBeDecoded)

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('Encoded')
                .setDescription(`\`\`\`${decoded}\`\`\``)
                .setFooter('Cosmic Events')
                .setColor('c186ff')
                .setTimestamp()
        )
    }
}