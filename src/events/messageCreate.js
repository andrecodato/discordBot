module.exports = {
    name: "messageCreate",
    async execute (message) {
        if (message.author.bot) return;
        if (message.channel.type == "dm") return;
        if (!message.content.toLowerCase().startsWith(">")) return;
        if (message.content.startsWith(`<@!${message.author.id}>`) || message.content.startsWith(`<@${message.author.io}>`)) return;
        
        const args = message.content
            .trim().slice(">".length)
            .split(/ +/g);

        const command = args.shift().toLowerCase();

        try {
            const commandFile = require(`../prefixCommands/${command}.js`)
            commandFile.run(message, args);
        } catch (err) {
            console.error("Erro:" + err);
        }
    }
}