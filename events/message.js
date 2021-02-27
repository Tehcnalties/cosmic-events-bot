const Discord = require('discord.js');
const { time } = require('console');
const config = require('../config.json')
const mongoose = require('mongoose')
const Guild = require('../models/guild')

module.exports = async (client, message) => {
    const cooldowns = new Discord.Collection();
    let prefix = ''

    if(message.guild === null) {
        prefix = config.prefix
    } else {
            const settings = await Guild.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if(err) client.logger.error(err)
        if(!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: config.prefix,
                modlogID: ''
            })

            newGuild.save()
                .then(result => client.logger.log(result))
                .catch(err => client.logger.error(err))

            return message.channel.send(':x: Your server was not registered in our database, and was just registered.')
        }
    })

    prefix = settings.prefix
    }

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/)
    const commandName = args.shift().toLowerCase();
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return message.channel.send(`That's not a valid command, ${message.author}! Try doing \`${prefix}help\` to view the commands.`)

    if(command.guildOnly && message.channel.type !== 'text') {
        return message.reply('This command can\'t be used here! Try running it in a server.');
    }

    if(command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`

        if(command.usage) {
            reply += `\nThe proper usage for this command would be:\n\`${prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply)
    }

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if(timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing this command!`)
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args)
    } catch (error) {
        client.logger.error(error);
        message.reply('there was an error trying to run that command! If this keeps happening, please contact a developer.')
    }

    if(message.guild === null) {
        client.logger.cmd(`Command ${command.name} was ran by ${message.author.tag} in DMs`)
    } else{
        client.logger.cmd(`Command ${command.name} was ran by ${message.author.tag} in ${message.guild.id}`)
    }
}