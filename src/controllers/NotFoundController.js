module.exports = function (request, response) {
    return response.json({
        error: `Cannot ${request.method} on ${request.path}`
    });
}