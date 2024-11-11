require('dotenv/config');
const createDatabase = require('./src/services/database');

const operations = {
    select: require('./src/operations/select'),
    schema: require('./src/operations/schema')
}

const defaultOptions = {
    from: null,
    persist: null,
    disk: null,
    parseCommaAsDecimal: false
};

module.exports = async function (files = [], options = defaultOptions) {
    const database = await createDatabase(options.from, options.persist || options.from, options.disk, options.parseCommaAsDecimal);
    const schemer = operations.schema(database);

    let loadTime = 0;

    try {
        await Promise.all(files.map(async path => loadTime += await database.addCsv(path)));
    } catch (err) {
        throw new Error('Failed to import files: ' + err.message);
    }

    return {
        select(...args) {
            return operations.select(database, args.join(' '));
        },

        async schema(command, ...args) {
            const op = String(command).toLowerCase();
            if (!op || typeof schemer[op] !== 'function') throw new Error('Unknown operation');
            return await schemer[op](...args);
        },
        close: database.close,
        loadTime
    }
}