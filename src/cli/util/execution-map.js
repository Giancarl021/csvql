module.exports = function (executor, exclude = []) {
    return Object
        .keys(executor)
        .filter(key => typeof executor[key] === 'function' && !exclude.includes(key))
        .reduce((acc, item) => {
            acc[item] = true;
            return acc;
        }, {});
}