const createDatabase = require('better-sqlite3');
const fs = require('fs');
const { basename } = require('path');
const locate = require('../util/locate');
const csv = require('csv-parse/lib/sync');
const stripBom = require('strip-bom');
const createRowFormatter = require('../util/format-row');
const getColumns = require('./column-parser');

module.exports = async function (fromPath = null, persistPath = null) {
    const database = createDatabase(':memory:');
    const tables = [];

    if(fromPath) {
        const disk = createDatabase(fromPath);
        await disk.backup(':memory:');
    }

    async function addCsv(path, asTable = null) {
        const _path = locate(path, true);
        if(!fs.existsSync(_path) || !fs.lstatSync(_path).isFile()) {
            throw new Error('Invalid input file: ' + _path);
        }

        const table = (asTable ? asTable.trim() : false) || basename(_path).replace(/\.\w+$/, '');
        const content = stripBom(fs.readFileSync(_path, 'utf8'));

        const rows = csv(content, {
            cast: true,
            columns: true,
            trim: true
        });

        if (!rows.length) return;

        const headers = Object.keys(rows[0]);
        const formatRow = createRowFormatter(headers);

        const columns = getColumns(headers, rows);

        database.exec(`CREATE TABLE "${table}"(${columns.map(col => `"${col.name}" ${col.type}`).join(',')})`);

        const statement = `INSERT INTO "${table}" (${headers.map(header => `"${header}"`).join(',')}) VALUES(${new Array(headers.length).fill('?').join(',')})`;
        const insert = database.prepare(statement);

        rows.forEach(row => insert.run(...formatRow(row)));

        tables.push({
            name: table,
            columns
        });
    }

    function drop(tableName) {
        database
            .prepare(`DROP TABLE IF EXISTS "${tableName}"`)
            .run();
        
        const index = tables.find(table => table.name.toLowerCase() === tableName.toLowerCase());
        tables.splice(index, 1);
    }

    function query(statement) {
        const st = database.prepare(statement);
        return st.all();
    }

    async function close() {
        if(persistPath) await save(persistPath);
        database.close();
    }

    async function save(path) {
        fs.mkdirSync(path.replace(basename(path), ''), {
            recursive: true
        });
        await database.backup(path);
    }

    return {
        query,
        close,
        save,
        tables,
        drop,
        addCsv
    };
}