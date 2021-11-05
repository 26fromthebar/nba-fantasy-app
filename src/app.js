const express = require('express');
const path = require('path');
require('./db/mongoose');
const playerRouter = require('./routers/playerRouter');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDirectoryPath));
app.use(playerRouter);

module.exports = app;
