///////////////////////////////////////////////////////////////////////////////
// Importing modules
///////////////////////////////////////////////////////////////////////////////
const { getStream, getUser, getGame } = require('./twitch-api.js');
const { twitch } = require('../../../src/config/config.js');
const Settings = require("../../../src/models/Settings");
const CronJob = require('cron').CronJob;
const Discord = require("discord.js");

module.exports = async (client) => {
    console.log('[Twitch] Monitorando a stream!');

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
    new CronJob('*/1 * * * *', async () => { // default (*/30 * * * *)
        const stream = await getStream(twitch.STREAMER);
        
        if (!stream) return; // If stream is offline
        
        if(stream.type == 'live'){ // If stream is online
            const user = await getUser(twitch.STREAMER);
            const game = await getGame(twitch.STREAMER);

            const streamData = await Settings.findOne({
                user_id: user.id
            });
            const channel = client.channels.cache.get(streamData.notification_channel_id);

            // Discord embed message schema
            const newNotifierEmbed = new Discord.MessageEmbed()
            .setColor('#A233FF')
            .setTitle('🔵 LIVE ON')
            .setURL(`https://twitch.tv/${user}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFields(
                {name:'Title:', value : `${stream.title}`},
                {name:'Playing:', value: `${game}`, inline: true},
                {name:'Viewers:', value: `${stream.viewer_count}`, inline: true},
                {name:'Channel:', value: `[${user}](https://twitch.tv/${user})`, inline: true}
                )
            .setImage(stream.getThumbnailUrl())
            .setTimestamp()
            .setFooter({text:`${user}`, iconURL:`${client.user.displayAvatarURL()}`})
                
                
            if (!streamData) { // If stream user id isn't on db
                console.log('[Twitch] Notificando live');

                const message = await channel.send({ // Send message
                    content: twitch.NOTIFY_ROLE,
                    embeds: [newNotifierEmbed]
                });

                await message.react(twitch.REACT_EMOJI); // React to message

                return await GuildSettings.create({ // Create db fields
                    notifiers:{
                        user_id: user.id,
                        stream_id: stream.id,
                        message_id: message.id
                    }
                })
            } else if (streamData.notifiers.stream_id == stream.id) { // If stream is already notified, this will edit the last message
                console.log('[Twitch] Editando notificação anterior');
    
                let message = await channel.messages
                    .fetch(streamData.notifiers.message_id)
                    .then((msg) => msg.edit({embeds: [newNotifierEmbed]}))
                    .catch(() => channel.send({embeds: [newNotifierEmbed]}))
                
                await message.react(twitch.REACT_EMOJI);
    
                await streamData.updateOne({ // Update message and stream ids
                    notifiers:{
                        user_id: user.id,
                        stream_id: stream.id,
                        message_id: message.id
                    }
                })
            } else { // If stream id doesn't match with old message sended, create a new message
                console.log('[Twitch] Notificando live');

                const message = await channel.send({
                    content: twitch.NOTIFY_ROLE,
                    embeds: [newNotifierEmbed]
                });

                await message.react(twitch.REACT_EMOJI);

                await streamData.updateOne({
                    notifiers:{
                        user_id: user.id,
                        stream_id: stream.id,
                        message_id: message.id
                    }
                })
            };
        };
    }).start();
};