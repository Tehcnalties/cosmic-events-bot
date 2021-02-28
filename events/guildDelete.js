const mongoose = require('mongoose')
const Guild = require('../models/guild')

module.exports = async (client, guild) => {
    Guild.findOneAndDelete({
        guildID: guild.id
    }, (err, res) => {
        if(err) client.logger.error(err)
        client.logger.log(`Removed from server ${guild.name} with ID ${guild.id}`)
    })
}