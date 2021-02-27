const Discord = require('discord.js')
const { execute } = require('../moderation/purge')

module.exports = {
    name: 'rules',
    args: false,
    guildOnly: false,
    async execute(client, message, args) {
        const rulesV1 = new Discord.MessageEmbed()
            .setTitle('｡･:*:･ﾟ★,｡･:*:･ﾟ☆ Rules ｡･:*:･ﾟ★,｡･:*:･ﾟ☆')
            .setDescription(`Please make sure to read and understand all of these rules!`)
            .setColor('C279FF')
            .addField('｡･:*:･ﾟ★,｡･:*:･ﾟ☆ Rules ｡･:*:･ﾟ★,｡･:*:･ﾟ☆', '> Respecting players means that players should not create negative experiences for others.\n\n**Examples of behavior that __is not__ allowed:**\n\n・Advertising other servers or giveaways\n・Spamming messages, emotes, or reactions\n・Rude or inappropriate behavior\n・Using inappropriate concepts\n・Discriminating a certain group of people due to race, color, religion, ethnicity, beliefs, or disabilities\n・Threatening other players beyond being rude\n・Negative references, such as bringing up people or worldly events that have a negative impact on humanity or society\n・Scamming, attempting to rob someone for something of value\n・Using inappropriate names, nicknames, profile pictures, or statuses')
            .addField('**☆__ 2:__** __No Unfair Advantages__', '> Players have the right to play in an environment which is fair and free of cheating and exploiting.\n\n**Examples of behavior that __is not__ allowed:**\n\n・Encouraging or discussing ways to exploit/cheat in the housing or on the network\n・Exploiting bugs/glitches (https://hypixel.net/bugs)\n・Auto-clicking/macros\n・Team griefing *e.g., hurting your teammates or causing them to die*\n・Disallowed modifications (https://hypixel.net/allowed-mods)\n・Boosting stats\n・Using any client that helps a player gain an unfair advantage')
            .addField('**☆__ 3:__** __Sensible Creative and Artistic Content__', '> Using inappropriate names, nicknames, profile pictures, or statuses that do not include inappropriate meanings, racist, or sexual imagery. \n\n**Examples of behavior that __is not__ allowed:**\n\n・Inappropriate/racist/sexual imagery of names, nicknames, profile pictures, or statuses\n・Pictures or memes that include adult themes')
            .setFooter('Cosmic Events • Last updated 2/26/2021')
            .setTimestamp()

        if(args[0] === '39d03s-x30v49vsp3-4') {
            message.delete()
            message.channel.send(rulesV1)
            return
        }

        message.react('👍').catch(err => client.logger.error(err))
        message.author.send(rulesV1).catch(err => client.logger.warn(`Could not send rules embed to ${message.author.tag}`))
    }
}