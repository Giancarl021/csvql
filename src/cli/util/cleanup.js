module.exports = function (command, mapper = e => e) {
    const pieces = command
        .split(/\s+/)
        .map(mapper);

    const r = [];

    for (const piece of pieces) {
        if(!isNaN(Number(piece))) r.push(Number(piece));
        else r.push(piece);
    }

    return r;
}