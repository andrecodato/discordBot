const Discord = require("discord.js");
const Settings = require("../../models/Settings");

exports.run = async (message, args) => {
    message.delete();
    const content = args.join(" ");

    if (!args[0]) {
        return message.channel.send(
            `${message.author.username}, Digite a sugestão depois do comando >sugerir.`
        );
    } else if (content.length > 1000 || content.length < 15) {
        return message.channel.send(
            `${message.author.username}, Tamanho mínimo: 15, maximo: 1000 caracteres.`
        );
    } else {
        const guildSettings = await Settings.findOne({
            guild_id: message.guild.id
        });

        if (!guildSettings && !guildSettings.suggestion_channel_id) return;

        var discordChannel = message.guild.channels.cache.get(guildSettings.suggestion_channel_id);

        let suggestionMessage = new Discord.MessageEmbed()
            .setColor("#FF3333")
            .setTitle("📬 Suggestion box 📬")
            .setThumbnail("https://images.thdstatic.com/productImages/0b798786-7abc-4471-a81d-405ef49f195f/svn/blacks-architectural-mailboxes-mailboxes-with-post-7680b-10-64_600.jpg")
            .addField("Author:", `${message.author}`)
            .addField("Suggestion:", content)
            .setTimestamp()
        const msg = await discordChannel.send({ embeds: [suggestionMessage] });

        await message.author.send(`Thanks ${message.author}!!! Your suggestion was sended with success.`);

        const emojis = ["✅", "❎"];

        for (const i in emojis) {
            await msg.react(emojis[i])
        }

    }
}