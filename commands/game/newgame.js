const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { hex } = require('../../config.json');

module.exports = {
    commands: ['newgame', 'ng'],
    description: "starts a new game of 4 corners",
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${guild.id}.cleanup`);
        

        //can shoto start a game?
        //can shoto find the category channel?
        if(!guild.channels.cache.has(db.get(`${guild.id}.VCCategory`))){
            message.reply(`I can't find a category channel with the id given! Please try using ${db.get(`${guild.id}.prefix`)}settings first!`).then( msg => msg.delete({timeout: 5000})); 
            return;
        }
        //can shoto find the voice channel lobby?
        if(!guild.channels.cache.has(db.get(`${guild.id}.VCLobby`))){
            message.reply(`I can't find the voice channel with the id given! Please try using ${db.get(`${guild.id}.prefix`)}settings first!`).then( msg => msg.delete({timeout: 5000})); 
            return;
        }
        //is there a game active?
        if(db.get(`${guild.id}.gameActive`)){
            message.reply("a game is already active! Join the lobby and get ready for the next round!").then( msg => msg.delete({timeout: 5000}));
            return;
        }
        
        //create message to start game
        const gameMessage = await channel.send("loading game...");
        db.set(`${guild.id}.gameActive`, true);
        db.set(`${guild.id}.game`, {
            gameMessage: gameMessage.id,
            gameMasterID: member.id,
            players: []
        });
        let embed = new MessageEmbed()
        .setColor(hex)
        .setTitle("4 Corners")
        .setDescription(`A new game of 4 Corners has been started by <@${member.id}>. Join <#${db.get(`${guild.id}.VCLobby`)}> to get in on the action!`);
        gameMessage.edit("", embed);

        //cleanup
        if(cleanup) message.delete({timeout: 1000});
    }
}