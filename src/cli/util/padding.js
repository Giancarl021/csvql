module.exports = function (n) {
    if (n <= 0) return ['', ''];
    return [pad(Math.floor(n)), pad(Math.ceil(n))];

    function pad(n) {
        return new Array(n)
            .fill(' ')
            .join('');
    }
}