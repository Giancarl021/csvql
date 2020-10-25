const useHistory = require('../services/history');
const reprint = require('./reprint');

module.exports = function () {
    const history = useHistory();

    const keys = {
        up() {
            const prev = history.prev();
            if(!prev) return;
            reprint(`${appName}> ${prev}`);
        },

        down() {
            const next = history.next();
            if(!next) return;
            reprint(`${appName}> ${next}`);
        },
        return() {
            history.add('command X');
        }
    }

    function sigint() {
        console.log(`\nFinishing ${appName} session...`);
        process.exit(0);
    }

    function key(key = {}) {
        const { name } = key;
        if(name && keys[name]) {
            keys[name]();
        }
    }

    return {
        sigint,
        key
    };
}