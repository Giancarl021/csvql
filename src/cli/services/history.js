const size = process.env.CSVQL_HISTORY_SIZE || 1000;

module.exports = function () {
    const history = [''];
    let pointer = 0;

    function add(command) {
        history.splice(1, 0, command);
        if(history.length > size) {
            history.length = size;
        }
        pointer = 0;
        // console.log(history);
    }

    function get(index) {
        return history[index];
    }

    function next() {
        if (pointer === 0) return null;
        // console.log(pointer - 1);
        return get(pointer--);
    }

    function prev() {
        if(pointer === history.length - 1) return null;
        // console.log(pointer + 1);
        return get(pointer++);
    }

    return {
        add,
        prev,
        next
    }
}