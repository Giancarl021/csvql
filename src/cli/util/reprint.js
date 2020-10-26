module.exports = function (rl) {
    return line => {
        process.stdout.clearLine();
        // process.stdout.cursorTo(0);
        rl.write(line);
    }
}