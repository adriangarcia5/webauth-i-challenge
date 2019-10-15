const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

const router = express();

// POST /api/auth/register Endpoint
router.post('/register', (req, res) => {
  const user = req.body;

  if (user.username && user.password) {
    const hash = bcrypt.hashSync(user.password, 8);

    user.password = hash;

    Users.add(user)
      .then(saved => {
        req.session.user = { id: saved.id };
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

// POST /api/auth/login Endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.user = { id: user.id };

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

// GET /api/auth/logout Endpoint
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({ message: `You can checkout, but you can't leave` });
      } else {
        res.status(200).json({ message: `You've successfully logged out` });
      }
    });
  }
});

module.exports = router;
