module.exports = function (database) {
    return {
        list() {
            return database.tables;
        },

        drop(tableName) {
            if (!tableName) return;

            database.drop(tableName);
        },

        async import(...pieces) {
            const _pieces = pieces.join(' ').split(',');
            const files = _pieces.map(piece => {
                if(/^(.*)\sas\s(.*)$/i.test(piece)) {
                    const [path, name] = piece.split(/\sas\s/).map(e => e.trim());
                    return { path, name };
                } else {
                    return { path: piece };
                }
            });

            let delta = 0;

            await Promise.all(files.map(file =>
                database.addCsv(file.path, file.name)
                .then(d => delta += d)
                .catch(err => {
                    throw new Error(`Failed to import ${file.path}: ${err.message}`);
                })
            ));

            return delta;
        }
    }
}