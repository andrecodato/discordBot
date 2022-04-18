const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const GuildSettings = require("../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("definircanalnotificacoes")
        .setDescription("Escolhe o canal de notificações!")
        .addChannelOption(option => option
            .setName("canal-notificacoes")
            .setDescription("O canal de notificações")	
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
                    notification_channel_id: interaction.options.getChannel("canal-notificacoes").id
                });
            } else {
                settings.notification_channel_id = interaction.options.getChannel("canal-notificacoes").id;
            }

            settings.save(err => {
                if (err) {
                    interaction.reply("Ocorreu um erro ao salvar as configurações!");
                    return;
                }

                interaction.reply(`Canal de notificações definido com sucesso para ${interaction.options.getChannel("canal-notificacoes")}`);
            })
        })
    }
}