const Discord = require('discord.js')

module.exports = {
    name: 'embed',
    category: 'moderator',
    description: 'Generates a custom embed',
    args: false,
    guildOnly: true,
    async execute(client, message, args) {
      if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(':x: You can\'t use this command!')
      const promptTitle = new Discord.MessageEmbed() 
        .setDescription('Enter the `title` of your custom embed\n(Type `null` if you do not want a title)')
        .setColor('#c186ff');
      const promptDescription = new Discord.MessageEmbed() 
        .setDescription('Enter the `description` of your customembed\n(Type `null` if you do not want a description)')
        .setColor('#c186ff');
      const promptFooter = new Discord.MessageEmbed() 
        .setDescription('Enter the `footer` of your custom embed\n(Type `null` if you do not want a footer)')
        .setColor('#c186ff');
      const promptTimestamp = new Discord.MessageEmbed() 
        .setDescription('Do you want a `timestamp`\n(Enter `Y or N`)')
        .setColor('#c186ff');
      const promptThumbnail = new Discord.MessageEmbed()
        .setDescription('Enter a `discord media link` for your thumbnail\n(Type `null` if you do not want a thumbnail)')
        .setColor('#c186ff');
      const promptImage = new Discord.MessageEmbed()
        .setDescription('Enter a `discord media link` for your `IMG/GIF`\n(Type `null` if you do not want an IMG/GIF)')
        .setColor('#c186ff');
      const promptColor = new Discord.MessageEmbed() 
        .setDescription('Enter the `color` of your custom embed\n(Type `null` if you want a blank color)')
        .setColor('#c186ff');
      
      const prompts = [promptTitle, promptDescription, promptFooter, promptTimestamp, promptThumbnail, promptImage, promptColor]
      let question = 0;
      var embed = new Discord.MessageEmbed()
      const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {max: prompts.length, time: 600000});
      message.channel.send(prompts[question++])
      collector.on('collect', m => {
        if(question < prompts.length) {
          m.channel.send(prompts[question++])
        }
      })

      collector.on('end', collected => {
        let question = 0;
          collected.forEach((value) => { 
              question++;
              if(question == 1 && value.content != 'null') {
                embed.setTitle(value.content)
              }
              if(question == 2 && value.content != 'null') {
                embed.setDescription(value.content)
              }
              if(question == 3 && value.content != 'null') {
                embed.setFooter(value.content)
              }
              if(question == 4 && (value.content.toLowerCase(value.content) === 'y' || value.content.toLowerCase(value.content) === 'yes')) {
                embed.setTimestamp(message.createdTimestamp)
              }
              if(question == 5 && value.content != 'null' && (value.content.includes('cdn.discordapp.com') || value.content.includes('tenor.com'))) {
                embed.setThumbnail(value.content)
              }
              if(question == 6 && value.content != 'null' && (value.content.includes('cdn.discordapp.com') || value.content.includes('tenor.com'))) {
                embed.setImage(value.content)
              }
              if(question == 7) {
                if(value.content != 'null') {
                  embed.setColor(value.content)
                }
                message.channel.send(embed)
              }
        })
    })
  }
}
