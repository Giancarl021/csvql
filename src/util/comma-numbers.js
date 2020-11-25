module.exports = function (item) {
    const number = Number(item);

    if (isNaN(number)) {
        const n = Number(String(item).replace(/,/, '.'));

        if (isNaN(n)) {
            return item;
        } else {
            return n;
        }
    } else {
        return number;
    }
}