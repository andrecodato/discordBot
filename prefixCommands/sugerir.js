const Discord = require("discord.js");
const GuildSettings = require("../models/GuildSettings");

exports.run = async (message, args) => {
    message.delete();
    const content = args.join(" ");

    if (!args[0]) {
        return message.channel.send(
            `${message.author.username}, escreva a sugestão após o <>sugerir>.`
        );
    } else if (content.length > 1000) {
        return message.channel.send(
            `${message.author.username}, fornceça uma sugestão de no máximo 1000 caracteres.`
        );
    } else {
        const guildSettings = await GuildSettings.findOne({ guild_id: message.guild.id });

        if (!guildSettings && !guildSettings.sugestion_channel_id) return;

        var discordChannel = message.guild.channels.cache.get(guildSettings.sugestion_channel_id);

        let sugestionMessage = new Discord.MessageEmbed()
            .setColor("#FF3333")
            .setTitle("📬 Caixa de sugestões 📬")
            .setThumbnail("https://images.thdstatic.com/productImages/0b798786-7abc-4471-a81d-405ef49f195f/svn/blacks-architectural-mailboxes-mailboxes-with-post-7680b-10-64_600.jpg")
            .addField("Autor:", `${message.author}`)
            .addField("Sugestão:", content)
            .setTimestamp()
        const msg = await discordChannel.send({ embeds: [sugestionMessage] });

        await message.author.send(`Obrigado ${message.author}!!! Sua sugestão foi enviada com sucesso.`);

        const emojis = ["✅", "❎"];

        for (const i in emojis) {
            await msg.react(emojis[i])
        }

    }
}