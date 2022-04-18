const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const GuildSettings = require("../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("definenotificationchannel")
        .setDescription("Set notification channel!")
        .addChannelOption(option => option
            .setName("notification-channel")
            .setDescription("Notification channel")	
            .setRequired(true)
        ),
    async execute(interaction) {
        // Check for admin permissions
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            interaction.reply("You don't have permission to execute this command!");
            return;
        }

        GuildSettings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log(err);
                interaction.reply("An error ocurred! notification channel not saved!");
                return;
            }

            if (!settings) {
                settings = new GuildSettings({
                    guild_id: interaction.guild.id,
                    notification_channel_id: interaction.options.getChannel("notification-channel").id
                });
            } else {
                settings.notification_channel_id = interaction.options.getChannel("notification-channel").id;
            }

            settings.save(err => {
                if (err) {
                    interaction.reply("An error ocurred! suggestion channel not saved!");
                    return;
                }

                interaction.reply(`Notification channel defined to ${interaction.options.getChannel("notification-channel")}`);
            })
        })
    }
}