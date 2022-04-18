const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Reenvia a mensagem!")
        .addStringOption((option) => 
            option
                .setName("mensagem")
                .setDescription("A mensagem que será reenviada")
                .setRequired(true)
        ),
    async execute(interaction) {
        interaction.reply({
            content: interaction.options.getString("mensagem"),
            ephemeral: true
        });
    }
}