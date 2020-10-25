module.exports = function (executor) {
    return Object
        .keys(executor)
        .filter(key => typeof executor[key] === 'function')
        .reduce((acc, item) => {
            acc[item] = true;
            return acc;
        }, {});
}