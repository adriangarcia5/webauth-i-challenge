const express = require('express');

const Users = require('./users-model');

const router = express();

// POST /api/register Endpoint
router.post('/register', (req, res) => {
  res.send('POST /api/register endpoint');
});

// POST /api/login Endpoint
router.post('/login', (req, res) => {
  res.send('POST /api/login endpoint');
});

// GET /api/users Endpoint
router.get('/users', (req, res) => {
  res.send('GET /api/users endpoint');
});

module.exports = router;