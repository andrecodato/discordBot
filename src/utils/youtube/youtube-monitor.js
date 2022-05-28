///////////////////////////////////////////////////////////////////////////////
// Importing modules
///////////////////////////////////////////////////////////////////////////////
const { youtube } = require('../../../src/config/config.js');
const Settings = require("../../../src/models/Settings");
const CronJob = require('cron').CronJob;
const Discord = require('discord.js');

module.exports = async (client) => {
    console.log('[YouTube Monitor] Carregado! Status: ' + youtube.ACTIVE);

    ///////////////////////////////////////////////////////////////////////////////
    // Initializing CronJob tasks
    //
    // CronJob Syntax (For more details go to https://crontab.guru/)
    // ┌───────────── minute (0 - 59)
    // │ ┌───────────── hour (0 - 23)
    // │ │ ┌───────────── month day (1 - 31)
    // │ │ │ ┌───────────── month   (1 - 12)
    // │ │ │ │ ┌───────────── week day (0 - 6)
    // │ │ │ │ │
    // │ │ │ │ │
    // * * * * *
    ///////////////////////////////////////////////////////////////////////////////
    new CronJob('* */12 * * *', async () => { // default (* */12 * * *)
        const Youtube = require('youtube-notifs');  
        if (youtube.ACTIVE) {
            Youtube.start(5, './src/utils/youtube/videoData.json'); // Start monitoring youtube channel for new videos
    
            Youtube.events.on("newVid",async (obj) => { // Execute when a new video is posted
                console.log('[YouTube] Notificando novo vídeo');
                
                const streamData = await Settings.findOne({
                    guild_id: client.id
                });
                const channel = client.channels.cache.get(streamData.notification_channel_id);

                const name = obj.vid.name;
                const url = obj.vid.url;
                const thumbnail = obj.vid.thumbnail.url;
                const channelName = obj.channel.name
                const channelUrl = obj.channel.url;
                
                // Discord embed message schema
                const newNotifierEmbed = new Discord.MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('🔴 VIDEO NOVO')
                    .setURL(`${url}`)
                    .setThumbnail(`${client.user.displayAvatarURL()}`)
                    .setFields(
                        {name:'Título:', value : `${name}`},
                        {name:'Canal:', value: `[${channelName}](${channelUrl})`, inline: true}
                        )
                    .setImage(thumbnail)
                    .setFooter({text:'Stoner Jesus', iconURL:`${client.user.displayAvatarURL()}`})
                    .setTimestamp();
                    
                const message = await channel.send({
                    content: youtube.NOTIFY_ROLE,
                    embeds: [newNotifierEmbed]
                })
                
                await message.react(youtube.REACT_EMOJI);
            });
            Youtube.subscribe([youtube.CHANNEL_ID]); // subscribe to youtube channels
        } else {
            return;
        }
    }).start();
};