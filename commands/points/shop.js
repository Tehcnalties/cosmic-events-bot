const Discord = require('discord.js')
const mongoose = require('mongoose')
const Points = require('../../models/points')

module.exports = {
    name: 'shop',
    category: 'points',
    args: false,
    guildOnly: true,
    description: 'Opens up the points shop',
    usage: '[action]',
    async execute(client, message, args) {
        const points = await Points.listIndexes
    }
}