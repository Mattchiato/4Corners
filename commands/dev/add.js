module.exports = {
    commands: ['add', 'addition'],
    description: "adds two arguments and returns the sum. (DEV ONLY)",
    expectedArgs: '<num1> <num2>',
    minArgs: 2,
    maxArgs: 2,
    permissions: 'ADMINISTRATOR',
    requiredRoles:[],
    requiredChannel: 'dev',
    callback: (message, args, text) => {

        //constants
        const { channel } = message;
        let num1 = +args[0];
        let num2 = +args[1];

        //respond result
        channel.send(`numbers added equals: ${num1+num2}`);
    }
}