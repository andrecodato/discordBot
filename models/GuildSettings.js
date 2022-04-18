const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guildId: String,
    welcome_channel_id: String,
    sugestion_channel_id: String,
    notification_channel_id: String,
    user_id: String,
    stream_id: String,
    message_id: String,
    video_id: String
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);