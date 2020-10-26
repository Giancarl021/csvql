const { table: createTable } = require('table');
const createRowFormatter = require('../util/format-row');

module.exports = function (database) {
    return {
        list() {
            const tables = database.tables;
            if (!tables.length) return '\n';

            let str = '';

            for (const table of tables) {
                const headers = Object.keys(table.columns[0]);
                const formatRow = createRowFormatter(headers);
                const data = table.columns.map(formatRow);

                let tableStr = createTable([headers, ...data])
                    .replace('╗', '╢')
                    .replace('╔', '╟');

                const width = tableStr.split('\n').shift().length;

                const [padL, padR] = getPadding((width - 2 - table.name.length) / 2);

                const tableName = table.name > width - 2 ?
                    table.name.slice(0, width - 5) + '...' :
                    padL + table.name + padR;

                let header = '╔' + new Array(width - 2).fill('═').join('') + '╗\n' +
                    '║' + tableName + '║';

                str += header + '\n' + tableStr;
            }

            return str;
        },

        drop(tableName) {
            if (!tableName) return;

            database.drop(tableName);
            return '';
        },

        async import(...pieces) {
            const _pieces = pieces.join(' ').split(',');
            const files = _pieces.map(piece => {
                if(/^(.*)\sas\s(.*)$/i.test(piece)) {
                    const [path, name] = piece.split('as').map(e => e.trim());
                    return { path, name };
                } else {
                    return { path: piece };
                }
            });

            let errors = 0;
            await Promise.all(files.map(file =>
                database.addCsv(file.path, file.name)
                .catch(err => {
                    errors++;
                    console.log(`Failed to import ${file}: ${err.message}`);
                })
            ));

            return errors === files.length ?
                `Failed to import tables${files.length > 1 ? 's' : ''}` :
                `Schema${files.length > 1 ? 's' : ''} imported`;
        }
    }

    function getPadding(n) {
        return [pad(Math.floor(n)), pad(Math.ceil(n))];

        function pad(n) {
            return new Array(n)
                .fill(' ')
                .join('');
        }
    }
}