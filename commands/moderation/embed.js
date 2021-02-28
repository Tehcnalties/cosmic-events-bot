if(msg.content === '+embed') {
    const promptTitle = new Discord.MessageEmbed() 
      .setDescription('Enter the `title` of your custom embed\n(Type `null` if you do not want a title)');
    const promptDescription = new Discord.MessageEmbed() 
      .setDescription('Enter the `description` of your customembed\n(Type `null` if you do not want a description)');
    const promptFooter = new Discord.MessageEmbed() 
      .setDescription('Enter the `footer` of your custom embed\n(Type `null` if you do not want a footer)');
    const promptTimestamp = new Discord.MessageEmbed() 
      .setDescription('Do you want a `timestamp`\n(Enter `Y or N`)');
    const promptThumbnail = new Discord.MessageEmbed()
      .setDescription('Enter a `discord media link` for your thumbnail\n(Type `null` if you do not want a thumbnail)')
    const promptImage = new Discord.MessageEmbed()
      .setDescription('Enter a `discord media link` for your `IMG/GIF`\n(Type `null` if you do not want an IMG/GIF)')
    const promptColor = new Discord.MessageEmbed() 
      .setDescription('Enter the `color` of your custom embed\n(Type `null` if you want a blank color)');
    
    const prompts = [promptTitle, promptDescription, promptFooter, promptTimestamp, promptThumbnail, promptImage, promptColor]
    let question = 0;
    var embed = new Discord.MessageEmbed()
    const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {max: prompts.length, time: 600000});
    msg.channel.send(prompts[question++])
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
              embed.setTimestamp(msg.createdTimestamp)
            }
            if(question == 5 && value.content != 'null') {
              embed.setThumbnail(value.content)
            }
            if(question == 6 && value.content != 'null') {
              embed.setImage(value.content)
            }
            if(question == 7) {
              if(value.content != 'null') {
                embed.setColor(value.content)
              }
              msg.channel.send(embed)
            }
       })
    })

   
  }
