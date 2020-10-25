const { table } = require('table');
const createRowFormatter = require('../util/format-row');

module.exports = function (database, query) {
    const result = database.query('select ' + query);
    if (!result.length) return '\n';

    const headers = Object.keys(result[0]);
    const formatRow = createRowFormatter(headers);
    const data = result.map(formatRow);

    return table([ headers, ...data ]);
}