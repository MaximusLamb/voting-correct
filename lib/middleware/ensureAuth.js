const User = require('../models/User');

module.exports = (req, res, next) => {
  const userToken = req.cookies.session;
  const user = User.verifyToken(userToken);
  req.user = user;

  next();
};
