const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const FallbackController = require('./controllers/FallbackController');

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

app.use(FallbackController);

module.exports = app;