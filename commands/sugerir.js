const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  message.delete();
  const content = args.join(" ");

  if (!args[0]) {
    return message.channel.send(
      `${message.author.username}, escreva a sugestão após o <!sugerir>.`
    );
  } else if (content.length > 1000) {
    return message.channel.send(
      `${message.author.username}, fornceça uma sugestão de no máximo 1000 caracteres.`
    );
  } else {
    var discordChannel = message.guild.channels.cache.find(
      (ch) => ch.id === "955633610826842143"
    );
    let sugestionMessage = new Discord.MessageEmbed()
      .setColor("#FF3333")
      .setTitle("📬 Caixa de sugestões 📬")
      .setThumbnail("https://i.imgur.com/29mp7lN.png")
      .addField("Autor:", message.author.username)
      .addField("Sugestão:", content)
      .setTimestamp()
    const msg = await discordChannel.send({ embeds: [sugestionMessage]});
    
    await message.channel.send(`${message.author.username} sua sugestão foi enviada com sucesso!`);
    
    const emojis = ["✅", "❎"];
    
    for (const i in emojis) {
      await msg.react(emojis[i])
    }
    
  }
};
