const loadCommands = require('../load-commands.js');
const { hex } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    commands: ['help', 'h'],
    description: "Describes the bot's command",
    callback: (message, args, text) => {

        //constants
        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${guild.id}.cleanup`);

        //create help embed
        let embed = new MessageEmbed()
        .setColor(hex)
        .setTitle("Commands")
        .setDescription("below are my supported commands");

        //for each command of commands, check if member has permission to use, then add command description to embed. then send embed
        const commands = loadCommands();
        for(const command of commands) {

            //permission check
            let permissions = command.permissions;
            if(permissions) {
                let hasPermission = true;
                if(typeof permissions === 'string'){
                    permissions = [permissions];
                }
                for(const permission of permissions){
                    if(!member.hasPermission(permission)) {
                        hasPermission = false;
                        break;
                    }
                }
                if(!hasPermission) {
                    continue;
                }
            }

            //constants for the new embed field
            const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands[0];
            const eArgs = command.expectedArgs ? `${command.expectedArgs}` : '';
            const { description } = command;

            embed.addField(`${db.get(`${guild.id}.prefix`)}${mainCommand} ${eArgs}`, description);
        }
        channel.send(embed);

        //cleanup
        if(cleanup) message.delete({timeout: 1000});
    }
}