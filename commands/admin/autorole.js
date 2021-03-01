const mongoose = require('mongoose')
const Guild = require('../../models/guild')
const Discord = require('discord.js')
const { execute } = require('../moderation/kick')

module.exports = {
    name: 'autorole',
    description: 'Sets the role given automatically upon joining',
    category: 'admin',
    args: true,
    guildOnly: true,
    usage: '[role]',
    async execute(client, message, args) {
        
    }
}