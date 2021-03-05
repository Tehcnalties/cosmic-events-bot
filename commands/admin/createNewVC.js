//Requires djs v12 to work <FYI>

var channelName = '' ;
let activeChannels = 'ac: ';
client.on('voiceStateUpdate', async (oldState, newState) => {
  let targetChannel = newState.guild.channels.cache.find(ch => ch.name === '➕ | Join to Create');
  if((newState.channel !== null && oldState.channel === null) || (newState.channel !== null && oldState.channel !== null)) {
  if(newState.channel.name == targetChannel.name) {
    console.log('User joined voice channel')
    let category = newState.guild.channels.cache.find(ch => ch.name === '➕ | Join to Create').parentID
    console.log(category)
    channelName = newState.member.user.username + '\'s channel'
    console.log(channelName)
    var vcID = 0;
    await newState.guild.channels.create(channelName, {type: "voice"}).then(async voiceChannel => {
      await voiceChannel.setParent(category)
      vcID = voiceChannel.id;
      console.log(vcID)
      await voiceChannel.updateOverwrite(newState.guild.roles.everyone, {'CONNECT': false})
      console.log('Updated overwrite: CONNECT: FALSE')
      await voiceChannel.updateOverwrite(newState.member.user, {'MOVE_MEMBERS': true})
      console.log('Updated overwrite: MOVE_MEMBERS: TRUE')
      await voiceChannel.updateOverwrite(newState.member.user, {'DEAFEN_MEMBERS': true})
      console.log('Updated overwrite: DEAFEN_MEMBERS: TRUE')
      await voiceChannel.updateOverwrite(newState.member.user, {'MUTE_MEMBERS': true})
      console.log('Updated overwrite: MUTE_MEMBERS: TRUE')
      await newState.member.voice.setChannel(vcID)
      console.log('Moved member to ' + vcID)
      activeChannels += (newState.channel.id).toString(newState.channel.id) + '\n';
      console.log('Added Channel ID to list!')
      console.log('ACTIVE CHANNELS:' + activeChannels)
    })

    console.log(vcID)
    console.log('Changed category for ' + channelName)
    console.log('Created new voice channel for ' + newState.member.user.username)
  }
  
}
if((newState.channel === null && oldState.channel !== null) || (newState.channel !== null && oldState.channel !== null)) {
  console.log('User left voice channel')
  const voiceChannels = newState.guild.channels.cache.find(ch => ch.name == channelName)
  console.log(channelName)
if(activeChannels.toString().includes((oldState.channel.id).toString())) {
  console.log('voiceChannels: TRUE')
  if(oldState.channel.members.size == 0) {
    console.log('voiceChannelsDelete: TRUE')
    activeChannels = activeChannels.replace(((oldState.channel.id).toString()) + '\n', '')
    oldState.channel.delete();
    console.log(activeChannels)
}
}
}
})
