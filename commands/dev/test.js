const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    commands: 'test',
    description: "a command specific to testing whatever is in the callback. (DEV ONLY)",
    minArgs: 0,
    permissions: 'ADMINISTRATOR',
    requiredRoles:[],
    requiredChannel: 'dev',
    callback: async (message, args, text) => {
        //used only in testing
    }
}