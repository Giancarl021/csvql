const question = require('./util/question');
const cleanup = require('./util/cleanup');
const createExecutionMap = require('./util/execution-map');

module.exports = async function (executor) {
    const map = createExecutionMap(executor);

    while(true) {
        const response = await question(`${appName}> `);
        const [command, ...args] = cleanup(response, e => e.toLowerCase());

        if(!command) continue;

        if(map[command]) {
            try {
                console.log(await executor[command](...args));
            } catch (error) {
                console.error('Error: ' + error.message);
            }
        } else {
            console.log('Unknown command');
        }
    }
}