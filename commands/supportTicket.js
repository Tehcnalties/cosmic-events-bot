const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});


function padLeft(nr, n, str){
  return Array(n-String(nr).length+1).join(str||'0')+nr;
}
let ticketNumber = 0;
ticketNumber = ticketNumber.toFixed(0000)
var userList = 'USER-COLLECTION:'
if(msg.content === '+ticket setup') {
const ticketEmoji = '🎫';
const cancelEmoji = '⛔';
var channelList = ''
var ticketID = 0;
var targetUser;
const setupMessageEmbed = new Discord.MessageEmbed() 
      .setTitle('Create Support Ticket')
      .setDescription('React to start a new support ticket! A staff member will consult with you shortly')
      .addField('Warning', 'Troll Tickets will result in punishment', false)
      .setColor('#c186ff')
      .setFooter('Cosmic Events • Ticket Tool');
let setupMessage = await msg.channel.send(setupMessageEmbed);

setupMessage.react(ticketEmoji)

client.on('messageReactionAdd', async (reaction, user) => {
  if(reaction.message.partial) await reaction.message.fetch();
  if(reaction.partial) await reaction.fetch();
  if(user.bot) return;
  if(!reaction.message.guild) return;
  if(reaction.message.id == reaction.message.id) {
    if(reaction.emoji.name === ticketEmoji && reaction.message == setupMessage) {
      console.log('Reaction detected!')

      const userReactions = setupMessage.reactions.cache.filter(reaction => reaction.users.cache.has(user.id) && (user.id !== client.user.id));

        for (const reaction of userReactions.values()) {
          await reaction.users.remove(user.id);
        }
        ticketNumber++;
        var ticketName = user.username.toLowerCase() + '-ticket-' + padLeft(ticketNumber, 4);
        console.log('USERLIST-RESOLVED: ' + userList) 
        if(!(userList.includes((user.id).toString(user.id)))) {
        const newChannel = await msg.guild.channels.create(ticketName, {
            type: 'text',
            permissionOverwrites: [
              {
                id: msg.guild.id,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: user.id,
                allow: ['VIEW_CHANNEL'],

              },
            ],
        });
        let supportTeam = 'Support Team'
        supportTeam.toLowerCase()
        const newTicket = new Discord.MessageEmbed()
          .setTitle('New Support-Ticket by ' + user.username)
          .setFooter('User ID • ' + user.id)
          .setDescription('A staff member will be with you shortly! Please be patient\nReact to close this ticket')
          .setColor('#c186ff');

        let ticketMessage = await newChannel.send(newTicket)
        const supportRole = ticketMessage.guild.roles.cache.find(r => r.name == supportTeam).id
        if(supportRole) {
            newChannel.updateOverwrite((supportRole), {VIEW_CHANNEL: true})
        }

        else {
            await newChannel.send('Please create a new role called `Support Team` (Not Case Sensitive) and assign it to the desired members to allow people beyond `ADMINISTRATOR` to view the ticket!')
        }

        ticketID = newChannel.id;
        ticketMessage.react(cancelEmoji)
        cancelTicket = true;
       channelList += ticketID + '\n'
       console.log(ticketName)
       targetUser = msg.member
      
       console.log('Created a new channel for ' + user.username)
        userList += (user.id).toString(user.id) + ' ';
        console.log('USERLIST-RESOLVED: ' + userList)
      }
      else {
        const existingTicket = new Discord.MessageEmbed()
          .addField('Ticket Error', 'Unable to create a new channel for ' + user.username, false)
          .addField('Reason', '1/1 Tickets Created', false) 
          .setColor('#c186ff')
        msg.channel.send(existingTicket).then(msg => {
          msg.delete({timeout: 3000})
        })
      }

    }
    if(reaction.emoji.name === cancelEmoji && (await reaction.message.guild.members.fetch(user)).hasPermission('MANAGE_CHANNELS') && channelList.includes(reaction.message.channel.id)) {
      console.log('Deleting a support ticket!')
      const fetchChannel = msg.guild.channels.cache.find(ch => ch.id == reaction.message.channel.id)
      const fetchUser = fetchChannel.permissionOverwrites.get(user.id).id
      userList = userList.replace(fetchUser.toString(fetchUser), '') 
      console.log(userList)
      fetchChannel.delete();

  }
  }
})

  
}
