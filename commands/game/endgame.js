const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { hex } = require('../../config.json');

module.exports = {
    commands: ['endgame', 'eg'],
    description: "ends the current game of 4 corners",
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${guild.id}.cleanup`);
        
        //if game active, end game
        //else respond no game active
        if(db.get(`${guild.id}.gameActive`)){

            //start embed for results embed
            let embed = new MessageEmbed()
            .setColor(hex)
            .setTitle("4 Corners")
            .setDescription(`The game has been ended by <@${member.id}>.`);
            
            //create teams object array and sort into placements
            var teamamount = db.get(`${guild.id}.game.teamamount`);
            var teams = [];
            for(let i = 0; i < teamamount; i++){
                teams.push(db.get(`${guild.id}.game.team${i+1}`));
            };
            teams.sort(function(a, b){return a.placement - b.placement});

            //add each team to embed
            for(let i = 0; i < teamamount; i++){
                var placed;
                switch(teams[i].placement){
                    case "1":
                        placed = "1st";
                        break;
                    case "2":
                        placed = "2nd";
                        break;
                    case "3":
                        placed = "3rd";
                        break;
                    default:
                        placed = `${teams[i].placement}th`;
                }
                var fieldValue = `<@`;
                for(let x = 0; x < db.get(`${guild.id}.game.teamsize`); x++){
                    fieldValue += teams[i].playersid[x];
                    if( db.get(`${guild.id}.game.teamsize`)-x != 1)
                        fieldValue += ">, <@";
                    else fieldValue += ">";  
                }
                embed.addField(`Team ${teams[i].teamnumber}: ${placed}`, fieldValue);
            }

            //delete last gameMessage and send new embed
            channel.messages.fetch(db.get(`${guild.id}.game.gameMessage`)).then(msg => msg.delete());
            const newMessage = await channel.send(embed);
            
            // find and delete team voice channels
            const teamvc = db.get(`${guild.id}.game.teamvc`);
            for(id of teamvc){
                var voiceChannel = await guild.channels.cache.get(id);
                if(voiceChannel != undefined){
                    voiceChannel.members.each(player => {
                        player.voice.setChannel(guild.channels.cache.get(db.get(`${guild.id}.VCLobby`)));
                    });
                    voiceChannel.delete();
                }
            }

            //update db
            db.set(`${guild.id}.gameActive`, false);
            db.set(`${guild.id}.game`, {});
            message.reply("game ended!").then( msg => msg.delete({timeout: 5000})); 
        }
        else message.reply("there is no game active!").then( msg => msg.delete({timeout: 5000}));

        //cleanup
        if(cleanup) message.delete({timeout: 5000});
    }
}