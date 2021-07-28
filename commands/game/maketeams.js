const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const { hex } = require('../../config.json');

module.exports = {
    commands: ['maketeams', 'mt'],
    description: "ends the current game of 4 corners",
    expectedArgs: '<duos/trios>',
    minArgs: 1,
    maxArgs: 1,
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel, member} = message;
        const { guild } = channel;
        const cleanup = db.get(`${message.channel.guild.id}.cleanup`);

        //if game active, make teams
        //else respond game not active
        if(db.get(`${guild.id}.gameActive`)){

            //if args cannot be read, respond cannot be read
            //else make teams
            if(args[0] !== "duos" && args[0] !== "trios")
                message.reply(`Cannot specify: ${args[0]}, please type duos or trios depending on what teams you want!`).then(msg => msg.delete({timeout: 5000}));
            else {

                //grab players and store in database
                guild.channels.cache.get(db.get(`${guild.id}.VCLobby`)).members.each(player => {
                    db.push(`${guild.id}.game.players`, player.id);
                });

                //get player list, shuffle array, then split array to correct party sizes
                const players = db.get(`${message.guild.id}.game.players`);
                shuffle(players);
                switch(args[0]){
                    case "duos":
                        var teams = splitarray(players, 2);
                        var partylimit = 2;
                        break;
                    case "trios":
                        var teams = splitarray(players, 3);
                        var partylimit = 3;
                        break;
                }

                //db update
                db.set(`${guild.id}.game.teamamount`, teams.length);
                db.set(`${guild.id}.game.teamsize`, partylimit);
                for(let i = 0; i < teams.length; i++){
                    db.set(`${guild.id}.game.team${i+1}`, {
                        playersid: teams[i],
                        placement: 20,
                        teamnumber: i+1,
                        vcid: ''
                    });
                    let parentCategory = await guild.channels.cache.get(db.get(`${guild.id}.VCCategory`));
                    let vc = await guild.channels.create(`Team ${i+1}`, {
                        type: "voice",
                        parent: parentCategory});
                    db.push(`${guild.id}.game.teamvc`, vc.id);
                    db.set(`${guild.id}.game.team${i+1}.vcid`, vc.id);
                }


                //create new embed and delete old message
                let embed = new MessageEmbed()
                    .setColor(hex)
                    .setTitle("4 Corners")
                    .setDescription(`A new game of 4 Corners has been started by <@${member.id}>. Teams have been chosen, grab your teammate(s) and everyone but party leader should ready up!`);

                    if(args[0]=="duos"){
                        for(let i = 0; i < teams.length; i++){
                            embed.addField(`Team ${i+1}:`, `<@${teams[i][0]}>, <@${teams[i][1]}>`);
                        }  
                    }
                    else {
                        for(let i = 0; i < teams.length; i++){
                            embed.addField(`Team ${i+1}:`, `<@${teams[i][0]}>, <@${teams[i][1]}>, <@${teams[i][2]}>`);
                        }  
                    }

                channel.messages.fetch(db.get(`${guild.id}.game.gameMessage`)).then(msg => msg.delete());
                const newMessage = await channel.send(embed);
                db.set(`${guild.id}.game.gameMessage`, newMessage.id);
            }
        }
        else message.reply("there is no game active!").then( msg => msg.delete({timeout: 5000}));


        //cleanup
        if(cleanup) message.delete({timeout: 5000});      
    }
}


//Fisher-Yates Array Shuffle
function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

//dbaseman (Stack Overflow) Array Split
function splitarray(array, chunkSize) {
    return [].concat.apply([],
      array.map(function(elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }