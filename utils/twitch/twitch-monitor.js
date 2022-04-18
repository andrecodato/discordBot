const { getStream, getUser, getGame } = require('./twitch-api.js');
const { twitch } = require('../../config/config.js');
const GuildSettings = require("../../models/GuildSettings");
const CronJob = require('cron').CronJob;
const Discord = require("discord.js");

module.exports = async (client) => {
    console.log('[Twitch] Monitorando a stream!');
    new CronJob('*/30 * * * *', async () => {
        
        const stream = await getStream(twitch.STREAMER);
        const user = await getUser(twitch.STREAMER);
        const game = await getGame(twitch.STREAMER);
        
        if (!stream) return;
        
        if(stream.type == 'live'){
            const streamData = await GuildSettings.findOne({
                user_id: user.id
            });
            const channel = client.channels.cache.get(streamData.notification_channel_id);

            const newNotifierEmbed = new Discord.MessageEmbed()
            .setColor('#A233FF')
            .setTitle('🔵 LIVE ON')
            .setURL(`https://twitch.tv/${user}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFields(
                {name:'Título:', value : `${stream.title}`},
                {name:'Jogando:', value: `${game}`, inline: true},
                {name:'Viewers:', value: `${stream.viewer_count}`, inline: true},
                {name:'Canal:', value: `[${user}](https://twitch.tv/${user})`, inline: true}
                )
            .setImage(stream.getThumbnailUrl())
            .setTimestamp()
            .setFooter({text:'Stoner Jesus', iconURL:`${client.user.displayAvatarURL()}`})
                
                
            if (!streamData) {
                console.log('[Twitch] Notificando live');

                const message = await channel.send({
                    content: twitch.NOTIFY_ROLE,
                    embeds: [newNotifierEmbed]
                });

                await message.react(twitch.REACT_EMOJI);

                return await GuildSettings.create({
                    user_id: user.id,
                    stream_id: stream.id,
                    message_id: message.id
                })
            } else if (streamData.stream_id == stream.id) {
                console.log('[Twitch] Editando notificação anterior');
    
                let message = await channel.messages
                    .fetch(streamData.message_id)
                    .then((msg) => msg.edit({embeds: [newNotifierEmbed]}))
                    .catch(() => channel.send({embeds: [newNotifierEmbed]}))
                
                await message.react(twitch.REACT_EMOJI);
    
                await streamData.updateOne({
                    user_id: user.id,
                    stream_id: stream.id,
                    message_id: message.id
                })
            } else {
                console.log('[Twitch] Notificando live');

                const message = await channel.send({
                    content: twitch.NOTIFY_ROLE,
                    embeds: [newNotifierEmbed]
                });

                await message.react(twitch.REACT_EMOJI);

                await streamData.updateOne({
                    user_id: user.id,
                    stream_id: stream.id,
                    message_id: message.id
                })
            };
        };
    }).start();
};