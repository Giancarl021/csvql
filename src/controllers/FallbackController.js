module.exports = function (error, _, response, next) {
    if (error) {
        console.error(error);
        response
            .status(error.statusCode || 500)
            .json({ error })
    } else {
        return next();
    }
}