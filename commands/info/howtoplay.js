const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { hex } = require('../../config.json');

module.exports = {
    commands: 'howtoplay',
    description: "describes step by step how to organize and play a game",
    minArgs: 0,
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel, member } = message;
        const { guild } = channel;
        const cleanup = db.get(`${guild.id}.cleanup`);

        //create embed and send
        let embed = new MessageEmbed()
            .setColor(hex)
            .setTitle("4 Corners")
            .setDescription(`Here is a step by step guide of when to call each command to smoothly run a game of 4 Corners. This is a game that puts team against team to battle it out and see who can climb to victory! First things to start a game is to get everyone on the same data center. This can be done on the main menu by pressing escape when in the apex lobby.`)
            .addField(`${db.get(`${guild.id}.prefix`)}newgame`, `The first command for playing a game of 4 Corners. Saying this tells Shoto that you wish to start a new game of 4 Corners. He will reply that a new game has been started by @(GameMaster) and that you should join <#${db.get(`${guild.id}.VCLobby`)}>. The next command should not be given until everyone is in the voice chat designated as the lobby to Shoto.`)
            .addField(`${db.get(`${guild.id}.prefix`)}maketeams <duos/trios>`, `The second command given defines whether this will be a game in duos or trios. You must spell it completely in order for the bot to understand. Once this command is executed, Shoto will reply with randomized teams with the size depending on the argument given. Do not join the new voice channels just yet, we need to make sure everyone is ready as explained in the next command.`)
            .addField(`${db.get(`${guild.id}.prefix`)}startgame`, `To move on to the next command, everyone needs to group up with their party, also make sure that you are on either duos/trios depending on what type of 4 Corners you are doing. Then everyone except Party Leaders will ready up. Once every team has gotten this done someone will start a countdown and the party leaders must all ready up at the same time. Once at the champion screen in-game, you can confirm if everyone is in the right server. To then proceed with the game, someone must start the game with the command and everyone will be moved to the voice channels.`)
            .addField(`${db.get(`${guild.id}.prefix`)}placed <placement>`, `So you are playing the game but what happens once you die or win? someone on your team must pass the placed command. this tells the bot how you did in the game and it can produce the result card at the end. If you placed 5th for example, you would say ?placed 5. Or if you won you would say ?placed 1. Saying this command moves your team back to the voice channel lobby.`)
            .addField(`${db.get(`${guild.id}.prefix`)}endgame`, `Once the game is over and everyone has told Shoto their placements, you can type in this command to produce the results card. This will show the teams in order of placement. Kudos if you are the first team on the card, that means you won the game of 4 Corners!`);

        channel.send(embed);

        //cleanup
        if(cleanup) message.delete({ timeout: 10000 /*time unitl delete in milliseconds*/});
    }
}