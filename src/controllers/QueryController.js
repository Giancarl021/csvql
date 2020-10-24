const { spawnSync, execSync: exec } = require('child_process');

const path = process.env.VOLUME_PATH || '/volume';

module.exports = function (request, response) {
    const { sql } = request.query;

    const result = spawnSync('textql', ['-header', '-sql', sql], {
        cwd: path,
        stdio: 'inherit',
        windowsVerbatimArguments: true
    })

    // const result = exec(`${command} -header -sql "${sql}" .`);

    return response.json({ result });
}