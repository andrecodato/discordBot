const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    message.delete();
    const content = args.join(" ");

    if (!member.roles.cache.has('948403289484046356') || member.roles.cache.some(role => role.name === 'A D M')){
        message.author.send("Você não é ADM pra usar ese comando");
    } else if (!args[0]) {
        return message.author.send(
            `Salvee ${message.author.username}, digite o changelog depois do comando !changelog. `
        );
    } else if (content.length > 1000) {
        return message.author.send(
            `${message.author.username}, envie um changelog de no máximo 1000 caracteres! `
        );
    } else {
        var discordChannel = message.guild.channels.cache.find(
            (ch) => ch.id === "951262290886414427"  
        );

        let reportMessage = new Discord.MessageEmbed()
        .setColor("#FFD433")
        .setTitle("📂 Changelog")
        .setDescription("Atualizações feitas no dia de hoje")
        .addFields({name: "Mudanças:", value:'${content}'})
        .setTimestamp()
        .setFooter({text: 'ChacalCraft 2022', iconURL: 'https://imgur.com/IInwmy0'})
        const msg = await discordChannel.send({embeds: [reportMessage]});

        console.log("[Commands/Changelog] Changelog enviado com sucesso");
        console.log(`[Commands/Changelog] Mensagem: ${message.content}`);

        await message.author.send("Changelog enviado com sucesso");
        
    }
}