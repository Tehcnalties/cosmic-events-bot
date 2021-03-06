const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'ticket',
    args: true,
    guildOnly: true,
    usage: '[setup]',
    async execute(client, message, args) {
        if(!message.author.hasPermission('ADMINISTRATOR')) return

        let ticketNumber = 0;
        ticketNumber = ticketNumber.toFixed(0000)
        var userList = 'USER-COLLECTION:'
        if(args[0] === 'setup') {
            const ticketEmoji = '🎫';
            const cancelEmoji = '⛔';
            var channelList = ''
            var ticketID = 0;
            var targetUser;
            const setupMessageEmbed = new Discord.MessageEmbed() 
                .setTitle('Create Support Ticket')
                .setDescription('React to start a new support ticket! A staff member will consult with you shortly')
                .addField('Warning', 'Troll tickets will result in punishment', false)
                .setColor('#c186ff')
                .setFooter('Cosmic Events • Ticket Tool');
            let setupMessage = await msg.channel.send(setupMessageEmbed);

            setupMessage.react(ticketEmoji)
        }
    }
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}