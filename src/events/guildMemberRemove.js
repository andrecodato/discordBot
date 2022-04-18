const Discord = require("discord.js");
const GuildSettings = require("../models/GuildSettings");

module.exports = {
    name: "guildMemberRemove",
    async execute (member) {
        // member.guild.channels.cache.get("960661727064752138").send(`${member.user} entrou no server!`)

        const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id });

        if (!guildSettings && !guildSettings.welcome_channel_id) return;

        const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#FF4633")
            .setTitle("Até a próxima")
            .setDescription(`${member.user} saiu do servidor!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setImage("https://c.tenor.com/VPUXJJmvxgYAAAAM/goodbye-chat.gif")
            .setTimestamp();

        member.guild.channels.cache.get(guildSettings.welcome_channel_id).send({
            embeds: [newMemberEmbed]
        })
    }
}