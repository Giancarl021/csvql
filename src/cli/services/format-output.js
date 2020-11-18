const { table: createTable } = require('table');
const createRowFormatter = require('../../util/format-row');
const getPadding = require('../util/padding');

module.exports = function (result, command) {
    let str = result;

    switch (command) {
        case 'select':
            if (typeof result === 'object') {
                if (!result.length) {
                    str = '';
                    break;
                }

                const headers = Object.keys(result[0]);
                const formatRow = createRowFormatter(headers);
                const data = result.map(formatRow);

                str = createTable([headers, ...data]);
            }
            break;
        case 'schema':
            if (!result) {
                str = '';
                break;
            }

            if (typeof result === 'number') {
                str = `Table(s) loaded in ${result.toFixed(2)} seconds`;
            }

            if (Array.isArray(result)) {
                if (result.length === 0) {
                    str = '';
                    break;
                }

                str = '';

                for (const table of result) {
                    const headers = Object.keys(table.columns[0]);
                    const formatRow = createRowFormatter(headers);
                    const data = table.columns.map(formatRow);

                    let tableStr = createTable([headers, ...data])
                        .replace('╗', '╢')
                        .replace('╔', '╟');

                    const width = tableStr.split('\n').shift().length;

                    const [padL, padR] = getPadding((width - 2 - table.name.length) / 2);

                    const tableName = table.name.length > width - 2 ?
                        table.name.slice(0, width - 5) + '...' :
                        padL + table.name + padR;

                    let header = '╔' + new Array(width - 2).fill('═').join('') + '╗\n' +
                        '║' + tableName + '║';

                    str += header + '\n' + tableStr;
                }
            }

            break;

        default:
            str = result || '';
    }

    return str;
}