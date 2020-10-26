require('dotenv').config();
const createDatabase = require('./src/services/database');

const operations = {
    select: require('./src/operations/select'),
    schema: require('./src/operations/schema'),
}

module.exports = async function (files = [], options = {}) {
    const database = createDatabase(options.persist || null);

    try {
        await Promise.all(files.map(database.addCsv));
    } catch (err) {
        throw new Error('Failed to import files: ' + err.message);
    }

    return {
        select(...args) {
            return operations.select(database, args.join(' '));
        },

        schema(...args) {
            return 'Schemed> ' + args.join(', ');
        },

        close: database.close
    }
}