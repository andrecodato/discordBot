///////////////////////////////////////////////////////////////////////////////
// Name: CHACAL Discord Bot
// By: André Codato aka. ChacalMoon
// Language: JavaScript
// Path: ./bot.js
// Wiki: https://andre-codato.gitbook.io/andrecodatos-discord-bot/
// Discord: ChacalMoon#2878
///////////////////////////////////////////////////////////////////////////////
// Importing and initializing modules
///////////////////////////////////////////////////////////////////////////////
require("dotenv").config();
const fs = require("fs");

const Database = require("./src/config/Database");
const db = new Database();
db.connect();

const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

///////////////////////////////////////////////////////////////////////////////
// Registering administrative commands
///////////////////////////////////////////////////////////////////////////////
const commandFiles = fs.readdirSync("./src/commands/slashCommands").filter(file => file.endsWith(".js"));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./src/commands/slashCommands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

///////////////////////////////////////////////////////////////////////////////
// Registering events
///////////////////////////////////////////////////////////////////////////////
const eventFiles = fs
    .readdirSync("./src/events")
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}

///////////////////////////////////////////////////////////////////////////////
// Discord bot API login
///////////////////////////////////////////////////////////////////////////////
client.login(process.env.TOKEN);