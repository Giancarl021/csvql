require('dotenv').config();
const createDatabase = require('./src/services/database');

const operations = {
    select: require('./src/operations/select'),
    schema: require('./src/operations/schema'),
}

module.exports = function (files, options = {}) {
    const database = createDatabase(options.persist || null);

    files.forEach(database.addCsv);

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