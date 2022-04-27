const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    guildId: String,
    welcome_channel_id: String,
    suggestion_channel_id: String,
    notification_channel_id: String,
    notifiers: {
        user_id: String,
        stream_id: String,
        message_id: String,
        video_id: String
    },
});

module.exports = mongoose.model('Settings', SettingsSchema);