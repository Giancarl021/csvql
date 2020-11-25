module.exports = function (row, delimiter = ',') {
    return String(row)
        .split(delimiter)
        .map(chunk => {
            return chunk.replace(/"/g, '')
            .replace(/\r$/, '')
        });
}