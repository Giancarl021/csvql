require('dotenv').config();

module.exports = function () {

    return {
        select(...args) {
            return 'Selected> ' + args.join(', ');
        },

        schema(...args) {
            return 'Schemed> ' + args.join(', ');
        }
    }
}