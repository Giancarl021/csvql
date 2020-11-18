module.exports = function (keys) {
    if(!Array.isArray(keys)) throw new Error('Keys must be an array');

    return data => {
        const r = [];
        keys.forEach(key => r.push(parse(data[key])));
        return r;
    }

    function parse(row) {
        if(!row && typeof row !== 'number') return null;

        if(row === 'true' || row === 'false') {
            return row === 'true' ? 1 : 0;
        }

        return row;
    }
}