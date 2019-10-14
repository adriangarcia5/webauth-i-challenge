const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('./users-model');

const protected = require('../auth/protected-middleware');

const router = express();

// POST /api/register Endpoint
router.post('/register', (req, res) => {
  const user = req.body;

  if (user.username && user.password) {
    const hash = bcrypt.hashSync(user.password, 8);

    user.password = hash;

    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    res
      .status(400)
      .json({ message: 'Please provide registration information' });
  }
});

// POST /api/login Endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res
            .status(200)
            .json({ message: `Welcome, ${user.username}! You're logged in!` });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({ message: 'Please provide credentials' });
  }
});

// GET /api/users Endpoint
router.get('/users', protected, (req, res) => {
  // res.send('GET /api/users endpoint');
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// function protected(req, res, next) {
//   const { username, password } = req.headers;

//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         next();
//       } else {
//         res.status(401).json({ message: 'You shall not pass!' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     });
// }

module.exports = router;