const Suggestion = require('../../models/suggestions')
const Guild = require('../../models/guild')
const mongoose = require('mongoose')
const config = require('../../config.json')
const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'suggest',
    category: 'general',
    description: 'Submits a suggestion',
    args: true,
    guildOnly: true,
    usage: '[suggestion]',
    async execute(client, message, args) {
        const suggestionMessage = args.join(' ')
        const suggestionID = makeid(7)

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
                    modlogID: '',
                    mutedID: '',
                    messagelogID: '',
                    suggestionID: '',
                    autoroleID: '',
                    welcomeChannel: ''
                })
    
                newGuild.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))
    
                return message.channel.send(':x: This server was not registered in our database, and was just registered.')
            }
        })

        const suggestionChannelID = settings.suggestionID
        if(!suggestionChannelID) return message.channel.send('This server has not yet set up a suggestions channel. Tell your server admins to set it up.')

        suggestion = new Suggestion({
            _id: mongoose.Types.ObjectId(),
            userID: message.author.id,
            suggestion: suggestionMessage,
            suggestionID: suggestionID,
            status: 'unresolved',
            messageID: ''
        })

        suggestion.save()
            .then(result => client.logger.log(result))
            .catch(err => client.logger.error(err));

        const suggestionEmbed = new Discord.MessageEmbed()
            .setTitle('Suggestion')
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setDescription(suggestionMessage)
            .addField('Suggestion ID', suggestionID)
            .setFooter('Cosmic Events | React with 👍 or 👎 to vote')
            .setTimestamp()
            .setColor('c186ff')
        
        message.guild.channels.cache.get(suggestionChannelID).send(suggestionEmbed).then(msg => {
            msg.react('👍')
            msg.react('👎')
        })
        message.channel.send(':white_check_mark: Your suggestion has been submitted!').then(async msg => {
            const msgID = msg.id
            
            const suggestion = await Suggestion.findOne({
                suggestionID: suggestionID
            }, (err, suggestion) => {
                if(err) client.logger.error(err)
                if(!suggestion) return
            })

            await suggestion.updateOne({
                messageID: msgID
            })
        })
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}