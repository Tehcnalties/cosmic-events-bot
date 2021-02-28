const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'help',
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

        const help = new Discord.MessageEmbed()
            .setTitle('Commands')
            .setDescription(`To view more information on a specific command, do \`${prefix}help [command name]\`.`)
            .addField('Admin Commands', '`prefix`\n`modlog`\n`status`\n`updatestatus`')
            .addField('Basic Commands', '`help`\n`rules`')
            .addField('Moderator Commands', '`ban`\n`kick`\n`purge`\n`slowmode`\n`unban`\n`embed`')
            .setColor('C279FF')
            .setFooter('Cosmic Events')
            .setTimestamp()
        
        message.channel.send(help)
    }
}