const express = require('express');
const routes = express.Router();

const QueryController = require('./controllers/QueryController');
const NotFoundController = require('./controllers/NotFoundController');

routes.get('/query', QueryController);

routes.all('*', NotFoundController);

module.exports = routes;