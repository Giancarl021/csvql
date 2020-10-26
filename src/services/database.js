const createDatabase = require('better-sqlite3');
const fs = require('fs');
const { basename } = require('path');
const csv = require('csv-parse/lib/sync');
const stripBom = require('strip-bom');
const createRowFormatter = require('../util/format-row');
const getColumns = require('./column-parser');

module.exports = function (persistPath = null) {
    const database = createDatabase(':memory:');

    async function addCsv(path) {
        if(!fs.existsSync(path) || !fs.lstatSync(path).isFile()) {
            throw new Error('Invalid input file: ' + path);
        }

        const table = basename(path).replace(/\.\w+$/, '');
        const content = stripBom(fs.readFileSync(path, 'utf8'));

        const rows = csv(content, {
            cast: true,
            columns: true,
            trim: true
        });

        if (!rows.length) return;

        const headers = Object.keys(rows[0]);
        const formatRow = createRowFormatter(headers);

        const columns = getColumns(headers, rows)
            .map(col => `"${col.name}" ${col.type}`)
            .join(',');

        database.exec(`CREATE TABLE "${table}"(${columns})`);

        const statement = `INSERT INTO "${table}" (${headers.map(header => `"${header}"`).join(',')}) VALUES(${new Array(headers.length).fill('?').join(',')})`;
        const insert = database.prepare(statement);

        rows.forEach(row => insert.run(...formatRow(row)));
    }

    function query(statement) {
        const st = database.prepare(statement);
        return st.all();
    }

    async function close() {
        if(persistPath) await database.backup(persistPath);
        database.close();
    }

    return {
        query,
        close,
        addCsv
    };
}