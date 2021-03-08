const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'help',
    category: 'general',
    description: 'Shows this message',
    args: false,
    guildOnly: false,
    aliases: ['commands'],
    async execute(client, message, args) {
        let prefix = ''

        if(message.guild === null) {
            prefix = config.prefix
        } else {
                const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if(err) client.logger.error(err)
            if(!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.prefix,
                    modlogID: ''
                })
    
                newGuild.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))
    
                return message.channel.send(':x: Your server was not registered in our database, and was just registered.')
            }
        })
    
        prefix = settings.prefix
        }

        const general = []
        const moderation = []
        const admin = []
        const points = []
        const { commands } = message.client

        if(!args.length) {
            commands.forEach((command) => {
                if(command.category === 'developer') return
                if(command.category !== 'general') return
                general.push(`\`${command.name}\`\n`)
            })
            commands.forEach((command) => {
                if(command.category === 'developer') return
                if(command.category !== 'moderator') return
                moderation.push(`\`${command.name}\`\n`)
            })
            commands.forEach((command) => {
                if(command.category === 'developer') return
                if(command.category !== 'admin') return
                admin.push(`\`${command.name}\`\n`)
            })
            commands.forEach((command) => {
                if(command.category === 'developer') return
                if(command.category !== 'points') return
                points.push(`\`${command.name}\`\n`)
            })

            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('Command Help')
                    .setDescription(`To see more information on commands, do \`${prefix}help [command name]\` to view more information.`)
                    .addField('General Commands', general.join(' '), true)
                    .addField('Moderation Commands', moderation.join(' '), true)
                    .addField('Admin Commands', admin.join(' '), true)
                    .addField('Point Commands', points.join(' '), true)
                    .setColor('c186ff')
                    .setFooter('Cosmic Events')
                    .setTimestamp()
            )
        } 
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if(!command) return message.reply(`couldn't find that command! Try doing \`${prefix}help\` to view all of the available commands.`)

        const commandHelp = new Discord.MessageEmbed()
            .setTitle(`${command.name}`)
            .setColor('c186ff')
            .setFooter('Cosmic Events')
            .setTimestamp()

        if(command.aliases) commandHelp.addField('Aliases', `\`${command.aliases.join(', ')}\``)
        if(command.description) commandHelp.setDescription(command.description)
        if(command.usage) commandHelp.addField('Usage:', `\`${prefix}${command.name} ${command.usage}\``)

        message.channel.send(commandHelp)
    }
}