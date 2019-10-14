const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

// brought in from user router at the bottome/commented out

module.exports = function protected(req, res, next) {
  const { username, password } = req.headers;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};