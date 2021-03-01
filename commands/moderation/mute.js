module.exports = {
    name: 'mute',
    args: true,
    guildOnly: true,
    usage: '[Member] [reason]',
    async execute(client, message, args) {
        if(!(message.member.hasPermission('KICK_MEMBERS'))) return message.channel.send(':x: You can\'t use this command!')

        const target = message.mentions.users.first();
        if(target){
            let mainRole = message.guild.roles.cache.find(role => role.name === 'member');
            let muteRole = message.guild.roles.cache.find(role => role.name === 'muted');

            let memberTarget= message.guild.members.cache.get(target.id);

            memberTarget.roles.remove(mainRole.id);
            memberTarget.roles.add(muteRole.id);
            message.channel.send(`<@${memberTarget.user.id}> has been muted`);
        } else{
            message.channe.send('Cant find that member!');
        }
    }
};
