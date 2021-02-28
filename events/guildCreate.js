const mongoose = require('mongoose')
const Guild = require('../models/guild')
const config = require('../config.json')

module.exports = async (client, guild) => {
    guild = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        guildName: guild.name,
        prefix: config.prefix,
        modlog: ''
    })

    guild.save()
        .then(result => client.logger.log(result))
        .catch(err => client.logger.error(err));

    client.logger.log(`Joined new server ${guild.name} with ID ${guild.id}`)
}