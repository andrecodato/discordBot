const Discord = require("discord.js");
const Settings = require("../../src/models/Settings");

module.exports = {
    name: "guildMemberAdd",
    async execute (member) {
        // member.guild.channels.cache.get("960661727064752138").send(`${member.user} entrou no server!`)
        const guildSettings = await Settings.findOne({ guild_id: member.guild.id });

        if (!guildSettings && !guildSettings.welcome_channel_id) return;

        const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#A5FF33")
            .setTitle("Seja bem-vindo(a)")
            .setDescription(`${member.user} entrou no servidor!`)
            .addFields(
                {name: "Siga-nos:", value: ':instagram: @umucraftminerama', inline: true},
                {name: "Regras: ", value: '<#1277991513619431485>', inline: true}
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setImage("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGpuNzMza3YyOWc1NTl0bndhdjF5MnM4YmxpY2FrdWVveHIyZXIxZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Rsp9jLIy0VZOKlZziw/giphy.gif")
            .setTimestamp();

        member.guild.channels.cache.get(guildSettings.welcome_channel_id).send({
            embeds: [newMemberEmbed]
        })
    }
}