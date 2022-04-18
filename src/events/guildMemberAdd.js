const Discord = require("discord.js");
const GuildSettings = require("../models/GuildSettings");

module.exports = {
    name: "guildMemberAdd",
    async execute (member) {
        // member.guild.channels.cache.get("960661727064752138").send(`${member.user} entrou no server!`)
        const guildSettings = await GuildSettings.findOne({ guild_id: member.guild.id });

        if (!guildSettings && !guildSettings.welcome_channel_id) return;

        const newMemberEmbed = new Discord.MessageEmbed()
            .setColor("#A5FF33")
            .setTitle("Seja bem-vindo(a)")
            .setDescription(`${member.user} entrou no servidor!`)
            .addFields(
                {name: "Siga-me:", value: ':twitch: stoner_jesus_ \n:youtube: Stoner_Jesus_666\n:facebook: stonerjesus666', inline: true},
                {name: "Regras: ", value: '<#876612371169288193>', inline: true}
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setImage("https://c.tenor.com/kyLaL3qYLsMAAAAd/insurgency-sandstorm.gif")
            .setTimestamp();

        member.guild.channels.cache.get(guildSettings.welcome_channel_id).send({
            embeds: [newMemberEmbed]
        })
    }
}