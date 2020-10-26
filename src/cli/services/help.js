module.exports = function () {
    return 'select <sql query>: Queries into imported schemas.\n' +
        'schema <operation>: Manage the schemas of the current session.\n' +
        '  list: List all tables and columns available.\n' +
        '  import <path [as <tableName>[, ...]]>: Import a new schema from CSV file(s).\n' +
        '  drop <tableName>: Delete a table of the current session.\n' +
        'help: List all available commands.\n' +
        'exit: Close the current session.\n';
}