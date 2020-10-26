const readline = require('readline');
const createEventListeners = require('./events');

const events = createEventListeners();

module.exports = function (question, callback, eventsOptions = {}) {
    events.setOptions(eventsOptions);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: question
    });
    rl.on('SIGINT', events.sigint);

    rl.on('line', async answer => {
            const command = answer.replace(/^[\w\s]+>\s/, '');
            await callback(command);
            rl.prompt();
        });
    
    rl.prompt();

    return () => {
        rl.emit('SIGINT');
    };
}

readline.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (_, key) => events.key(key));
process.stdin.setRawMode(true);