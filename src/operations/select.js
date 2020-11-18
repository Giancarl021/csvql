module.exports = function (database, query) {
    const result = database.query('select ' + query);

    return result;
}