const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');

const AuthRouter = require('./auth/auth-router');
const UserRouter = require('./users/users-router');

const db = require('./data/db-config');
const protected = require('./auth/protected-middleware');

const server = express();

const KnexSessionStore = connectSessionKnex(session);

const sessionConfig = {
  name: 'Astros',
  secret: 'keep it like a secret',
  cookies: {
    maxAge: 1000 * 60 * 60,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30,
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
  res.send(`<h1>Hello World from WebAuth I Challenge!</h1>`);
});

server.use('/api/auth', AuthRouter);
server.use('/api/users', UserRouter);

module.exports = server;