const commas = require('./comma-numbers');

module.exports = function (headers) {
    return (row, parseCommas = false) => {
        const r = {},
            l = headers.length;

        for (let i = 0; i < l; i++) {
            const item = row[i],
                header = headers[i];

            r[header] = parseCommas ? commas(item) : (isNaN(Number(item)) ? item : Number(item));
        }

        return r;
    }
}