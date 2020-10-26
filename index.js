require('dotenv').config();
const createDatabase = require('./src/services/database');

const operations = {
    select: require('./src/operations/select'),
    schema: require('./src/operations/schema')
}

module.exports = async function (files = [], options = {}) {
    const database = await createDatabase(options.from, options.persist || options.from);

    const schemer = operations.schema(database);

    try {
        await Promise.all(files.map(path => database.addCsv(path)));
    } catch (err) {
        throw new Error('Failed to import files: ' + err.message);
    }

    return {
        select(...args) {
            return operations.select(database, args.join(' '));
        },

        async schema(command, ...args) {
            const op = String(command).toLowerCase();
            if(!op || typeof schemer[op] !== 'function') return 'Schema> Unknown operation';
            return await schemer[op](...args);
        },
        close: database.close
    }
}