module.exports = {
    name: 'test',
    async execute(client, message, args) {
        if(message.author.id === '359163540050804738' || message.author.id === '745977987861708890') return message.channel.send('test')
            else return message.channel.send('This is a developer only command.')
    }
}