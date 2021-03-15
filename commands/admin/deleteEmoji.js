const Discord = require('discord.js')
module.exports = {
    name: 'deleteemoji',
    args: true,
    guildOnly: true,
    category: 'admin',
    description: 'Deletes an emoji from the server',
    usage: '[emoji/name]',
    async execute(client, message, args, Discord) {
        const noArgsEmbed = new Discord.MessageEmbed() 
            .setTitle('Command Error')
            .addField('Reason', '`No arguments provided`', false)
            .addField('Usage', '`' + this.usage + '`', false)
            .setColor('RED')

        if(!message.member.hasPermission('MANAGE_EMOJIS'))  {
            return message.channel.send(':x: You are lacking the necessary permissions `MANAGE_EMOJIS` to use this command!')
        }

        if(!args[0]) {
            return message.channel.send(noArgsEmbed)
        }
        
        const emoji = args[0];
        var emojiName = emoji;
        if(emoji.includes(':')) {
            const regex = /:[a-zA-Z0-9]+:/
            emojiName = (emoji.match(regex)).toString()
            emojiName = emojiName.replace(/:/g, '')
        }
        var guildEmoji = message.guild.emojis.cache.find(e => e.name == emojiName) 
        console.log(guildEmoji)

        if(guildEmoji) {
            await guildEmoji.delete();
            const deletedEmojiEmbed = new Discord.MessageEmbed()
                .setTitle(`✅ Successfully deleted an emoji called :${guildEmoji.name}:`)
                .setColor('GREEN')
            message.channel.send(deletedEmojiEmbed)
        }

        else if(!guildEmoji) {
            const nEmtEmbed = new Discord.MessageEmbed() 
                .setTitle('Command Error')
                .addField('Reason', '`Could not find the specified emoji`', false)
                .addField('Usage', '`' + this.usage + '`', false)
                .setColor('RED')
            message.channel.send(nEmtEmbed)

        }
//hi person reading this - bear            

    }
}
