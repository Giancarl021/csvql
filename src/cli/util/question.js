const readline = require('readline');
const createEventListeners = require('./events');

const events = createEventListeners();

module.exports = function (question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', events.sigint);

    rl.setPrompt(question, question.length + 1);

    return new Promise(resolve => {
        rl.on('line', answer => {
            rl.setPrompt(question, question.length + 1);
            rl.prompt();
            const command = answer.replace(/^(.*?)>\s/, '');
            rl.close();
            return resolve(command);
        });
    });
}

readline.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (_, key) => events.key(key));
process.stdin.setRawMode(true);