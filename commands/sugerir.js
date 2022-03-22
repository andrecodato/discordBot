const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  message.delete();
  const content = args.join(" ");

  if (!args[0]) {
    return message.author.send(
      `${message.author.username}, escreva a sugestão após o <!sugerir>.`
    );
  } else if (content.length > 1000) {
    return message.author.send(
      `${message.author.username}, envie uma sugestão de no máximo 1000 caracteres.`
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
    
    console.log(`[DiscordBot/Sugestão] Sugestão de ${message.author.username} armazenada com sucesso.`)
    console.log(`[DiscordBot/Sugestão] Mensagem: ${message.content}`)
    
    await message.author.send(`Obrigado ${message.author.username}!!! Sua sugestão foi enviada com sucesso.`);
    
    const emojis = ["✅", "❎"];
    
    for (const i in emojis) {
      await msg.react(emojis[i])
    }
    
  }
};
