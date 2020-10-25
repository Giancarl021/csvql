module.exports = function (line) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(line);
}