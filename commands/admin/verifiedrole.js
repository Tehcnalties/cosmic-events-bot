const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'verifiedrole',
    description: 'Sets the role given when verified',
    category: 'admin',
    args: true,
    guildOnly: true,
    usage: '[role]',
    async execute(client, message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(':x: You are missing the necessary permissions `ADMINISTRATOR` to use this command!')

        let role = message.mentions.roles.first();;

        if(!role) {
            try {
                if (!message.guild.roles.cache.get(args[0])) throw new Error('Can\'t find a role with that ID!')

                role = args[0]

            } catch(error) {
                return message.reply('couldn\'t find a role with that ID!')
            }
        } 

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
                    mutedID: role,
                    messagelogID: '',
                    suggestionID: '',
                    autoroleID: '',
                    welcomeChannel: '',
                    verifiedRole: ''
                })

                newGuild.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))

                return message.channel.send(':x: Your server was not registered in our database, and was just registered. Run this command again to set the autorole.')
            }
        })

        await settings.updateOne({
            verifiedRole: role
        }).then(result => client.logger.log(`Updated verified role for ${message.guild.name} (${message.guild.id})`)).catch(err => client.logger.error(err))

        return message.channel.send(`Verified role has been set to ${role}.`)
    }
}