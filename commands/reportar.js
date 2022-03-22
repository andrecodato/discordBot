const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete();
    const content = args.join(" ");

    if (!args[0]) {
        return message.author.send(
            `Salvee ${message.author.username}, obrigado por ajudar o server reportando. `
        );
    } else if (content.length > 1000) {
        return message.author.send(
            `${message.author.username}, envie um report de no máximo 1000 caracteres! `
        );
    } else {
        var discordChannel = message.guild.channels.cache.find(
            (ch) => ch.id === "955942694692216932"  
        );
        let reportMessage = new Discord.MessageEmbed()
        .setColor("#FF3333")
        .setTitle(`📌${message.author.username} REPORTOU 📌`)
        .addField("Relato: ", content)
        .setTimestamp()
        const msg = await discordChannel.send({embeds: [reportMessage]});

        console.log(`[Commands/Report] Report de ${message.author.username} armazenada com sucesso!`);
        console.log(`[Commands/Report] Mensagem: ${message.content}`);

        await message.author.send(`Obrigado ${message.author.username}, por ajudar a manter nossa comunidade limpa!`)
    }
}