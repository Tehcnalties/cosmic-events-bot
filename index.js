const Discord = require('discord.js')
const fs = require('fs')
const config = require('./config.json')
const path = require('path')
const mongoose = require('mongoose')

const token = config.token

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
client.mongoose = require('./utils/mongoose')

// LOGGER
client.logger = require('./modules/logger')


let commandLength = 0
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        commandLength += 1
        const command = require(`./commands/${folder}/${file}`)
        client.commands.set(command.name, command)
    }
}
client.logger.log(`Loading a total of ${commandLength} commands.`)

let eventLength = 0
const eventDir = path.resolve('events')
fs.readdir(eventDir, (err, files) => {
    if(err) return client.logger.error(err)
    files.forEach(file => {
        eventLength += 1
        const event = require(`./events/${file}`)
        const eventName = file.split('.')[0]
        client.on(eventName, event.bind(null, client))
    })
})
client.logger.log(`Loading a total of ${eventLength} events.`)

client.mongoose.init();
client.login(token)
