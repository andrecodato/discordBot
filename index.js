console.log("[DiscordBot] Iniciando ...")
console.log("[DiscordBot] Carregando módulos do node...")
const express = require('express');
const app = express();
require('dotenv').config();

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online

console.log("[DiscordBot] Carregando módulo discord.js...")
const Discord = require("discord.js"); //Conexão com a livraria Discord.js
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({
 intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); //Criação de um novo Client
 
 const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos
 console.log(`[DiscordBot] Prefixo do bot = ${config.prefix}`)

client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;
  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.io}>`)) return;
  
  const args = message.content
    .trim().slice(config.prefix.length)
    .split(/ +/g);

  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`)
    commandFile.run(client, message, args);
  } catch (err) {
    console.error("Erro:" + err);
  }
});

const mySecret = process.env.TOKEN;
client.login(mySecret); //Ligando o Bot caso ele consiga acessar o token
console.log(`[DiscordBot] Bot ligado e ouvindo ✅👂`)
