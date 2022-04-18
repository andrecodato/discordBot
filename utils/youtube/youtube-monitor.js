const { youtube } = require('../../config/config.js');
const GuildSettings = require("../../models/GuildSettings");
const CronJob = require('cron').CronJob;
const Discord = require('discord.js');

module.exports = async (client) => {
    console.log('[YouTube] Monitorando canal do youtube por vídeos');
    new CronJob('* */12 * * *', async () => {
        console.log("[Youtube] Teste cronjob");
        
        const Youtube = require('youtube-notifs');  
        Youtube.start(5, './utils/youtube/videoData.json');
    
        Youtube.events.on("newVid",async (obj) => {
            console.log('[YouTube] Notificando novo vídeo');
            
            const streamData = await GuildSettings.findOne({
                guild_id: client.id
            });
            const channel = client.channels.cache.get(streamData.notification_channel_id);

            const name = obj.vid.name;
            const url = obj.vid.url;
            const thumbnail = obj.vid.thumbnail.url;
            const channelName = obj.channel.name
            const channelUrl = obj.channel.url;
            
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
        Youtube.subscribe([youtube.CHANNEL_ID]);
    }).start();
};