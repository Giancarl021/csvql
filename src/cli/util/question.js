const readline = require('readline');
const createEventListeners = require('./events');

const events = createEventListeners();

module.exports = function (question) {
    const prefixSize = appName.length + 2;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.write(question);

    rl.on('SIGINT', events.sigint);

    return new Promise(resolve => {
        rl.on('line', answer => {
            const command = answer.replace(/^(.*?)>\s/, '');
            rl.close();
            return resolve(command);
        });
    });
}

readline.emitKeypressEvents(process.stdin);
process.stdin.on('keypress', (_, key) => events.key(key));
process.stdin.setRawMode(true);