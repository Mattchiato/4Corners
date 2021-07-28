const loadCommands = require('../load-commands.js');
const { hex } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    commands: ['settings'],
    description: "changes settings about the bot",
    expectedArgs: '<setting> <newValue>',
    minArgs: 0,
    maxArgs: 2,
    permissions: '',
    callback: (message, args, text) => {

        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${message.channel.guild.id}.cleanup`);

        if(args.length < 2){
            let embed = new MessageEmbed()
        .setColor(hex)
        .setTitle("Settings")
        .setDescription("below are my settings. To Change a setting, try using ?settings <setting> <newValue>")
        .addField("Prefix", db.get(`${guild.id}.prefix`));
        if(db.get(`${guild.id}.VCCategory`) != ""){
            embed.addField("VCCategory", db.get(`${guild.id}.VCCategory`)); 
        }
        else embed.addField("VCCategory", `null, please add a category for me to make channels in using ${db.get(`${guild.id}.prefix`)}settings vccategory <categoryID>`);
        if(db.get(`${guild.id}.VCLobby`) != ""){
            embed.addField("VCLobby", db.get(`${guild.id}.VCLobby`)); 
        }
        else embed.addField("VCLobby", `null, please add a voice lobby for me to count players in using ${db.get(`${guild.id}.prefix`)}settings vclobby <lobbyID>`);
        embed.addField("Cleanup", db.get(`${guild.id}.cleanup`));
        embed.addField("GameRole", db.get(`${guild.id}.GameRole`));
        message.channel.send(embed);
        }
        if(args.length == 2){
            switch(args[0]){
                case "prefix":
                    db.set(`${guild.id}.prefix`, args[1]);
                    channel.send(`Changed setting "${args[0]}" to: "${db.get(`${guild.id}.prefix`)}"`).then( msg => msg.delete({timeout: 5000}));
                    break;
                case "vccategory":
                    db.set(`${message.channel.guild.id}.VCCategory`, args[1]);
                    channel.send(`Changed setting "${args[0]}" to: "${db.get(`${guild.id}.VCCategory`)}"`).then( msg => msg.delete({timeout: 5000}));
                    break;
                case "vclobby": 
                    db.set(`${guild.id}.VCLobby`, args[1]);
                    channel.send(`Changed setting "${args[0]}" to: "${db.get(`${guild.id}.VCLobby`)}"`).then( msg => msg.delete({timeout: 5000}));
                    break;
                case "cleanup":
                    switch(args[1]){
                        case "1":
                        case "true":
                            db.set(`${guild.id}.cleanup`, true);
                            break;
                        case "0":
                        case "false":
                            db.set(`${guild.id}.cleanup`, false);
                            break;
                        default:
                            message.reply(`Could not understand "${args[1]}"`).then( msg => msg.delete({timeout: 5000}));
                    }
                    channel.send(`Changed setting "${args[0]}" to: "${db.get(`${guild.id}.cleanup`)}"`).then( msg => msg.delete({timeout: 5000}));
                    break;
                case "gamerole":
                    db.set(`${guild.id}.GameRole`, args[1]);
                    channel.send(`Changed setting "${args[0]}" to: "${db.get(`${guild.id}.GameRole`)}"`).then( msg => msg.delete({timeout: 5000}));
                    break;
                default:
                    message.reply(`could not find setting ${args[0]}`).then( msg => msg.delete({timeout: 5000}));
                    break;
            }
        }

        if(cleanup) message.delete({timeout: 1000});
    }
}