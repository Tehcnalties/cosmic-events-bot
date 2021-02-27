const mongoose = require('mongoose')
const Status = require('../../models/status')

module.exports = {
    name: 'updatestatus',
    args: false,
    guildOnly: false,
    async execute(client, message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(':x: You are missing the necessary permissions `ADMINISTRATOR` to use this command!')
        const settings = await Status.findOne({
            id: 'COSMIC_BOT_STATUS'
        }, (err, guild) => {
            if(err) client.logger.error(err)
            if(!guild) {
                const newStatus = new Status({
                    _id: mongoose.Types.ObjectId(),
                    guildID: '',
                    type: '',
                    message: '',
                    id: 'COSMIC_BOT_STATUS'
                })
    
                newStatus.save()
                    .then(result => client.logger.log(result))
                    .catch(err => client.logger.error(err))
    
                return client.logger.log(':x: Your server was not registered in our database, and was just registered.')
            }
        })
    
        const activityType = settings.type
        const activityMessage = settings.message
    
        client.logger.log('Updated activity!');
        client.user.setActivity(activityMessage, {
            type: activityType
        })

        message.channel.send(':white_check_mark: Force updated the status!')
    }
}