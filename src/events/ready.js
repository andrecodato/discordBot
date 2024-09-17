const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

module.exports = {
    name:"ready",
    once: true,
    execute (client, commands) {
        console.log("[BOT] Umuaramíssimo está online!");

        const CLIENT_ID = client.user.id;

        const rest = new REST({
            version: "9"
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (process.env.ENV === "production") {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    console.log("[BOT] Commandos globais registrados com sucesso!")
                    require('../utils/twitch/twitch-monitor.js')(client);
                    require('../utils/youtube/youtube-monitor.js')(client);
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commands
                    });
                    console.log("[BOT] Commandos locais registrados com sucesso!");
                    require('../utils/youtube/youtube-monitor.js')(client);
                    require('../utils/twitch/twitch-monitor.js', )(client);
                }
            } catch (err) {
                if (err) console.error(err);
            }
        })();
    }
}