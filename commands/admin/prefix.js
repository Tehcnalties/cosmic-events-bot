const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const config = require('../../config.json')

module.exports = {
    name: 'prefix',
    args: false,
    guildOnly: true,
    usage: '[New Prefix]',
    async execute(client, message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(':x: You are missing the necessary permissions `ADMINISTRATOR` to use this command!')

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
                    modlogID: '',
                })

                newGuild.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))

                return message.channel.send(':x: Your server was not registered in our database, and was just registered. Run this command again to set the prefix.')
            }
        })

        if(args.length < 1) {
            return message.channel.send(`Your current prefix is \`${settings.prefix}\`.`)
        } else await settings.updateOne({
            prefix: args[0]
        })

        return message.channel.send(`:white_check_mark: Your prefix has been updated to \`${args[0]}\`!`)
    }
}