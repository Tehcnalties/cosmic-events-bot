module.exports = {
    name: 'reload',
    category: 'Developers',
    description: 'Reloads a command',
    guildOnly: true,
    args: true,
    cooldown: 0,
    usage: `[command name]`,
    execute(client, message, args) {
        if(message.author.id === '359163540050804738' || message.author.id === '745977987861708890') {
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

            delete require.cache[require.resolve(`./${command.name}.js`)];

            try {
                const newCommand = require(`./${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.channel.send(`Command \`${command.name}\` was reloaded!`);
                client.logger.log(`Command ${command.name} was reloaded by ${message.author.tag}`)
            } catch (error) {
                client.logger.error(error);
                message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
            }
        } else return message.channel.send(':no_entry: Sorry, only developers can use this command! If you think this is an error, contact a developer.')
    }
}