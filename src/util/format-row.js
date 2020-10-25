module.exports = function (keys) {
    if(!Array.isArray(keys)) throw new Error('Keys must be an array');

    return data => {
        const r = [];
        keys.forEach(key => r.push(data[key] || ''));
        return r;
    }
}