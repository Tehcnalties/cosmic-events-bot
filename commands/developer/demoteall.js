const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'demoteall',
    category: 'developer',
    description: 'demotes all the helpers',
    args: false,
    guildOnly: true,
    async execute(client, message, args) {
        if(message.author.id === '359163540050804738' || message.author.id === '745977987861708890' || message.author.id === '426926009653264384') {
            message.delete()

            const helperRole = message.guild.roles.cache.get('814735733175615508')
            helperRole.members.forEach((member, i) => {
                setTimeout(() => {
                    member.roles.remove(helperRole)
                }, i * 1000);
            })
        } else return message.channel.send(':no_entry: Sorry, only developers can use this command! If you think this is an error, contact a developer.')
    }
}