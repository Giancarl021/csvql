const createDatabase = require('better-sqlite3');

module.exports = function (location = null) {
    const database = createDatabase(location || ':memory:');

    function addCsv(path) {
        
    }

    return {
        query: database.exec,
        close: database.close,
        addCsv
    }
}