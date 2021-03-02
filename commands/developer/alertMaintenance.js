const Discord = require('discord.js')
module.exports = {
    name: 'alertMaintenance',
    category: 'developer',
    description: 'Warns staff about bot maintenance',
    args: true,
    guildOnly: false,
    async execute(client, message, args) {
        const alertMaintenance = new Discord.MessageEmbed() 
            .setTitle('Maintenance Alert')
            .setDescription(msg.author.username + ' warns of a scheduled bot maintenance!)
            .setColor('#c186ff')
            .setFooter('Cosmic Events')
            .setTimestamp(msg.createdTimestamp);
        msg.channel.send(alertMaintenance);
}
}
