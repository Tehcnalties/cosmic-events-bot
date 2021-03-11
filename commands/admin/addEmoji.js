const Discord = require('discord.js')
module.exports = {
    name: 'addemoji',
    description: 'Adds an emoji to the server',
    usage: 'addemoji [url/path/buffer] [name]',
    async execute(client, message, args, Discord) {
        const emoji = args[0]
        var name = args[1]
        if(!emoji) {
            const addEmojiEmbed = new Discord.MessageEmbed()
                .setTitle('Command Error')
                .addField('Error', '`No arguments were provided`', false)
                .addField('Usage', '`' + this.usage + '`')
                .setColor('RED')
            message.channel.send(addEmojiEmbed)
            console.log(emoji)
            console.log('Could not create a new emoji, Reason: No arguments')
        }
        if(emoji && !name) {
            name = (Math.floor(Math.random() * 10000000)).toString()
            console.log('Missing Argument: Name')
        }
        await message.guild.emojis.create(emoji, name)
        var newEmoji = message.guild.emojis.cache.find(e => e.name === name);
        if(newEmoji) {
            console.log(`Confirming ${name}`)
            const successEmojiEmbed = new Discord.MessageEmbed()
                .setTitle(`✅ Successfully added a new emoji called ${name}`)
                .setColor('GREEN')
            if(!args[1]) {
                successEmojiEmbed.setDescription('A random integer value was assigned to the emoji because `name (args[1])` was missing\nTo see usage: Use `help addemoji`')
                console.log('chungus meat')
            }
            message.channel.send(successEmojiEmbed)
        }
    }
}
