const defaultType = process.env.CSVQL_DEFAULT_TYPE || 'text';

module.exports = function (columns, rows, depth = rows.length) {
    const map = {};

    columns.forEach(col => {
        map[col] = {
            type: null,
            isConcrete: false
        }
    });

    let i = 0,
        row = rows[i];
    
    while(i < depth) {
        for (const key in row) {
            if(map[key].isConcrete) continue;

            const data = row[key];
            if(!data) continue;

            if (typeof data === 'number') {
                if (Number.isInteger(data)) {
                    map[key].type = 'int'
                } else {
                    map[key].type = 'float'
                    map[key].isConcrete = true;
                }
            } else if(data === 'true' || data === 'false') {
                map[key].type = 'int';
                map[key].isConcrete = true;
            } else {
                map[key].type = 'text';
                map[key].isConcrete = true;
            }
        }
        row = rows[++i];
    }

    const r = [];

    for (const key in map) {
        r.push({
            name: key,
            type: map[key].type || defaultType
        });
    }

    return r;
}