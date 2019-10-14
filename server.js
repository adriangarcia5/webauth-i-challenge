const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const UserRouter = require('./users/users-router');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send(`<h1>Hello World from WebAuth I Challenge!</h1>`);
});

server.use('/api', UserRouter);

module.exports = server;