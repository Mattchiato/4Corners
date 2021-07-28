const db = require('quick.db');
const { MessageEmbed, StoreChannel } = require('discord.js');
const { hex } = require('../../config.json');

module.exports = {
    commands: ['startgame', 'sg'],
    description: "pushes everyone into their team voice chats",
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${guild.id}.cleanup`);

        //if game active, move people into vc
        //else respond game not active
        if(db.get(`${guild.id}.gameActive`)){
            var teamamount = db.get(`${guild.id}.game.teamamount`);
            for(let i = 0; i < teamamount; i++){
                var team = db.get(`${guild.id}.game.team${i+1}`);
                var teamsize = team.playersid.length;
                for(let i = 0; i < teamsize; i++){
                    var player = await guild.members.fetch(team.playersid[i]);
                    player.voice.setChannel(guild.channels.cache.get(team.vcid));
                }
            }

        }
        else message.reply("there is no game active!").then( msg => msg.delete({timeout: 5000}));

        if(cleanup){
            message.delete({timeout: 5000});
        } 
    }
}
