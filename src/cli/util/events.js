const appName = process.env.CSVQL_APP_NAME || 'csvql';

module.exports = function () {
    let opt = {};

    const keys = {}

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