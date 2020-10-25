const size = process.env.CSVQL_HISTORY_SIZE || 1000;

module.exports = function () {
    const history = [];
    let pointer = 0;

    function add(command) {
        history.unshift(command);
        if(history.length > size) {
            history.length = size;
        }
        pointer = 0;
    }

    function get(index) {
        return history[index];
    }

    function prev() {
        if (pointer === 0) return get(pointer);
        return get(pointer--);
    }

    function next() {
        if(pointer === history.length - 1) return get(pointer);
        return get(pointer++);
    }

    return {
        add,
        prev,
        next
    }
}