const useHistory = require('../services/history');

module.exports = function (appName = 'app') {
    const history = useHistory();
    return {
        sigint() {
            console.log(`\nFinishing ${appName} session...`);
            process.exit(0);
        },

        key({ name }) {
            
        }
    };
}