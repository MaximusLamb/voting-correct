const User = require('../models/User');

const usernamePasswordReader = authorization => {
  const [username, password] = Buffer
    .from(authorization?.split(' ')[1], 'base64')
    .toString()
    .split(':');

    return {
      username,
      password
    };
};

const ensureAuth = (req, res, next) => {
  const { username, password } = usernamePasswordReader(req.headers.authorization);

  User
    .authorized(username, password)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

    module.exports = {
      usernamePasswordReader,
      ensureAuth
};