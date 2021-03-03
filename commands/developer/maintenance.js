const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'maintenance',
    category: 'developer',
    description: 'Alerts members about a scheduled maintenance',
    args: false,
    guildOnly: true,
    async execute(client, message, args) {
        if(message.author.id === '359163540050804738' || message.author.id === '745977987861708890' || message.author.id === '426926009653264384') {
            message.delete()

            const maintenanceReason = args.join(' ')
            
            const alertMaintenance = new Discord.MessageEmbed() 
                .setTitle('Maintenance Alert')
                .setDescription(message.author.username + ' warns of a scheduled bot maintenance!')
                .setColor('#c186ff')
                .setFooter('Cosmic Events')
                .setTimestamp()
            if(maintenanceReason) alertMaintenance.addField('Reason', maintenanceReason)

            message.channel.send(alertMaintenance); 
        } else return message.channel.send(':no_entry: Sorry, only developers can use this command! If you think this is an error, contact a developer.')
    }
}