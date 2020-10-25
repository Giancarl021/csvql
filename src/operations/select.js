module.exports = function (database, query) {
    return database.query('select ' + query);
}