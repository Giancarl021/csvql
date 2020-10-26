const useHistory = require('../services/history');
const reprint = require('./reprint');

const appName = process.env.CSVQL_APP_NAME || 'csvql';

module.exports = function () {
    const history = useHistory();
    let opt = {};

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

    async function sigint() {
        console.log(`\nFinishing ${appName} session...`);
        if(opt.db) {
            await opt.db.close();
        }
        process.exit(0);
    }

    function key(key = {}) {
        const { name } = key;
        if(name && keys[name]) {
            keys[name]();
        }
    }

    function setOptions(options) {
        opt = options;
    }

    return {
        sigint,
        key,
        setOptions
    };
}