const Discord = require('discord.js');
const config = require('./config.json');
const db = require('quick.db');


const client = new Discord.Client();
const loadCommands = require('./commands/load-commands');

client.login(config.token);

client.on("ready", async () =>{
    loadCommands(client);
    console.log(`${client.user.username} is online!`);
    console.log(`total servers: ${client.guilds.cache.size}`);
});

client.on("guildCreate", guild =>{
    console.log("joining : " + guild.name);
    db.set(`${guild.id}`, config.defaultServer);
    console.log("added settings: " + db.has(`${guild.id}`));
    console.log(`total servers: ${client.guilds.cache.size}`);
});