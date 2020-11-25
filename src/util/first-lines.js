const fs = require('fs');

module.exports = async function (path, lines = 1, encoding = 'utf8') {
    return await new Promise((resolve, reject) => {
        const rs = fs.createReadStream(path, { encoding });
        let acc = '';
        let pos = 0;
        let index;
        let lIndex = 0;
        rs.on('data', chunk => {
                index = chunk.indexOf('\n');
                acc += chunk;
                index !== -1 && ++lIndex === lines ? rs.close() : pos += chunk.length;
            })
            .on('close', () => resolve(acc.slice(0, pos + index).replace(/\r?\n/, '\n')))
            .on('error', reject)
    });
};