require('dotenv').config();

module.exports = function (files, options) {

    return {
        select(...args) {
            return 'Selected> ' + args.join(', ');
        },

        schema(...args) {
            return 'Schemed> ' + args.join(', ');
        }
    }
}