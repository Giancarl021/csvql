const createDatabase = require('better-sqlite3');
const fs = require('fs');
const { basename } = require('path');
const { detect } = require('csv-string');
const locate = require('../util/locate');
const csv = require('fast-csv');
const stripBom = require('strip-bom-stream');
const createRowFormatter = require('../util/format-row');
const getColumns = require('./column-parser');

const firstLines = require('../util/first-lines');
const createCaster = require('../util/cast-row');
const parseRow = require('../util/parse-row');
const commaNumber = require('../util/comma-numbers');

module.exports = async function (fromPath = null, persistPath = null, disk = null, parseNumbersWithCommas = false) {
    const database = createDatabase(disk || ':memory:');

    database.pragma('journal_mode = WAL');
    const tables = [];

    if(fromPath) {
        if(!fs.existsSync(fromPath)) {
            throw new Error('Invalid import path: ' + fromPath);
        }

        const disk = createDatabase(fromPath);
        disk.pragma('journal_mode = WAL');

        const importedTables = disk.prepare('SELECT * FROM sqlite_master').all();

        await Promise.all(
            importedTables.map(async ({ sql, name }) => {
                database.exec(sql);
                const rows = disk.prepare(`select * from "${name}"`).all();
                const headers = Object.keys(rows[0]);
                const formatRow = createRowFormatter(headers);
                const columns = getColumns(headers, rows);

                const statement = `INSERT INTO "${name}" (${headers.map(header => `"${header}"`).join(',')}) VALUES(${new Array(headers.length).fill('?').join(',')})`;
                const insert = database.prepare(statement);

                rows.forEach(row => insert.run(...formatRow(row)));

                tables.push({
                    name,
                    columns
                });
            })
        );

        disk.close();
    }

    async function addCsv(path, asTable = null) {
        const st = Date.now();

        const _path = locate(path, true);
        if(!fs.existsSync(_path) || !fs.lstatSync(_path).isFile()) {
            throw new Error('Invalid input file: ' + _path);
        }

        const [meta, ...lines] = (await firstLines(_path, 10))
            .split('\n');
        let skipFirstLine = false,
            delimiter,
            headers,
            columns,
            castRow;

        if (/sep=./i.test(meta)) {
            if (!lines.length) return;
            skipFirstLine = true;
            delimiter = meta
                .split('sep=')
                .pop()
                .slice(0, 1);

            headers = parseRow(lines[0], delimiter);

            castRow = createCaster(headers);

            columns = getColumns(
                headers,
                lines
                    .slice(1)
                    .map(r => castRow(parseRow(r, delimiter), parseNumbersWithCommas))
            );
        } else {
            if (![meta, ...lines].length) return;
            delimiter = detect(`${meta}\n${lines.join('\n')}`);
            headers = parseRow(meta, delimiter);

            castRow = createCaster(headers);

            columns = getColumns(headers, lines.map(r => castRow(parseRow(r, delimiter), parseNumbersWithCommas)));
        }

        const table = (asTable ? asTable.trim() : false) || basename(_path).replace(/\.\w+$/, '');

        database.exec(`CREATE TABLE "${table}" (${columns.map(col => `"${col.name}" ${col.type}`).join(',')})`);

        const statement = `INSERT INTO "${table}" (${headers.map(header => `"${header}"`).join(',')}) VALUES(${new Array(headers.length).fill('?').join(',')})`;
        const insert = database.prepare(statement);

        const formatRow = createRowFormatter(headers);

        const readStream = fs.createReadStream(_path, { encoding: 'utf8' });

        await new Promise((resolve, reject) => {
            readStream
                .pipe(stripBom())
                .pipe(csv.parse({
                    headers: true,
                    trim: true,
                    delimiter,
                    skipLines: skipFirstLine ? 1 : 0,
                    ignoreEmpty: true
                }))
                .on('data', row => {
                    const r = formatRow(row);
                    insert.run(...(parseNumbersWithCommas ? r.map(commaNumber) : r));
                })
                .on('error', reject)
                .on('end', () => {
                    readStream.close();
                    resolve();
                });
        });

        tables.push({
            name: table,
            columns
        });

        return (Date.now() - st) / 1000;
    }

    function rename(tableName, newName) {
        try {
            database
                .prepare(`ALTER TABLE "${tableName}" RENAME TO "${newName}"`)
                .run();
            
            const i = tables.findIndex(t => t.name === tableName);
            tables[i].name = newName;
            
        } catch (err) {
            throw err;
        }
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
        if (persistPath) await save(persistPath);
        database.close();
        if (disk) fs.unlinkSync(disk);
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
        rename,
        addCsv
    };
}