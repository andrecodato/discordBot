const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const Settings = require("../../../src/models/Settings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("definesuggestionchannel")
        .setDescription("Set suggestion channel!")
        .addChannelOption(option => option
            .setName("suggestion-channel")
            .setDescription("suggestion channel")	
            .setRequired(true)
        ),
    async execute(interaction) {
        // Check for admin permissions
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            interaction.reply("You don't have permission to execute this command!");
            return;
        }

        Settings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log(err);
                interaction.reply("An error ocurred! suggestion channel not saved!");
                return;
            }

            if (!settings) {
                settings = new Settings({
                    guild_id: interaction.guild.id,
                    suggestion_channel_id: interaction.options.getChannel("suggestion-channel").id
                });
            } else {
                settings.suggestion_channel_id = interaction.options.getChannel("suggestion-channel").id;
            }

            settings.save(err => {
                if (err) {
                    interaction.reply("An error ocurred! suggestion channel not saved!");
                    return;
                }

                interaction.reply(`Suggestion channel defined to ${interaction.options.getChannel("suggestion-channel")}`);
            })
        })
    }
}