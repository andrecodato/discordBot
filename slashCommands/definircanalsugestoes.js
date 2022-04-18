const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const GuildSettings = require("../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("definircanalsugestoes")
        .setDescription("Escolhe o canal de sugestões!")
        .addChannelOption(option => option
            .setName("canal-sugestoes")
            .setDescription("O canal de sugestões")	
            .setRequired(true)
        ),
    async execute(interaction) {
        // Check for admin permissions
        if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
            interaction.reply("Você não tem permissão para executar este comando!");
            return;
        }

        GuildSettings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log(err);
                interaction.reply("Ocorreu um erro ao salvar as configurações!");
                return;
            }

            if (!settings) {
                settings = new GuildSettings({
                    guild_id: interaction.guild.id,
                    sugestion_channel_id: interaction.options.getChannel("canal-sugestoes").id
                });
            } else {
                settings.sugestion_channel_id = interaction.options.getChannel("canal-sugestoes").id;
            }

            settings.save(err => {
                if (err) {
                    interaction.reply("Ocorreu um erro ao salvar as configurações!");
                    return;
                }

                interaction.reply(`Canal de sugestões definido com sucesso para ${interaction.options.getChannel("canal-sugestoes")}`);
            })
        })
    }
}