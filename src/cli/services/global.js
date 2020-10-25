module.exports = function () {
    const appName = process.env.APP_NAME || 'csvql';
    global.appName = appName;
}