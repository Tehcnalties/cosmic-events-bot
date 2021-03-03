const mongoose = require('mongoose')
const Guild = require('../models/guild')
const config = require('../config.json')

module.exports = async (client, member) => {
    const settings = await Guild.findOne({
        guildID: member.guild.id
    }, (err, guild) => {
        if(err) client.logger.error(err)
        if(!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: member.guild.id,
                guildName: member.guild.name,
                prefix: config.prefix,
                modlogID: '',
                mutedID: '',
                messagelogID: '',
                suggestionID: '',
                autoroleID: '',
                welcomeChannel: ''
            })

            newGuild.save()
                .then(result => client.logger.log(result))
                .catch(err => client.logger.error(err))
        }
    })

    const autoRoleID = settings.autoroleID

    if(!autoRoleID) return

    member.roles.add(autoRoleID).catch(err => client.logger.error(err))
}