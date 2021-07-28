const db = require('quick.db');

module.exports = {
    commands: 'ping',
    description: "pings the bot and returns latency and API latency.",
    minArgs: 0,
    permissions: '',
    requiredRoles:[],
    callback: async (message, args, text) => {

        //constants
        const { channel } = message;
        const cleanup = db.get(`${channel.guild.id}.cleanup`);

        //ping and pong
        const msg = await channel.send('Pinging...');
        msg.edit(`Pong!\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(message.client.ws.ping)}ms`);

        //cleanup
        if(cleanup){
            message.delete({ timeout: 10000 /*time unitl delete in milliseconds*/}); //user message
            msg.delete({ timeout: 10000 /*time unitl delete in milliseconds*/});     //bot message
        }
    }
}