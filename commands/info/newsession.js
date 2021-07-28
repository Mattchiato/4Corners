const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { hex } = require('../../config.json');

module.exports = {
    commands: ['newsession', 'ns'],
    description: "sends out a message that a new session of 4 Corners is starting,",
    minArgs: 0,
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${guild.id}.cleanup`);


        //create embed and send
        let embed = new MessageEmbed()
            .setColor(hex)
            .setTitle("4 Corners")
            .setDescription(`<@${member.id}> has asked to start a new session of 4 Corners. Come join <#${db.get(`${guild.id}.VCLobby`)}> to get in on the action!`); //member mention = "<@memberID>"

        channel.send(`<@&${db.get(`${guild.id}.GameRole`)}>`, embed); //role mention = "<@&roleID>"

        //cleanup
        if(cleanup) message.delete({ timeout: 10000 /*time unitl delete in milliseconds*/});
    }
}