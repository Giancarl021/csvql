const question = require('./util/question');
const cleanup = require('./util/cleanup');
const createExecutionMap = require('./util/execution-map');
const help = require('./services/help');

const appName = process.env.CSVQL_APP_NAME || 'csvql';

module.exports = async function (executor) {
    const map = createExecutionMap(executor, [ 'close' ]);

    const kill = question(`${appName}> `, callback, { db: executor });

    async function callback(response) {
        const [command, ...args] = cleanup(response, (e, i) => i === 0 ? e.toLowerCase() : e);

        if (!command) return;

        if(command === 'exit') {
            kill();
            return;
        }

        if (command === 'help') {
            console.log(help());
            return;
        }

        if (map[command]) {
            try {
                console.log(await executor[command](...args));
            } catch (error) {
                console.error('Error: ' + error.message);
            }
        } else {
            console.log('Unknown command. Use "help" to see available commands');
        }
    }
}