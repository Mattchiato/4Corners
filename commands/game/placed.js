const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { hex } = require('../../config.json');

module.exports = {
    commands: ['placed', 'p'],
    description: `tells the bot what placement you got e.g. "?placed 4" for 4th place`,
    expectedArgs: '<placement>',
    minArgs: 1,
    maxArgs: 1,
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${guild.id}.cleanup`);

        //if game active, move people back to lobby and update db
        //else respond no game active
        if(db.get(`${guild.id}.gameActive`)){
            var voiceChannel = member.voice.channel;
            channel.members.each(player => {
                player.voice.setChannel(guild.channels.cache.get(db.get(`${guild.id}.VCLobby`)));
            });
            let teamnumber = voiceChannel.name.charAt(5);
            db.set(`${guild.id}.game.team${teamnumber}.placement`, args[0]);
        }
        else message.reply("there is no game active!").then( msg => msg.delete({timeout: 5000}));
        
        //cleanup
        if(cleanup) message.delete({timeout: 1000});
    }
}