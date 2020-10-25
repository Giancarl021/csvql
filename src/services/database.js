const createDatabase = require('better-sqlite3');
const fs = require('fs');
const { basename } = require('path');
const csv = require('csv-parser');
const stripBom = require('strip-bom-stream');
const createRowFormatter = require('../util/format-row');

module.exports = function (location = null) {
    const database = createDatabase(location || ':memory:');

    async function addCsv(path) {
        if(!fs.existsSync(path) || !fs.lstatSync(path).isFile()) {
            throw new Error('Invalid input file: ' + path);
        }

        const table = basename(path).replace(/\.\w+$/, '');

        let formatRow, insert;

        await new Promise(resolve => {
            fs.createReadStream(path)
            .pipe(stripBom())
            .pipe(csv(true))
            .on('error', err => {
                throw err;
            })
            .on('headers', headers => {
                database.exec(`CREATE TABLE "${table}" (${headers.map(header => `"${header}" text`).join(',')})`);
                formatRow = createRowFormatter(headers);
                const statement = `INSERT INTO "${table}" (${headers.map(header => `"${header}"`).join(',')}) VALUES(${new Array(headers.length).fill('?').join(',')})`;
                insert = database.prepare(statement);
            })
            .on('data', row => {
                insert.run(...formatRow(row));
            })
            .on('end', () => resolve());
        });
    }

    function query(statement) {
        const st = database.prepare(statement);
        return st.all();
    }

    const db = {
        query,
        close: database.close.bind(database),
        addCsv
    };

    global.database = db;

    return db;
}