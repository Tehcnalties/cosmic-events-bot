const Discord = require('discord.js')

module.exports = {
    name: 'unban',
    category: 'moderator',
    description: 'Unbans a user from the server',
    args: true,
    guildOnly: true,
    usage: '[User ID]',
    async execute(client, message, args) {
        if(!(message.member.hasPermission('BAN_MEMBERS'))) return message.channel.send(':x: You can\'t use this command!')

        const params = message.content.split(' ').slice(1)
        let user = args[0]

        // Check if an user mention exists in this message
        // if (!user) {
        //     try {
        //         // Check if a valid userID has been entered instead of a Discord user mention
        //         if (!message.guild.members.cache.get(params.slice(0, 1).join(' '))) throw new Error('Can\'t find a member with that userID')
        //         // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
        //         user = message.guild.members.cache.get(params.slice(0, 1).join(' '))
        //         user = user.user
        //     } catch (error) {
        //         return message.reply('You must use a user ID!')
        //     }
        // }

        if(user === message.author.id) return message.channel.send('You aren\'t banned.')
        if(user === undefined) return message.channel.send('Please specify a user!')

        const banList = await message.guild.fetchBans();
        const bannedUser = banList.find(user => user.id === user.id);

        message.guild.members.unban(user).then(message.channel.send('User successfully unbanned!'))
    }
}