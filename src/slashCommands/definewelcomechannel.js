const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const GuildSettings = require("../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("definewelcomechannel")
        .setDescription("Set welcome channel!")
        .addChannelOption(option => option
            .setName("welcome-channel")
            .setDescription("Welcome channel")
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
                interaction.reply("An error ocurred! welcome channel not saved!");
                return;
            }

            if (!settings) {
                settings = new GuildSettings({
                    guild_id: interaction.guild.id,
                    welcome_channel_id: interaction.options.getChannel("welcome-channel").id
                });
            } else {
                settings.welcome_channel_id = interaction.options.getChannel("welcome-channel").id;
            }

            settings.save(err => {
                if (err) {
                    interaction.reply("An error ocurred! suggestion channel not saved!");
                    return;
                }

                interaction.reply(`Welcome channel defined to ${interaction.options.getChannel("welcome-channel")}`);
            })
        })
    }
}